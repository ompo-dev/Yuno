import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppCopy, resolveLocalizedText } from "../i18n";
import { NoteEventTag } from "../noteTags";
import { Encounter, Language, MemoryNote } from "../types";
import { theme } from "../theme";
import { GlassCard } from "./GlassCard";
import { InfoChip } from "./InfoChip";
import { InitialsAvatar } from "./InitialsAvatar";
import { MotionPressable } from "./MotionPressable";
import { RichNoteText } from "./RichNoteText";

interface MemoryNoteCardProps {
  copy: AppCopy;
  encounter: Encounter;
  language: Language;
  note: MemoryNote;
  noteEvents: NoteEventTag[];
  onPress: (encounter: Encounter) => void;
}

export const MemoryNoteCard = memo(function MemoryNoteCard({
  copy,
  encounter,
  language,
  note,
  noteEvents,
  onPress,
}: MemoryNoteCardProps) {
  const eventTone =
    encounter.eventTone === "green"
      ? "green"
      : encounter.eventTone === "purple"
        ? "purple"
        : "blue";

  return (
    <MotionPressable
      contentStyle={styles.wrapper}
      onPress={() => onPress(encounter)}
      pressScale={0.988}
    >
      <GlassCard style={styles.card}>
        <View style={styles.topRow}>
          <InfoChip
            icon="people-outline"
            label={resolveLocalizedText(encounter.event, language)}
            tone={eventTone}
          />
          <View style={styles.metaCol}>
            <Text style={styles.date}>{resolveLocalizedText(note.createdAt, language)}</Text>
            {note.updatedAt ? (
              <Text style={styles.date}>{resolveLocalizedText(note.updatedAt, language)}</Text>
            ) : null}
          </View>
        </View>

        <RichNoteText
          body={resolveLocalizedText(note.body, language)}
          events={noteEvents}
          textStyle={styles.body}
        />

        <View style={styles.divider} />

        <View style={styles.personRow}>
          <InitialsAvatar
            gradient={encounter.gradient}
            imageUrl={encounter.avatarUrl}
            initials={encounter.initials}
            size={44}
          />

          <View style={styles.personCopy}>
            <Text style={styles.personName}>{encounter.name}</Text>
            <Text style={styles.personRole}>
              {resolveLocalizedText(encounter.role, language)} {copy.common.at}{" "}
              {encounter.company}
            </Text>
          </View>

          <InfoChip
            label={copy.notes.openProfile}
            rightSlot={<Ionicons color={theme.colors.muted} name="arrow-forward" size={14} />}
          />
        </View>
      </GlassCard>
    </MotionPressable>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: theme.radius.lg,
  },
  card: {
    gap: 14,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  metaCol: {
    alignItems: "flex-end",
    gap: 2,
  },
  date: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.ink,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.line,
  },
  personRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  personCopy: {
    flex: 1,
    gap: 2,
  },
  personName: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.ink,
  },
  personRole: {
    fontSize: 13,
    color: theme.colors.muted,
  },
});
