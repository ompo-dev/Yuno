import { memo } from "react";
import { StyleSheet, View } from "react-native";

import {
  EncounterCardHeader,
  EncounterCardTagsRow,
} from "../../features/encounter-card/components";
import { Encounter, Language } from "../../types";
import { theme } from "../../theme";

interface EncounterCardProps {
  encounter: Encounter;
  language: Language;
  onPress: (encounter: Encounter) => void;
}

export const EncounterCard = memo(function EncounterCard({
  encounter,
  language,
  onPress,
}: EncounterCardProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <EncounterCardHeader encounter={encounter} language={language} onPress={onPress} />
        <EncounterCardTagsRow encounter={encounter} language={language} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: theme.radius.lg,
  },
  card: {
    gap: 14,
    borderRadius: theme.radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
    ...theme.shadow.card,
  },
});
