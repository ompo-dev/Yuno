import { Encounter } from "../types";

export function setEncounterConnected(
  encounters: Encounter[],
  encounterId: string,
  connected: boolean,
) {
  let changed = false;

  const nextEncounters = encounters.map((encounter) => {
    if (encounter.id !== encounterId || encounter.connected === connected) {
      return encounter;
    }

    changed = true;
    return { ...encounter, connected };
  });

  return changed ? nextEncounters : encounters;
}

export function toggleEncounterConnected(
  encounters: Encounter[],
  encounterId: string,
) {
  const targetEncounter = encounters.find((encounter) => encounter.id === encounterId);

  if (!targetEncounter) {
    return encounters;
  }

  return setEncounterConnected(encounters, encounterId, !targetEncounter.connected);
}
