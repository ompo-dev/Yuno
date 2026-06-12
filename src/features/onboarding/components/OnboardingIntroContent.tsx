import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { InfoChip } from "../../../components/atoms";
import { AppCopy } from "../../../i18n";
import { theme } from "../../../theme";

interface OnboardingIntroContentProps {
  copy: AppCopy;
  step: number;
}

export function OnboardingIntroContent({
  copy,
  step,
}: OnboardingIntroContentProps) {
  const currentStep = copy.onboarding.steps[step];

  return (
    <View style={styles.copyBlock}>
      <View style={styles.iconWrap}>
        <Ionicons color={theme.colors.ink} name={currentStep.icon} size={20} />
      </View>

      <Text style={styles.eyebrow}>{currentStep.eyebrow}</Text>
      <Text style={styles.title}>{currentStep.title}</Text>
      <Text style={styles.body}>{currentStep.body}</Text>

      <View style={styles.points}>
        {currentStep.points.map((point) => (
          <InfoChip
            icon="checkmark-outline"
            key={point}
            label={point}
            tone="neutral"
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  copyBlock: {
    gap: 10,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.colors.line,
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
  points: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: 4,
  },
});
