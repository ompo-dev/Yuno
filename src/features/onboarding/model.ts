import { Language } from "../../types";

export type OnboardingStage = "auth" | "intro";

export const onboardingFeatureVariants = ["people", "events", "notes"] as const;

export function getOnboardingStepLabel(
  language: Language,
  step: number,
  total: number,
) {
  return language === "pt-BR"
    ? `Etapa ${step + 1} de ${total}`
    : `Step ${step + 1} of ${total}`;
}
