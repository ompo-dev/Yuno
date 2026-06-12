import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  MemoryNoteCardHeader,
  MemoryNoteCardPersonRow,
} from "../../features/notes/components";
import { AppCopy, resolveLocalizedText } from "../../i18n";
import { NoteEventTag } from "../../noteTags";
import { Encounter, Language, MemoryNote } from "../../types";
import { theme } from "../../theme";
import { GlassCard } from "../atoms/GlassCard";
import { MotionPressable } from "../atoms/MotionPressable";
import { RichNoteText } from "../molecules/RichNoteText";

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
  return (
    <MotionPressable
      contentStyle={styles.wrapper}
      onPress={() => onPress(encounter)}
      pressScale={0.988}
    >
      <GlassCard style={styles.card}>
        <MemoryNoteCardHeader encounter={encounter} language={language} note={note} />

        <RichNoteText
          body={resolveLocalizedText(note.body, language)}
          events={noteEvents}
          textStyle={styles.body}
        />

        <View style={styles.divider} />

        <MemoryNoteCardPersonRow copy={copy} encounter={encounter} language={language} />
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
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.ink,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.line,
  },
});
