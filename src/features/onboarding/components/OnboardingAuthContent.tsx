import { StyleSheet, Text, View } from "react-native";

import { AppCopy } from "../../../i18n";
import { theme } from "../../../theme";

interface OnboardingAuthContentProps {
  copy: AppCopy;
}

export function OnboardingAuthContent({ copy }: OnboardingAuthContentProps) {
  return (
    <View style={styles.copyBlock}>
      <Text style={styles.eyebrow}>{copy.onboarding.auth.eyebrow}</Text>
      <Text style={styles.title}>{copy.onboarding.auth.title}</Text>
      <Text style={styles.body}>{copy.onboarding.auth.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  copyBlock: {
    gap: 10,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 31,
    lineHeight: 37,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    color: theme.colors.muted,
  },
});
