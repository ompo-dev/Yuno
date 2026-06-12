import { StyleSheet, Text, View } from "react-native";

import { AppCopy } from "../../../i18n";
import { Encounter, MemoryNote } from "../../../types";
import { theme } from "../../../theme";

interface NoteComposerHeaderProps {
  copy: AppCopy;
  encounter: Encounter | null;
  note: MemoryNote | null;
}

export function NoteComposerHeader({
  copy,
  encounter,
  note,
}: NoteComposerHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{note ? copy.notes.editNote : copy.notes.addNote}</Text>
      {encounter ? <Text style={styles.subtitle}>{encounter.name}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.muted,
  },
});
