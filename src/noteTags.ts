import { resolveLocalizedText } from "./i18n";
import { Encounter, EventSummary, EventTone, Language } from "./types";

export interface NoteEventTag {
  id: string;
  label: string;
  tone: EventTone;
}

const noteEventTokenPattern = /\[([^\[\]]+)\]/g;

export function createNoteEventToken(label: string) {
  return `[${label}]`;
}

export function hasNoteEventTag(current: string, label: string) {
  return current.includes(createNoteEventToken(label));
}

export function appendNoteEventTag(current: string, label: string) {
  return insertNoteEventTagAtSelection(current, label, {
    end: current.length,
    start: current.length,
  }).value;
}

export function insertNoteEventTagAtSelection(
  current: string,
  label: string,
  selection: { end: number; start: number },
) {
  const token = createNoteEventToken(label);

  if (current.includes(token)) {
    const index = current.indexOf(token);
    return {
      selection: {
        end: index + token.length,
        start: index + token.length,
      },
      value: current,
    };
  }

  const rangeStart = Math.max(0, Math.min(selection.start, selection.end));
  const rangeEnd = Math.max(selection.start, selection.end);
  const prefix = current.slice(0, rangeStart);
  const suffix = current.slice(rangeEnd);
  const needsLeadingSpace = Boolean(prefix) && !/\s$/.test(prefix);
  const needsTrailingSpace = Boolean(suffix) && !/^\s/.test(suffix);
  const inserted = `${needsLeadingSpace ? " " : ""}${token}${needsTrailingSpace ? " " : ""}`;
  const value = `${prefix}${inserted}${suffix}`;
  const cursor = prefix.length + inserted.length;

  return {
    selection: { end: cursor, start: cursor },
    value,
  };
}

export function removeNoteEventTagAtRange(
  current: string,
  selection: { end: number; start: number },
) {
  let prefix = current.slice(0, selection.start);
  let suffix = current.slice(selection.end);

  if (prefix.endsWith(" ") && suffix.startsWith(" ")) {
    suffix = suffix.slice(1);
  } else if (prefix.endsWith(" ") && !suffix) {
    prefix = prefix.slice(0, -1);
  } else if (!prefix && suffix.startsWith(" ")) {
    suffix = suffix.slice(1);
  }

  const value = `${prefix}${suffix}`;
  const cursor = prefix.length;

  return {
    selection: { end: cursor, start: cursor },
    value,
  };
}

export function getNoteEventTagRanges(current: string, events: NoteEventTag[]) {
  return tokenizeNoteBody(current, events)
    .filter((token): token is Extract<ReturnType<typeof tokenizeNoteBody>[number], { type: "tag" }> => token.type === "tag")
    .map((token) => ({
      end: token.end,
      event: token.event,
      start: token.start,
    }));
}

export function getEncounterNoteEvents(
  encounter: Encounter | null,
  events: EventSummary[],
  language: Language,
) {
  if (!encounter) {
    return [] as NoteEventTag[];
  }

  const ids = Array.from(new Set([encounter.eventId, ...encounter.sharedEventIds]));

  return ids
    .map((id) => events.find((event) => event.id === id))
    .filter((event): event is EventSummary => Boolean(event))
    .map((event) => ({
      id: event.id,
      label: resolveLocalizedText(event.name, language),
      tone: event.tone,
    }));
}

function normalizeEventLabel(value: string) {
  return value.trim().toLowerCase();
}

function splitTextRun(value: string) {
  return value.match(/\S+\s*|\s+/g) ?? [];
}

export function tokenizeNoteBody(body: string, events: NoteEventTag[]) {
  const labelMap = new Map(
    events.map((event) => [normalizeEventLabel(event.label), event] as const),
  );
  const tokens: Array<
    | { end: number; start: number; type: "text"; value: string }
    | { end: number; event: NoteEventTag; start: number; type: "tag"; value: string }
  > = [];

  let lastIndex = 0;

  body.replace(noteEventTokenPattern, (match, label, offset) => {
    if (offset > lastIndex) {
      splitTextRun(body.slice(lastIndex, offset)).forEach((value) => {
        const start = lastIndex;
        const end = start + value.length;
        tokens.push({ end, start, type: "text", value });
        lastIndex = end;
      });
    }

    const matchedEvent = labelMap.get(normalizeEventLabel(label));
    const start = offset;
    const end = offset + match.length;

    if (matchedEvent) {
      tokens.push({ end, event: matchedEvent, start, type: "tag", value: match });
    } else {
      tokens.push({ end, start, type: "text", value: match });
    }

    lastIndex = end;
    return match;
  });

  if (lastIndex < body.length) {
    splitTextRun(body.slice(lastIndex)).forEach((value) => {
      const start = lastIndex;
      const end = start + value.length;
      tokens.push({ end, start, type: "text", value });
      lastIndex = end;
    });
  }

  if (!tokens.length && body) {
    let start = 0;
    splitTextRun(body).forEach((value) => {
      const end = start + value.length;
      tokens.push({ end, start, type: "text", value });
      start = end;
    });
  }

  return tokens;
}
