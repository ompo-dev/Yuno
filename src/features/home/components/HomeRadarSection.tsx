import { StyleSheet, Text, View } from "react-native";

import { InlineRadar } from "../../../components/organisms";
import { AppCopy } from "../../../i18n";
import { theme } from "../../../theme";
import { Encounter } from "../../../types";

interface HomeRadarSectionProps {
  copy: AppCopy;
  detectedCount: number;
  discoverable: boolean;
  encounters: Encounter[];
  onDetectedCountChange: (count: number) => void;
  onOpenEncounter: (encounter: Encounter) => void;
}

export function HomeRadarSection({
  copy,
  detectedCount,
  discoverable,
  encounters,
  onDetectedCountChange,
  onOpenEncounter,
}: HomeRadarSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.label}>{copy.home.radarLive}</Text>
        <Text style={styles.meta}>
          {discoverable
            ? copy.home.radarDetectedCompact(detectedCount)
            : copy.home.invisibleNearby}
        </Text>
      </View>

      <InlineRadar
        encounters={encounters}
        ghostMode={!discoverable}
        onDetectedCountChange={onDetectedCountChange}
        onOpenEncounter={onOpenEncounter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: theme.colors.muted,
  },
  meta: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.muted,
  },
});
