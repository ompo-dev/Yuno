import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { InfoChip } from "../components/InfoChip";
import { MotionPressable } from "../components/MotionPressable";
import { ScreenTransition } from "../components/ScreenTransition";
import { SegmentedControl } from "../components/SegmentedControl";
import { OnboardingArtwork } from "../components/onboarding/OnboardingArtwork";
import { OnboardingProviderButton } from "../components/onboarding/OnboardingProviderButton";
import { AppCopy } from "../i18n";
import { Language, LanguageOption } from "../types";
import { theme } from "../theme";

interface OnboardingScreenProps {
  bottomInset: number;
  copy: AppCopy;
  language: Language;
  languageOptions: LanguageOption[];
  onContinue: () => void;
  onLanguageChange: (language: Language) => void;
}

type OnboardingStage = "auth" | "intro";

const featureVariants = ["people", "events", "notes"] as const;

export function OnboardingScreen({
  bottomInset,
  copy,
  language,
  languageOptions,
  onContinue,
  onLanguageChange,
}: OnboardingScreenProps) {
  const [stage, setStage] = useState<OnboardingStage>("auth");
  const [step, setStep] = useState(0);
  const currentStep = copy.onboarding.steps[step];
  const isIntroStage = stage === "intro";
  const isLastStep = step === copy.onboarding.steps.length - 1;
  const stepLabel =
    language === "pt-BR"
      ? `Etapa ${step + 1} de ${copy.onboarding.steps.length}`
      : `Step ${step + 1} of ${copy.onboarding.steps.length}`;

  const handlePrimaryAction = () => {
    if (!isIntroStage) {
      setStage("intro");
      return;
    }

    if (isLastStep) {
      onContinue();
      return;
    }

    setStep((value) => value + 1);
  };

  return (
    <View style={styles.shell}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isIntroStage ? styles.scrollContentIntro : styles.scrollContentAuth,
        ]}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View style={styles.brandBlock}>
            <Text style={styles.brand}>Yuno</Text>
            <Text style={styles.brandMeta}>
              {isIntroStage ? stepLabel : copy.onboarding.auth.eyebrow}
            </Text>
          </View>

          <View style={styles.languageWrap}>
            <SegmentedControl
              onChange={onLanguageChange}
              options={languageOptions}
              value={language}
            />
          </View>
        </View>

        {isIntroStage ? (
          <View style={styles.progressDots}>
            {copy.onboarding.steps.map((item, index) => (
              <View
                key={item.title}
                style={[styles.dot, index === step && styles.dotActive]}
              />
            ))}
          </View>
        ) : null}

        <ScreenTransition transitionKey={`${stage}-${step}`}>
          <View style={styles.stageContent}>
            <OnboardingArtwork
              copy={copy}
              language={language}
              variant={isIntroStage ? featureVariants[step] : "auth"}
            />

            {!isIntroStage ? (
              <View style={styles.copyBlock}>
                <Text style={styles.eyebrow}>{copy.onboarding.auth.eyebrow}</Text>
                <Text style={styles.title}>{copy.onboarding.auth.title}</Text>
                <Text style={styles.body}>{copy.onboarding.auth.body}</Text>
              </View>
            ) : (
              <View style={styles.copyBlock}>
                <View style={styles.iconWrap}>
                  <Ionicons
                    color={theme.colors.ink}
                    name={currentStep.icon}
                    size={20}
                  />
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
            )}
          </View>
        </ScreenTransition>
      </ScrollView>

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
              onPress={handlePrimaryAction}
              tone="dark"
            />
            <OnboardingProviderButton
              icon="logo-google"
              label={copy.onboarding.auth.googleLabel}
              onPress={handlePrimaryAction}
              tone="light"
            />
            <Text style={styles.footerHint}>{copy.onboarding.auth.hint}</Text>
          </View>
        ) : (
          <MotionPressable
            contentStyle={styles.primaryButton}
            onPress={handlePrimaryAction}
            pressScale={0.985}
          >
            <Text style={styles.primaryButtonLabel}>
              {isLastStep ? copy.onboarding.enterLabel : copy.onboarding.continueLabel}
            </Text>
            <Ionicons color="#FFFFFF" name="arrow-forward" size={18} />
          </MotionPressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 22,
    gap: 18,
  },
  scrollContentAuth: {
    paddingBottom: 208,
  },
  scrollContentIntro: {
    paddingBottom: 152,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  brandBlock: {
    flex: 1,
    gap: 4,
  },
  brand: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  brandMeta: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.muted,
  },
  languageWrap: {
    width: 132,
  },
  progressDots: {
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
  stageContent: {
    gap: 18,
  },
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
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.ink,
    paddingVertical: 18,
    borderRadius: theme.radius.pill,
    ...theme.shadow.floating,
  },
  primaryButtonLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
