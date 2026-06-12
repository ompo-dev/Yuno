import { StyleSheet, Text, View } from "react-native";

import { theme } from "../../theme";

interface StatTileProps {
  align?: "center" | "left";
  label: string;
  value: number | string;
}

export function StatTile({
  align = "left",
  label,
  value,
}: StatTileProps) {
  return (
    <View style={[styles.tile, align === "center" && styles.tileCenter]}>
      <Text style={[styles.value, align === "center" && styles.valueCenter]}>
        {value}
      </Text>
      <Text style={[styles.label, align === "center" && styles.labelCenter]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    gap: 4,
    minHeight: 88,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceSoft,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  tileCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  valueCenter: {
    textAlign: "center",
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    color: theme.colors.muted,
  },
  labelCenter: {
    textAlign: "center",
  },
});
