import { MemoryNote } from "../types";

function trimNoteBody(body: string) {
  return body.trim();
}

function buildNowLabel() {
  return {
    en: "Saved now",
    "pt-BR": "Salvo agora",
  } as const;
}

function buildEditedNowLabel() {
  return {
    en: "Edited now",
    "pt-BR": "Editado agora",
  } as const;
}

export function createMemoryNote(
  notes: MemoryNote[],
  encounterId: string,
  body: string,
  now = Date.now(),
) {
  const trimmedBody = trimNoteBody(body);

  if (!trimmedBody) {
    return notes;
  }

  const nextNote: MemoryNote = {
    id: `note-${now}`,
    encounterId,
    body: {
      en: trimmedBody,
      "pt-BR": trimmedBody,
    },
    createdAt: buildNowLabel(),
    createdAtValue: now,
  };

  return [nextNote, ...notes];
}

export function updateMemoryNoteBody(
  notes: MemoryNote[],
  noteId: string,
  body: string,
  now = Date.now(),
) {
  const trimmedBody = trimNoteBody(body);

  if (!trimmedBody) {
    return notes;
  }

  let changed = false;

  const nextNotes = notes.map((note) => {
    if (note.id !== noteId) {
      return note;
    }

    const currentBody = typeof note.body === "string" ? note.body : note.body.en;

    if (currentBody.trim() === trimmedBody) {
      return note;
    }

    changed = true;

    return {
      ...note,
      body: {
        en: trimmedBody,
        "pt-BR": trimmedBody,
      },
      updatedAt: buildEditedNowLabel(),
      updatedAtValue: now,
    };
  });

  return changed ? nextNotes : notes;
}

export function deleteMemoryNote(notes: MemoryNote[], noteId: string) {
  const nextNotes = notes.filter((note) => note.id !== noteId);
  return nextNotes.length === notes.length ? notes : nextNotes;
}
