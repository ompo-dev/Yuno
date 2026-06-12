import { useCallback, useState } from "react";

import {
  currentUser,
  initialEncounters,
  memoryNotes,
  recentEvents,
} from "../../../data/mockData";
import { TabId } from "../../../types";
import { AppState, AppStateSetters } from "../types";
import { useSheetCoordinator } from "./useSheetCoordinator";

export function useAppStateStore() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [activeTab, setActiveTabState] = useState<TabId>("home");
  const [isDiscoverable, setIsDiscoverable] = useState(true);
  const [encounters, setEncounters] = useState(initialEncounters);
  const [events, setEvents] = useState(recentEvents);
  const [notes, setNotes] = useState(memoryNotes);
  const [profile, setProfile] = useState(currentUser);
  const [noteComposer, setNoteComposer] = useState<AppState["noteComposer"]>(null);
  const { activeSheet, closeSheet, openSheet } = useSheetCoordinator();

  const setActiveTab = useCallback((tab: TabId) => {
    setActiveTabState(tab);
  }, []);

  const state: AppState = {
    activeSheet,
    activeTab,
    encounters,
    events,
    hasCompletedOnboarding,
    isDiscoverable,
    noteComposer,
    notes,
    profile,
  };

  const setters: AppStateSetters = {
    setActiveTab,
    setEncounters,
    setEvents,
    setHasCompletedOnboarding,
    setIsDiscoverable,
    setNotes,
    setNoteComposer,
    setProfile,
  };

  return {
    closeSheet,
    openSheet,
    setters,
    state,
  };
}
