import { StyleSheet, View } from "react-native";

import { InfoChip } from "../../../components/atoms";
import { AppCopy } from "../../../i18n";

interface ProfileHeroStatsProps {
  connectedCount: number;
  connectionEventCount: number;
  copy: AppCopy;
  onOpenConnections: () => void;
  onOpenEvents: () => void;
}

export function ProfileHeroStats({
  connectedCount,
  connectionEventCount,
  copy,
  onOpenConnections,
  onOpenEvents,
}: ProfileHeroStatsProps) {
  return (
    <View style={styles.heroTags}>
      <InfoChip
        icon="git-network-outline"
        label={copy.detail.totalConnections(connectedCount)}
        onPress={onOpenConnections}
      />
      <InfoChip
        icon="calendar-outline"
        label={`${connectionEventCount} ${copy.profile.joinedEvents}`}
        onPress={onOpenEvents}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heroTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
