import { useCallback, useMemo, useState } from "react";

import { AppCopy } from "../../../i18n";
import { Language } from "../../../types";
import { getOnboardingStepLabel, OnboardingStage } from "../model";

interface UseOnboardingFlowParams {
  copy: AppCopy;
  language: Language;
  onContinue: () => void;
}

export function useOnboardingFlow({
  copy,
  language,
  onContinue,
}: UseOnboardingFlowParams) {
  const [stage, setStage] = useState<OnboardingStage>("auth");
  const [step, setStep] = useState(0);
  const isIntroStage = stage === "intro";
  const isLastStep = step === copy.onboarding.steps.length - 1;

  const stepLabel = useMemo(
    () => getOnboardingStepLabel(language, step, copy.onboarding.steps.length),
    [copy.onboarding.steps.length, language, step],
  );

  const handlePrimaryAction = useCallback(() => {
    if (!isIntroStage) {
      setStage("intro");
      return;
    }

    if (isLastStep) {
      onContinue();
      return;
    }

    setStep((value) => value + 1);
  }, [isIntroStage, isLastStep, onContinue]);

  return {
    handlePrimaryAction,
    isIntroStage,
    isLastStep,
    stage,
    step,
    stepLabel,
  };
}
