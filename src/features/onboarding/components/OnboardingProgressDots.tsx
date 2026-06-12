import { StyleSheet, View } from "react-native";

import { theme } from "../../../theme";

interface OnboardingProgressDotsProps {
  activeStep: number;
  count: number;
}

export function OnboardingProgressDots({
  activeStep,
  count,
}: OnboardingProgressDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={[styles.dot, index === activeStep && styles.dotActive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: theme.colors.line,
  },
  dotActive: {
    backgroundColor: theme.colors.ink,
  },
});
