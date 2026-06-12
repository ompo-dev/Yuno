import { memo, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "../../theme";

interface ScreenHeaderProps {
  action?: ReactNode;
  description?: string;
  eyebrow?: string;
  title: string;
}

export const ScreenHeader = memo(function ScreenHeader({
  action,
  description,
  eyebrow,
  title,
}: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>

      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  copy: {
    flex: 1,
    gap: 6,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: theme.colors.muted,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.muted,
  },
  action: {
    flexShrink: 0,
  },
});
