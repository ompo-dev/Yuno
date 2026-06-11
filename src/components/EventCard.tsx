import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  getConnectedEventAttendees,
  getEventGuests,
} from "../encounterUtils";
import { AppCopy, resolveLocalizedText } from "../i18n";
import { Encounter, EventSummary, Language } from "../types";
import { theme } from "../theme";
import { AvatarInfoChip } from "./AvatarInfoChip";
import { AvatarStack } from "./AvatarStack";
import { GlassCard } from "./GlassCard";
import { InfoChip } from "./InfoChip";

interface EventCardProps {
  copy: AppCopy;
  event: EventSummary;
  encounters: Encounter[];
  language: Language;
  onOpenEvent: (event: EventSummary) => void;
  onToggleSaved: (eventId: string) => void;
}

function getStatusTone(status: EventSummary["status"]) {
  if (status === "live") {
    return "green" as const;
  }

  if (status === "upcoming") {
    return "blue" as const;
  }

  return "purple" as const;
}

function parseTimeRange(value: string) {
  const [datePart, timePart] = value.split(",");
  return {
    date: datePart?.trim() ?? value,
    time: timePart?.trim() ?? value,
  };
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
  const timeRange = parseTimeRange(resolveLocalizedText(event.timeRange, language));

  return (
    <GlassCard style={styles.card}>
      <View style={styles.topRow}>
        <InfoChip
          icon="pulse-outline"
          label={copy.events.status[event.status]}
          tone={getStatusTone(event.status)}
        />
        {event.joined ? (
          <InfoChip
            icon="checkmark-circle-outline"
            label={copy.events.joinedStatus}
            tone="green"
          />
        ) : null}
      </View>

      <Text style={styles.title}>{resolveLocalizedText(event.name, language)}</Text>

      <View style={styles.contentRow}>
        <Text style={styles.summary}>{resolveLocalizedText(event.summary, language)}</Text>

        <View style={styles.metaStack}>
          <View style={styles.metaRow}>
            <Ionicons color={theme.colors.muted} name="calendar-outline" size={15} />
            <Text style={styles.metaText}>{timeRange.date}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons color={theme.colors.muted} name="time-outline" size={15} />
            <Text style={styles.metaText}>{timeRange.time}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons color={theme.colors.muted} name="location-outline" size={15} />
            <Text numberOfLines={2} style={styles.metaText}>
              {resolveLocalizedText(event.venue, language)}
            </Text>
          </View>

          <InfoChip icon="people-outline" label={`${event.participants}`} tone="neutral" />
        </View>
      </View>

      <View style={styles.actionsRow}>
        {guests.length ? (
          <AvatarInfoChip
            avatarSize={14.3}
            encounters={guests}
            label={guests.length > 1 ? `${guests.length}` : ""}
            labelColor={theme.colors.rose}
            style={styles.guestChip}
          />
        ) : null}

        <InfoChip
          fill
          label={copy.events.viewEvent}
          leftSlot={
            connectedAttendees.length ? (
              <AvatarStack encounters={connectedAttendees} max={3} size={14.3} />
            ) : (
              <View style={styles.emptyLeadingSlot} />
            )
          }
          labelStyle={styles.viewEventLabel}
          onPress={() => onOpenEvent(event)}
          rightSlot={<Ionicons color={theme.colors.ink} name="arrow-forward" size={14} />}
          style={styles.viewEventChip}
        />

        <InfoChip
          icon={event.saved ? "bookmark" : "bookmark-outline"}
          iconColor={event.saved ? theme.colors.ink : theme.colors.muted}
          iconSize={18}
          onPress={() => onToggleSaved(event.id)}
          style={[styles.saveChip, event.saved && styles.saveChipActive]}
        />
      </View>
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
  metaStack: {
    width: 128,
    gap: 8,
    paddingTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  metaText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: theme.colors.muted,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  viewEventChip: {
    flex: 1,
    minWidth: 0,
  },
  viewEventLabel: {
    textAlign: "center",
  },
  emptyLeadingSlot: {
    width: 20,
  },
  guestChip: {
    borderColor: "#E1D7FF",
    backgroundColor: "#F3EEFF",
  },
  saveChip: {
    minWidth: 30,
  },
  saveChipActive: {
    backgroundColor: "#EEF2F6",
  },
});
