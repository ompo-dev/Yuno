import { Encounter, EventRole, FollowUpState, InteractionIcon, LocalizedText, SocialLink } from "../../../types";
import { getEventById } from "../events";

export type EncounterSeed = {
  access?: Encounter["access"];
  avatarUrl: string;
  company: string;
  connected: boolean;
  connectionCount: number;
  context: LocalizedText;
  description: LocalizedText;
  distance: LocalizedText;
  encounteredAtValue?: number;
  eventId: string;
  eventRole?: EventRole;
  followUp: FollowUpState;
  gradient: [string, string];
  homeVisible?: boolean;
  id: string;
  initials: string;
  interactionIcon?: InteractionIcon;
  interactionLabel?: LocalizedText;
  mutualConnectionIds: string[];
  name: string;
  note: LocalizedText;
  radar?: Encounter["radar"];
  role: LocalizedText;
  sharedEventIds: string[];
  socials: SocialLink[];
  tags: LocalizedText[];
  timeAgo: LocalizedText;
  verified?: boolean;
};

export function encounter(seed: EncounterSeed): Encounter {
  const event = getEventById(seed.eventId);

  return {
    access: seed.access ?? "full",
    avatarUrl: seed.avatarUrl,
    company: seed.company,
    connected: seed.connected,
    connectionCount: seed.connectionCount,
    context: seed.context,
    description: seed.description,
    distance: seed.distance,
    encounteredAtValue: seed.encounteredAtValue,
    event: event.name,
    eventId: seed.eventId,
    eventRole: seed.eventRole ?? "attendee",
    eventTone: event.tone,
    followUp: seed.followUp,
    gradient: seed.gradient,
    homeVisible: seed.homeVisible ?? true,
    id: seed.id,
    initials: seed.initials,
    interactionIcon: seed.interactionIcon,
    interactionLabel: seed.interactionLabel,
    mutualConnectionIds: seed.mutualConnectionIds,
    name: seed.name,
    note: seed.note,
    radar: seed.radar,
    role: seed.role,
    sharedEventIds: seed.sharedEventIds,
    socials: seed.socials,
    tags: seed.tags,
    timeAgo: seed.timeAgo,
    verified: seed.verified ?? true,
  };
}
