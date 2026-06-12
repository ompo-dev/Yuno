import { getEncounterNoteEvents } from "../../noteTags";
import { sortNotesByNewest } from "../../noteUtils";
import { Encounter, EventSummary, Language, MemoryNote } from "../../types";

export type ActiveSheet =
  | { type: "encounter"; id: string }
  | { type: "event"; id: string }
  | { type: "people"; ids: string[]; title: string }
  | { type: "events"; ids: string[]; title: string }
  | null;

export type NoteComposerState = {
  encounterId: string;
  noteId?: string;
} | null;

export function buildEntityMap<T extends { id: string }>(items: T[]) {
  return new Map(items.map((item) => [item.id, item] as const));
}

export function getConnectedEncounters(encounters: Encounter[]) {
  return encounters.filter((encounter) => encounter.connected);
}

export function getJoinedOrRecentEvents(events: EventSummary[]) {
  return events.filter((event) => event.joined || event.status === "recent");
}

export function getSelectedEncounter(
  activeSheet: ActiveSheet,
  encounterById: Map<string, Encounter>,
) {
  return activeSheet?.type === "encounter"
    ? encounterById.get(activeSheet.id) ?? null
    : null;
}

export function getSelectedEvent(
  activeSheet: ActiveSheet,
  eventById: Map<string, EventSummary>,
) {
  return activeSheet?.type === "event"
    ? eventById.get(activeSheet.id) ?? null
    : null;
}

export function getSelectedPeople(
  activeSheet: ActiveSheet,
  encounterById: Map<string, Encounter>,
) {
  return activeSheet?.type === "people"
    ? activeSheet.ids
        .map((id) => encounterById.get(id))
        .filter((encounter): encounter is Encounter => Boolean(encounter))
    : [];
}

export function getSelectedEvents(
  activeSheet: ActiveSheet,
  eventById: Map<string, EventSummary>,
) {
  return activeSheet?.type === "events"
    ? activeSheet.ids
        .map((id) => eventById.get(id))
        .filter((event): event is EventSummary => Boolean(event))
    : [];
}

export function getNoteEncounter(
  noteComposer: NoteComposerState,
  encounterById: Map<string, Encounter>,
) {
  return noteComposer ? encounterById.get(noteComposer.encounterId) ?? null : null;
}

export function getActiveNote(
  noteComposer: NoteComposerState,
  noteById: Map<string, MemoryNote>,
) {
  return noteComposer?.noteId ? noteById.get(noteComposer.noteId) ?? null : null;
}

export function getNoteSuggestedEvents(
  encounter: Encounter | null,
  fallbackEncounter: Encounter | null,
  events: EventSummary[],
  language: Language,
) {
  return getEncounterNoteEvents(encounter ?? fallbackEncounter, events, language);
}

export function getSelectedEncounterNotes(
  notes: MemoryNote[],
  selectedEncounter: Encounter | null,
) {
  return selectedEncounter
    ? sortNotesByNewest(
        notes.filter((note) => note.encounterId === selectedEncounter.id),
      )
    : ([] as MemoryNote[]);
}
