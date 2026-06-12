import { NoteEventTag } from "../../noteTags";
import {
  Encounter,
  EventSummary,
  Language,
  MemoryNote,
  TabId,
  UserProfile,
} from "../../types";
import { ActiveSheet, NoteComposerState } from "./model";

export interface AppState {
  activeSheet: ActiveSheet;
  activeTab: TabId;
  encounters: Encounter[];
  events: EventSummary[];
  hasCompletedOnboarding: boolean;
  isDiscoverable: boolean;
  noteComposer: NoteComposerState;
  notes: MemoryNote[];
  profile: UserProfile;
}

export interface AppDerived {
  activeNote: MemoryNote | null;
  connectedCount: number;
  connectedEncounters: Encounter[];
  joinedOrRecentEvents: EventSummary[];
  noteEncounter: Encounter | null;
  noteSuggestedEvents: NoteEventTag[];
  selectedEncounter: Encounter | null;
  selectedEncounterNotes: MemoryNote[];
  selectedEvent: EventSummary | null;
  selectedEvents: EventSummary[];
  selectedPeople: Encounter[];
}

export interface AppActions {
  changeDiscoverable: (value: boolean) => void;
  closeEncounterSheet: () => void;
  closeNoteComposer: () => void;
  closeSheet: () => void;
  completeOnboarding: () => void;
  openSheet: (sheet: ActiveSheet) => void;
  persistComposerBody: (body: string) => void;
  removeNote: (noteId: string) => void;
  requestCreateNote: (encounterId: string) => void;
  requestEditNote: (note: MemoryNote) => void;
  saveNote: (encounterId: string, body: string) => void;
  setActiveTab: (tab: TabId) => void;
  setProfile: (profile: UserProfile) => void;
  toggleConnect: (encounterId: string) => void;
  toggleJoinEvent: (eventId: string) => void;
  toggleSaveEvent: (eventId: string) => void;
  updateNote: (noteId: string, body: string) => void;
}

export interface AppModel {
  actions: AppActions;
  derived: AppDerived;
  state: AppState;
}

export interface AppStateSetters {
  setActiveTab: (tab: TabId) => void;
  setEncounters: React.Dispatch<React.SetStateAction<Encounter[]>>;
  setEvents: React.Dispatch<React.SetStateAction<EventSummary[]>>;
  setHasCompletedOnboarding: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDiscoverable: React.Dispatch<React.SetStateAction<boolean>>;
  setNotes: React.Dispatch<React.SetStateAction<MemoryNote[]>>;
  setNoteComposer: React.Dispatch<React.SetStateAction<NoteComposerState>>;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}
