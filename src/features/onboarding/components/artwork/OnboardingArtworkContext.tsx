import { createContext, ReactNode, useContext, useMemo } from "react";

import { initialEncounters, recentEvents } from "../../../../data/mockData";
import { AppCopy, resolveLocalizedText } from "../../../../i18n";
import { createNoteEventToken, getEncounterNoteEvents } from "../../../../noteTags";
import { Language, LocalizedText, MemoryNote } from "../../../../types";

type ArtworkVariant = "auth" | "people" | "events" | "notes";

interface OnboardingArtworkContextValue {
  allEncounters: typeof initialEncounters;
  copy: AppCopy;
  featuredEncounter: (typeof initialEncounters)[number];
  featuredEvent: (typeof recentEvents)[number];
  language: Language;
  noteEncounter: (typeof initialEncounters)[number];
  noteEvents: ReturnType<typeof getEncounterNoteEvents>;
  previewNote: MemoryNote;
  primaryNoteLabel: string;
  secondEncounter: (typeof initialEncounters)[number];
  thirdEncounter: (typeof initialEncounters)[number];
  variant: ArtworkVariant;
}

const OnboardingArtworkContext = createContext<OnboardingArtworkContextValue | null>(
  null,
);

const localized = (en: string, ptBR: string): LocalizedText => ({
  en,
  "pt-BR": ptBR,
});

interface OnboardingArtworkProviderProps {
  children: ReactNode;
  copy: AppCopy;
  language: Language;
  variant: ArtworkVariant;
}

export function OnboardingArtworkProvider({
  children,
  copy,
  language,
  variant,
}: OnboardingArtworkProviderProps) {
  const value = useMemo<OnboardingArtworkContextValue>(() => {
    const featuredEncounter = initialEncounters[0];
    const secondEncounter = initialEncounters[1];
    const thirdEncounter = initialEncounters[2];
    const featuredEvent = recentEvents[0];
    const noteEncounter = initialEncounters[2];
    const noteEvents = getEncounterNoteEvents(noteEncounter, recentEvents, language);
    const primaryNoteLabel = resolveLocalizedText(featuredEvent.name, language);
    const previewNote: MemoryNote = {
      id: "onboarding-note-preview",
      encounterId: noteEncounter.id,
      body: {
        en: `${createNoteEventToken(resolveLocalizedText(featuredEvent.name, "en"))} Follow up with the quiet-attendee prompt she mentioned after the panel.`,
        "pt-BR": `${createNoteEventToken(resolveLocalizedText(featuredEvent.name, "pt-BR"))} lembrar do prompt para participantes mais discretos que ela comentou depois do painel.`,
      },
      createdAt: localized("Saved now", "Salvo agora"),
      createdAtValue: Date.now(),
    };

    return {
      allEncounters: initialEncounters,
      copy,
      featuredEncounter,
      featuredEvent,
      language,
      noteEncounter,
      noteEvents,
      previewNote,
      primaryNoteLabel,
      secondEncounter,
      thirdEncounter,
      variant,
    };
  }, [copy, language, variant]);

  return (
    <OnboardingArtworkContext.Provider value={value}>
      {children}
    </OnboardingArtworkContext.Provider>
  );
}

export function useOnboardingArtworkContext() {
  const value = useContext(OnboardingArtworkContext);

  if (!value) {
    throw new Error("useOnboardingArtworkContext must be used within OnboardingArtworkProvider");
  }

  return value;
}
