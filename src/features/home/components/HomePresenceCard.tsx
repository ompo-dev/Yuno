import { StyleSheet, Switch, Text, View } from "react-native";

import { GlassCard } from "../../../components/atoms";
import { AppCopy } from "../../../i18n";
import { theme } from "../../../theme";

interface HomePresenceCardProps {
  copy: AppCopy;
  discoverable: boolean;
  onDiscoverableChange: (value: boolean) => void;
}

export function HomePresenceCard({
  copy,
  discoverable,
  onDiscoverableChange,
}: HomePresenceCardProps) {
  return (
    <GlassCard style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>{copy.home.presenceTitle}</Text>

        <Switch
          onValueChange={onDiscoverableChange}
          thumbColor="#FFFFFF"
          trackColor={{
            false: "#D0D7DE",
            true: "#2DA44E",
          }}
          value={discoverable}
        />
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink,
  },
});
