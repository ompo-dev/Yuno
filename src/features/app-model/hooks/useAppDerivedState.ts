import { useMemo } from "react";

import { Language } from "../../../types";
import {
  buildEntityMap,
  getActiveNote,
  getConnectedEncounters,
  getJoinedOrRecentEvents,
  getNoteEncounter,
  getNoteSuggestedEvents,
  getSelectedEncounter,
  getSelectedEncounterNotes,
  getSelectedEvent,
  getSelectedEvents,
  getSelectedPeople,
} from "../model";
import { AppDerived, AppState } from "../types";

export function useAppDerivedState(state: AppState, language: Language): AppDerived {
  const encounterById = useMemo(() => buildEntityMap(state.encounters), [state.encounters]);
  const eventById = useMemo(() => buildEntityMap(state.events), [state.events]);
  const noteById = useMemo(() => buildEntityMap(state.notes), [state.notes]);
  const connectedEncounters = useMemo(
    () => getConnectedEncounters(state.encounters),
    [state.encounters],
  );
  const joinedOrRecentEvents = useMemo(
    () => getJoinedOrRecentEvents(state.events),
    [state.events],
  );
  const selectedEncounter = useMemo(
    () => getSelectedEncounter(state.activeSheet, encounterById),
    [encounterById, state.activeSheet],
  );
  const selectedEvent = useMemo(
    () => getSelectedEvent(state.activeSheet, eventById),
    [eventById, state.activeSheet],
  );
  const selectedPeople = useMemo(
    () => getSelectedPeople(state.activeSheet, encounterById),
    [encounterById, state.activeSheet],
  );
  const selectedEvents = useMemo(
    () => getSelectedEvents(state.activeSheet, eventById),
    [eventById, state.activeSheet],
  );
  const noteEncounter = useMemo(
    () => getNoteEncounter(state.noteComposer, encounterById),
    [encounterById, state.noteComposer],
  );
  const activeNote = useMemo(
    () => getActiveNote(state.noteComposer, noteById),
    [noteById, state.noteComposer],
  );
  const noteSuggestedEvents = useMemo(
    () =>
      getNoteSuggestedEvents(selectedEncounter, noteEncounter, state.events, language),
    [language, noteEncounter, selectedEncounter, state.events],
  );
  const selectedEncounterNotes = useMemo(
    () => getSelectedEncounterNotes(state.notes, selectedEncounter),
    [selectedEncounter, state.notes],
  );

  return {
    activeNote,
    connectedCount: connectedEncounters.length,
    connectedEncounters,
    joinedOrRecentEvents,
    noteEncounter,
    noteSuggestedEvents,
    selectedEncounter,
    selectedEncounterNotes,
    selectedEvent,
    selectedEvents,
    selectedPeople,
  };
}
