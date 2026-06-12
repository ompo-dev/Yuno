import { AppCopy } from "../../../i18n";
import { Language } from "../../../types";
import {
  ArtworkFrame,
  OnboardingArtworkProvider,
  OnboardingAuthArtwork,
  OnboardingEventsArtwork,
  OnboardingNotesArtwork,
  OnboardingPeopleArtwork,
} from "./artwork";

type ArtworkVariant = "auth" | "people" | "events" | "notes";

interface OnboardingArtworkProps {
  copy: AppCopy;
  language: Language;
  variant: ArtworkVariant;
}

export function OnboardingArtwork({
  copy,
  language,
  variant,
}: OnboardingArtworkProps) {
  return (
    <OnboardingArtworkProvider copy={copy} language={language} variant={variant}>
      <ArtworkFrame>
        {variant === "auth" ? <OnboardingAuthArtwork /> : null}
        {variant === "people" ? <OnboardingPeopleArtwork /> : null}
        {variant === "events" ? <OnboardingEventsArtwork /> : null}
        {variant === "notes" ? <OnboardingNotesArtwork /> : null}
      </ArtworkFrame>
    </OnboardingArtworkProvider>
  );
}
