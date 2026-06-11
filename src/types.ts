export type Language = "en" | "pt-BR";

export type LocalizedText = string | Record<Language, string>;

export type TabId = "home" | "events" | "notes" | "profile";

export type VisibilityPreset = "1h" | "8h" | "24h" | "off";

export type FollowUpState = "warm" | "starred" | "pending";
export type EventTone = "blue" | "green" | "purple";
export type EventStatus = "live" | "upcoming" | "recent";
export type EncounterAccess = "full" | "restricted";
export type EventRole = "attendee" | "guest";
export type SocialProvider =
  | "linkedin"
  | "instagram"
  | "whatsapp"
  | "x"
  | "email"
  | "telegram";
export type InteractionIcon =
  | "cafe-outline"
  | "git-network-outline"
  | "people-outline"
  | "chatbubble-ellipses-outline";

export interface SocialLink {
  provider: SocialProvider;
  value: string;
}

export interface Encounter {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
  encounteredAtValue?: number;
  verified?: boolean;
  role: LocalizedText;
  company: string;
  eventId: string;
  event: LocalizedText;
  eventTone?: EventTone;
  context: LocalizedText;
  description: LocalizedText;
  interactionLabel?: LocalizedText;
  interactionIcon?: InteractionIcon;
  note: LocalizedText;
  distance: LocalizedText;
  timeAgo: LocalizedText;
  tags: LocalizedText[];
  connectionCount: number;
  sharedEventIds: string[];
  mutualConnectionIds: string[];
  access: EncounterAccess;
  eventRole?: EventRole;
  homeVisible?: boolean;
  socials: SocialLink[];
  followUp: FollowUpState;
  connected: boolean;
  gradient: [string, string];
  radar?: {
    color: string;
    x: number;
    y: number;
  };
}

export interface EventSummary {
  id: string;
  name: LocalizedText;
  summary: LocalizedText;
  venue: LocalizedText;
  host: LocalizedText;
  timeRange: LocalizedText;
  encounters: number;
  warmLeads: number;
  participants: number;
  joined: boolean;
  saved: boolean;
  membersOnly: boolean;
  status: EventStatus;
  tone: EventTone;
  highlight: LocalizedText;
  progress: number;
  radar: {
    x: number;
    y: number;
  };
}

export interface MemoryNote {
  id: string;
  encounterId: string;
  body: LocalizedText;
  createdAt: LocalizedText;
  createdAtValue: number;
  updatedAt?: LocalizedText;
  updatedAtValue?: number;
}

export interface UserProfile {
  avatarUrl?: string;
  firstName: LocalizedText;
  fullName: string;
  role: LocalizedText;
  company: string;
  headline: LocalizedText;
  interests: LocalizedText[];
  socials: Partial<Record<SocialProvider, string>>;
  premium: boolean;
}

export interface LanguageOption {
  label: string;
  value: Language;
}
