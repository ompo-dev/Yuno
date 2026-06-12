import { StyleSheet } from "react-native";

import { GlassCard } from "../../../components/atoms";
import { ActivityHeatmap } from "../../../components/organisms";
import { AppCopy } from "../../../i18n";
import { Encounter, Language } from "../../../types";

interface ProfileActivitySectionProps {
  copy: AppCopy;
  encounters: Encounter[];
  language: Language;
  onOpenEncounter: (encounter: Encounter) => void;
}

export function ProfileActivitySection({
  copy,
  encounters,
  language,
  onOpenEncounter,
}: ProfileActivitySectionProps) {
  return (
    <GlassCard style={styles.card}>
      <ActivityHeatmap
        copy={copy}
        encounters={encounters}
        language={language}
        onOpenEncounter={onOpenEncounter}
      />
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 14,
  },
});
