import { EventSummary } from "../types";

function setEventFlag<T extends "joined" | "saved">(
  events: EventSummary[],
  eventId: string,
  key: T,
  value: boolean,
) {
  let changed = false;

  const nextEvents = events.map((event) => {
    if (event.id !== eventId || event[key] === value) {
      return event;
    }

    changed = true;
    return { ...event, [key]: value };
  });

  return changed ? nextEvents : events;
}

export function setEventJoined(
  events: EventSummary[],
  eventId: string,
  joined: boolean,
) {
  return setEventFlag(events, eventId, "joined", joined);
}

export function toggleEventJoined(events: EventSummary[], eventId: string) {
  const targetEvent = events.find((event) => event.id === eventId);

  if (!targetEvent) {
    return events;
  }

  return setEventJoined(events, eventId, !targetEvent.joined);
}

export function setEventSaved(
  events: EventSummary[],
  eventId: string,
  saved: boolean,
) {
  return setEventFlag(events, eventId, "saved", saved);
}

export function toggleEventSaved(events: EventSummary[], eventId: string) {
  const targetEvent = events.find((event) => event.id === eventId);

  if (!targetEvent) {
    return events;
  }

  return setEventSaved(events, eventId, !targetEvent.saved);
}
