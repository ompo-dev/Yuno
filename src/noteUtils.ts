import { MemoryNote } from "./types";

export function getNoteActivityValue(note: MemoryNote) {
  return note.updatedAtValue ?? note.createdAtValue;
}

export function sortNotesByNewest(notes: MemoryNote[]) {
  return [...notes].sort(
    (left, right) => getNoteActivityValue(right) - getNoteActivityValue(left),
  );
}

export function getLatestNotesByEncounter(notes: MemoryNote[]) {
  const latestByEncounter = new Map<string, MemoryNote>();

  sortNotesByNewest(notes).forEach((note) => {
    if (!latestByEncounter.has(note.encounterId)) {
      latestByEncounter.set(note.encounterId, note);
    }
  });

  return Array.from(latestByEncounter.values());
}
