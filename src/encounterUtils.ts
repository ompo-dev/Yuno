import { Encounter } from "./types";

export function getHomeEncounters(encounters: Encounter[]) {
  return encounters.filter((encounter) => encounter.homeVisible !== false);
}

export function getEventAttendees(encounters: Encounter[], eventId: string) {
  return encounters.filter(
    (encounter) =>
      encounter.eventId === eventId && (encounter.eventRole ?? "attendee") !== "guest",
  );
}

export function getEventGuests(encounters: Encounter[], eventId: string) {
  return encounters.filter(
    (encounter) => encounter.eventId === eventId && encounter.eventRole === "guest",
  );
}

export function getConnectedEventAttendees(encounters: Encounter[], eventId: string) {
  return getEventAttendees(encounters, eventId).filter(
    (encounter) => encounter.connected,
  );
}

export function getMutualConnections(
  encounters: Encounter[],
  encounter: Encounter | null,
) {
  if (!encounter) {
    return [];
  }

  const mutualIds = new Set(encounter.mutualConnectionIds);
  return encounters.filter((item) => mutualIds.has(item.id));
}

export function canAccessEncounter(encounter: Encounter | null) {
  return encounter?.access === "full";
}
