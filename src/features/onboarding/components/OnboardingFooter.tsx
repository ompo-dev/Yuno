import { StyleSheet, Text, View } from "react-native";

import { ActionPillButton } from "../../../components/molecules";
import { AppCopy } from "../../../i18n";
import { theme } from "../../../theme";
import { OnboardingProviderButton } from "./OnboardingProviderButton";

interface OnboardingFooterProps {
  bottomInset: number;
  copy: AppCopy;
  isIntroStage: boolean;
  isLastStep: boolean;
  onPrimaryAction: () => void;
}

export function OnboardingFooter({
  bottomInset,
  copy,
  isIntroStage,
  isLastStep,
  onPrimaryAction,
}: OnboardingFooterProps) {
  return (
    <View
      style={[
        styles.footer,
        { paddingBottom: Math.max(18, Math.round(bottomInset * 0.55)) },
      ]}
    >
      {!isIntroStage ? (
        <View style={styles.footerStack}>
          <OnboardingProviderButton
            icon="logo-apple"
            label={copy.onboarding.auth.appleLabel}
            onPress={onPrimaryAction}
            tone="dark"
          />
          <OnboardingProviderButton
            icon="logo-google"
            label={copy.onboarding.auth.googleLabel}
            onPress={onPrimaryAction}
            tone="light"
          />
          <Text style={styles.footerHint}>{copy.onboarding.auth.hint}</Text>
        </View>
      ) : (
        <ActionPillButton
          icon="arrow-forward"
          label={isLastStep ? copy.onboarding.enterLabel : copy.onboarding.continueLabel}
          onPress={onPrimaryAction}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 22,
    paddingTop: 14,
    backgroundColor: "rgba(246,248,250,0.94)",
    borderTopWidth: 1,
    borderTopColor: theme.colors.line,
  },
  footerStack: {
    gap: 10,
  },
  footerHint: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
    color: theme.colors.muted,
  },
});
