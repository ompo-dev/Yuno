import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  getConnectedEventAttendees,
  getEventGuests,
} from "../../encounterUtils";
import {
  EventCardActionsRow,
  EventCardMetaStack,
  EventCardStatusRow,
} from "../../features/events/components";
import { parseEventCardTimeRange } from "../../features/events/event-card-model";
import { AppCopy, resolveLocalizedText } from "../../i18n";
import { Encounter, EventSummary, Language } from "../../types";
import { theme } from "../../theme";
import { GlassCard } from "../atoms/GlassCard";
import { InfoChip } from "../atoms/InfoChip";

interface EventCardProps {
  copy: AppCopy;
  event: EventSummary;
  encounters: Encounter[];
  language: Language;
  onOpenEvent: (event: EventSummary) => void;
  onToggleSaved: (eventId: string) => void;
}

export const EventCard = memo(function EventCard({
  copy,
  event,
  encounters,
  language,
  onOpenEvent,
  onToggleSaved,
}: EventCardProps) {
  const connectedAttendees = getConnectedEventAttendees(encounters, event.id);
  const guests = getEventGuests(encounters, event.id);
  const timeRange = parseEventCardTimeRange(resolveLocalizedText(event.timeRange, language));

  return (
    <GlassCard style={styles.card}>
      <EventCardStatusRow copy={copy} event={event} />

      <Text style={styles.title}>{resolveLocalizedText(event.name, language)}</Text>

      <View style={styles.contentRow}>
        <Text style={styles.summary}>{resolveLocalizedText(event.summary, language)}</Text>

        <EventCardMetaStack
          event={event}
          language={language}
          participantSlot={
            <InfoChip icon="people-outline" label={`${event.participants}`} tone="neutral" />
          }
          timeRange={timeRange}
        />
      </View>

      <EventCardActionsRow
        connectedAttendees={connectedAttendees}
        copy={copy}
        event={event}
        guests={guests}
        onOpenEvent={onOpenEvent}
        onToggleSaved={onToggleSaved}
      />
    </GlassCard>
  );
});

const styles = StyleSheet.create({
  card: {
    gap: 18,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  summary: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.muted,
  },
});
