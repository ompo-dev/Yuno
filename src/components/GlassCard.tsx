import { memo, ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { theme } from "../theme";

interface GlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const GlassCard = memo(function GlassCard({
  children,
  style,
}: GlassCardProps) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    ...theme.shadow.card,
  },
});
