import { LayoutRectangle, View } from "react-native";

import { AppCopy } from "../../../i18n";
import { NoteEventTag } from "../../../noteTags";
import { Encounter, Language, MemoryNote } from "../../../types";

export interface EncounterDetailProviderProps {
  allEncounters: Encounter[];
  bottomInset: number;
  composerNote: MemoryNote | null;
  copy: AppCopy;
  encounter: Encounter | null;
  isNoteComposerVisible: boolean;
  language: Language;
  onClose: () => void;
  onCloseNoteComposer: () => void;
  onDeleteNote: (noteId: string) => void;
  onEditNote: (note: MemoryNote) => void;
  onOpenEvent: (eventId: string) => void;
  onOpenMutualConnections: (title: string, ids: string[]) => void;
  onOpenSharedEvents: (title: string, ids: string[]) => void;
  onRequestCreateNote: (encounterId: string) => void;
  onSaveNote: (body: string) => void;
  onToggleConnect: (encounterId: string) => void;
  savedNotes: MemoryNote[];
  suggestedEvents: NoteEventTag[];
  visible: boolean;
}

export type ActiveEncounterMenu =
  | { type: "header"; anchor: LayoutRectangle }
  | { type: "note"; anchor: LayoutRectangle; note: MemoryNote }
  | null;

export interface EncounterDetailContextValue {
  actions: {
    closeSheet: () => void;
    deleteNote: (noteId: string) => void;
    dismissMenus: () => void;
    editNote: (note: MemoryNote) => void;
    openEncounterEvent: () => void;
    openMutualConnectionsSheet: () => void;
    openSharedEventsSheet: () => void;
    requestCreateNote: () => void;
    setHeaderMenuAnchor: (node: View | null) => void;
    setNoteMenuAnchor: (noteId: string, node: View | null) => void;
    toggleConnect: () => void;
    toggleHeaderMenu: () => void;
    toggleNoteMenu: (note: MemoryNote) => void;
  };
  derived: {
    activeEncounter: Encounter | null;
    activeMenu: ActiveEncounterMenu;
    canInteract: boolean;
    eventTone: "blue" | "green" | "purple";
    mutualConnections: Encounter[];
  };
  props: EncounterDetailProviderProps;
}
