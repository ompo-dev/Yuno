import { StyleSheet, Text, View } from "react-native";

import { InfoChip } from "../../../components/atoms/InfoChip";
import { resolveLocalizedText } from "../../../i18n";
import { Encounter, Language, MemoryNote } from "../../../types";
import { theme } from "../../../theme";
import { getEncounterEventTone } from "../../encounter-card/model";

interface MemoryNoteCardHeaderProps {
  encounter: Encounter;
  language: Language;
  note: MemoryNote;
}

export function MemoryNoteCardHeader({
  encounter,
  language,
  note,
}: MemoryNoteCardHeaderProps) {
  return (
    <View style={styles.topRow}>
      <InfoChip
        icon="people-outline"
        label={resolveLocalizedText(encounter.event, language)}
        tone={getEncounterEventTone(encounter)}
      />
      <View style={styles.metaCol}>
        <Text style={styles.date}>{resolveLocalizedText(note.createdAt, language)}</Text>
        {note.updatedAt ? (
          <Text style={styles.date}>{resolveLocalizedText(note.updatedAt, language)}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
