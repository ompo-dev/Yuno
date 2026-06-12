import { useCallback } from "react";

import {
  toggleEncounterConnected,
} from "../../../commands/encounter-commands";
import { toggleEventJoined, toggleEventSaved } from "../../../commands/event-commands";
import {
  createMemoryNote,
  deleteMemoryNote,
  updateMemoryNoteBody,
} from "../../../commands/note-commands";
import { MemoryNote, UserProfile } from "../../../types";
import { ActiveSheet } from "../model";
import { AppActions, AppDerived, AppStateSetters } from "../types";

interface UseAppActionsParams {
  closeSheet: () => void;
  derived: AppDerived;
  openSheet: (sheet: ActiveSheet) => void;
  setters: AppStateSetters;
}

export function useAppActions({
  closeSheet,
  derived,
  openSheet,
  setters,
}: UseAppActionsParams): AppActions {
  const completeOnboarding = useCallback(() => {
    setters.setHasCompletedOnboarding(true);
  }, [setters]);

  const closeEncounterSheet = useCallback(() => {
    closeSheet();
    setters.setNoteComposer(null);
  }, [closeSheet, setters]);

  const closeNoteComposer = useCallback(() => {
    setters.setNoteComposer(null);
  }, [setters]);

  const requestCreateNote = useCallback((encounterId: string) => {
    setters.setNoteComposer({ encounterId });
  }, [setters]);

  const requestEditNote = useCallback((note: MemoryNote) => {
    setters.setNoteComposer({
      encounterId: note.encounterId,
      noteId: note.id,
    });
  }, [setters]);

  const changeDiscoverable = useCallback((value: boolean) => {
    setters.setIsDiscoverable(value);
  }, [setters]);

  const saveNote = useCallback((encounterId: string, body: string) => {
    setters.setNotes((current) => createMemoryNote(current, encounterId, body));
  }, [setters]);

  const updateNote = useCallback((noteId: string, body: string) => {
    setters.setNotes((current) => updateMemoryNoteBody(current, noteId, body));
  }, [setters]);

  const removeNote = useCallback((noteId: string) => {
    setters.setNotes((current) => deleteMemoryNote(current, noteId));
  }, [setters]);

  const persistComposerBody = useCallback((body: string) => {
    if (!derived.noteEncounter) {
      return;
    }

    if (derived.activeNote) {
      setters.setNotes((current) => updateMemoryNoteBody(current, derived.activeNote!.id, body));
    } else {
      setters.setNotes((current) => createMemoryNote(current, derived.noteEncounter!.id, body));
    }

    setters.setNoteComposer(null);
  }, [derived.activeNote, derived.noteEncounter, setters]);

  const toggleConnect = useCallback((encounterId: string) => {
    setters.setEncounters((current) => toggleEncounterConnected(current, encounterId));
  }, [setters]);

  const toggleJoinEvent = useCallback((eventId: string) => {
    setters.setEvents((current) => toggleEventJoined(current, eventId));
  }, [setters]);

  const toggleSaveEvent = useCallback((eventId: string) => {
    setters.setEvents((current) => toggleEventSaved(current, eventId));
  }, [setters]);

  const setProfile = useCallback((profile: UserProfile) => {
    setters.setProfile(profile);
  }, [setters]);

  return {
    changeDiscoverable,
    closeEncounterSheet,
    closeNoteComposer,
    closeSheet,
    completeOnboarding,
    openSheet,
    persistComposerBody,
    removeNote,
    requestCreateNote,
    requestEditNote,
    saveNote,
    setActiveTab: setters.setActiveTab,
    setProfile,
    toggleConnect,
    toggleJoinEvent,
    toggleSaveEvent,
    updateNote,
  };
}
