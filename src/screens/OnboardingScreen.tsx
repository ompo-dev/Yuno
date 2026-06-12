import { ScrollView, StyleSheet, View } from "react-native";

import { ScreenTransition } from "../components/atoms";
import { useAppShellContext } from "../features/app-shell/AppShellContext";
import {
  OnboardingAuthContent,
  OnboardingArtwork,
  OnboardingFooter,
  OnboardingIntroContent,
  OnboardingProgressDots,
  OnboardingTopBar,
} from "../features/onboarding/components";
import { useOnboardingFlow } from "../features/onboarding/hooks/useOnboardingFlow";
import { onboardingFeatureVariants } from "../features/onboarding/model";
export function OnboardingScreen() {
  const {
    actions,
    bottomInset,
    copy,
    language,
    languageOptions,
    setLanguage,
  } = useAppShellContext();
  const {
    handlePrimaryAction,
    isIntroStage,
    isLastStep,
    stage,
    step,
    stepLabel,
  } = useOnboardingFlow({
    copy,
    language,
    onContinue: actions.completeOnboarding,
  });

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
        <OnboardingTopBar
          copy={copy}
          isIntroStage={isIntroStage}
          language={language}
          languageOptions={languageOptions}
          onLanguageChange={setLanguage}
          stepLabel={stepLabel}
        />

        {isIntroStage ? (
          <OnboardingProgressDots
            activeStep={step}
            count={copy.onboarding.steps.length}
          />
        ) : null}

        <ScreenTransition transitionKey={`${stage}-${step}`}>
          <View style={styles.stageContent}>
            <OnboardingArtwork
              copy={copy}
              language={language}
              variant={isIntroStage ? onboardingFeatureVariants[step] : "auth"}
            />

            {!isIntroStage ? (
              <OnboardingAuthContent copy={copy} />
            ) : (
              <OnboardingIntroContent copy={copy} step={step} />
            )}
          </View>
        </ScreenTransition>
      </ScrollView>

      <OnboardingFooter
        bottomInset={bottomInset}
        copy={copy}
        isIntroStage={isIntroStage}
        isLastStep={isLastStep}
        onPrimaryAction={handlePrimaryAction}
      />
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
  stageContent: {
    gap: 18,
  },
});
