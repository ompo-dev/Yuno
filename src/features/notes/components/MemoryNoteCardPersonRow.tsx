import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { InfoChip, InitialsAvatar } from "../../../components/atoms";
import { AppCopy, resolveLocalizedText } from "../../../i18n";
import { Encounter, Language } from "../../../types";
import { theme } from "../../../theme";

interface MemoryNoteCardPersonRowProps {
  copy: AppCopy;
  encounter: Encounter;
  language: Language;
}

export function MemoryNoteCardPersonRow({
  copy,
  encounter,
  language,
}: MemoryNoteCardPersonRowProps) {
  return (
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
          {resolveLocalizedText(encounter.role, language)} {copy.common.at} {encounter.company}
        </Text>
      </View>

      <InfoChip
        label={copy.notes.openProfile}
        rightSlot={<Ionicons color={theme.colors.muted} name="arrow-forward" size={14} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
