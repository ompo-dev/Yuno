import { AppCopy } from "../../../i18n";
import { Encounter, EventSummary, Language } from "../../../types";

export interface EventDetailProviderProps {
  bottomInset: number;
  copy: AppCopy;
  encounters: Encounter[];
  event: EventSummary | null;
  language: Language;
  onClose: () => void;
  onOpenEncounter: (encounter: Encounter) => void;
  onToggleJoin: (eventId: string) => void;
  onToggleSaved: (eventId: string) => void;
  visible: boolean;
}

export interface EventDetailContextValue {
  actions: {
    closeSheet: () => void;
    openEncounter: (encounter: Encounter) => void;
    toggleJoinEvent: () => void;
    toggleSaveEvent: () => void;
  };
  derived: {
    activeEvent: EventSummary | null;
    connectedAttendees: Encounter[];
    guests: Encounter[];
    statusTone: "blue" | "green" | "purple";
    timeRange: { date: string; time: string };
  };
  props: EventDetailProviderProps;
}
