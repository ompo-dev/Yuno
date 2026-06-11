import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "../theme";
import { InfoChip } from "./InfoChip";

interface EmptyStatePanelProps {
  actionLabel?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onAction?: () => void;
  title: string;
}

export const EmptyStatePanel = memo(function EmptyStatePanel({
  actionLabel,
  icon,
  onAction,
  title,
}: EmptyStatePanelProps) {
  return (
    <View style={styles.panel}>
      <View style={styles.iconWrap}>
        <Ionicons color={theme.colors.muted} name={icon} size={34} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && onAction ? (
        <InfoChip label={actionLabel} onPress={onAction} />
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  panel: {
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surfaceSoft,
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surface,
  },
  title: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    color: theme.colors.muted,
  },
});
