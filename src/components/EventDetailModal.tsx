import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  getConnectedEventAttendees,
  getEventGuests,
} from "../encounterUtils";
import { AppCopy, resolveLocalizedText } from "../i18n";
import { Encounter, EventSummary, Language } from "../types";
import { theme } from "../theme";
import { AvatarInfoChip } from "./AvatarInfoChip";
import { BottomSheetModal } from "./BottomSheetModal";
import { InfoChip } from "./InfoChip";
import { MotionPressable } from "./MotionPressable";
import { ProfileListRow } from "./ProfileListRow";

interface EventDetailModalProps {
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

export function EventDetailModal({
  bottomInset,
  copy,
  encounters,
  event,
  language,
  onClose,
  onOpenEncounter,
  onToggleJoin,
  onToggleSaved,
  visible,
}: EventDetailModalProps) {
  const [cachedEvent, setCachedEvent] = useState(event);
  const activeEvent = event ?? cachedEvent;

  useEffect(() => {
    if (event) {
      setCachedEvent(event);
    }
  }, [event]);

  if (!activeEvent) {
    return null;
  }

  const guests = getEventGuests(encounters, activeEvent.id);
  const connectedAttendees = getConnectedEventAttendees(encounters, activeEvent.id);
  const statusTone = getStatusTone(activeEvent.status);
  const timeRange = parseTimeRange(resolveLocalizedText(activeEvent.timeRange, language));

  const footer = (
    <View style={styles.footerRow}>
      <MotionPressable
        contentStyle={[
          styles.primaryButton,
          activeEvent.joined && styles.primaryButtonJoined,
        ]}
        fill
        onPress={() => onToggleJoin(activeEvent.id)}
        pressScale={0.985}
        style={styles.primaryButtonWrap}
      >
        <Text style={styles.primaryButtonLabel}>
          {activeEvent.joined ? copy.events.leaveEvent : copy.events.joinEvent}
        </Text>
        <Ionicons
          color="#FFFFFF"
          name={activeEvent.joined ? "checkmark-circle" : "arrow-forward"}
          size={18}
        />
      </MotionPressable>

      <MotionPressable
        contentStyle={[styles.iconButton, activeEvent.saved && styles.iconButtonActive]}
        onPress={() => onToggleSaved(activeEvent.id)}
        pressScale={0.97}
      >
        <Ionicons
          color={activeEvent.saved ? theme.colors.ink : theme.colors.muted}
          name={activeEvent.saved ? "bookmark" : "bookmark-outline"}
          size={18}
        />
      </MotionPressable>
    </View>
  );

  return (
    <BottomSheetModal
      bodyStyle={styles.body}
      bottomInset={bottomInset}
      footer={footer}
      onClose={onClose}
      visible={visible}
    >
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <InfoChip
            icon="pulse-outline"
            label={copy.events.status[activeEvent.status]}
            tone={statusTone}
          />
        </View>

        <Text style={styles.title}>{resolveLocalizedText(activeEvent.name, language)}</Text>
        <View style={styles.heroContentRow}>
          <Text style={styles.summary}>
            {resolveLocalizedText(activeEvent.summary, language)}
          </Text>

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
              <Text style={styles.metaText}>
                {resolveLocalizedText(activeEvent.venue, language)}
              </Text>
            </View>
            <InfoChip
              icon="people-outline"
              label={`${activeEvent.participants}`}
              tone="neutral"
            />
          </View>
        </View>
      </View>

      {guests.length ? (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{copy.events.invitedGuestsTitle}</Text>
            <AvatarInfoChip
              avatarSize={14.3}
              encounters={guests}
              label={guests.length > 1 ? `${guests.length}` : ""}
              labelColor={theme.colors.rose}
              style={styles.guestChip}
            />
          </View>
          <View style={styles.peopleList}>
            {guests.map((encounter) => (
              <ProfileListRow
                encounter={encounter}
                key={encounter.id}
                language={language}
                onPress={onOpenEncounter}
                trailing={
                  <View style={styles.trailingWrap}>
                    <InfoChip
                      icon="lock-closed-outline"
                      label={copy.events.privateGuest}
                      tone="neutral"
                    />
                  </View>
                }
              />
            ))}
          </View>
        </View>
      ) : null}

      {connectedAttendees.length ? (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{copy.events.yourConnections}</Text>
            <AvatarInfoChip
              avatarSize={14.3}
              encounters={connectedAttendees}
              label={`${connectedAttendees.length}`}
            />
          </View>
          <View style={styles.peopleList}>
            {connectedAttendees.map((encounter) => (
              <ProfileListRow
                encounter={encounter}
                key={encounter.id}
                language={language}
                onPress={onOpenEncounter}
              />
            ))}
          </View>
        </View>
      ) : null}
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 20,
  },
  hero: {
    gap: 14,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.line,
  },
  heroTop: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  title: {
    fontSize: 26,
    lineHeight: 31,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  heroContentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  summary: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.muted,
  },
  metaStack: {
    width: 148,
    gap: 8,
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
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  peopleList: {
    gap: 10,
  },
  guestChip: {
    borderColor: "#E1D7FF",
    backgroundColor: "#F3EEFF",
  },
  trailingWrap: {
    alignItems: "flex-end",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  primaryButtonWrap: {
    flex: 1,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.ink,
    paddingVertical: 18,
    borderRadius: theme.radius.pill,
    ...theme.shadow.floating,
  },
  primaryButtonJoined: {
    backgroundColor: theme.colors.green,
  },
  primaryButtonLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  iconButton: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceSoft,
  },
  iconButtonActive: {
    backgroundColor: "#EEF2F6",
  },
});
