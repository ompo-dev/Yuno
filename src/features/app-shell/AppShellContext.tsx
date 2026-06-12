import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppModel } from "../../hooks/useAppModel";
import { getCopy, getInitialLanguage } from "../../i18n";
import { Encounter, Language, LanguageOption } from "../../types";
import { AppActions, AppDerived, AppState } from "../app-model/types";

const appLanguageOptions: LanguageOption[] = [
  { label: "EN", value: "en" },
  { label: "PT-BR", value: "pt-BR" },
];

interface AppShellContextValue {
  actions: AppActions;
  bottomInset: number;
  copy: ReturnType<typeof getCopy>;
  derived: AppDerived;
  language: Language;
  languageOptions: LanguageOption[];
  openEncounterSheet: (encounter: Encounter) => void;
  openEventSheet: (eventId: string) => void;
  setLanguage: (language: Language) => void;
  state: AppState;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function AppShellProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [language, setLanguage] = useState(getInitialLanguage());
  const copy = useMemo(() => getCopy(language), [language]);
  const { actions, derived, state } = useAppModel(language);

  const openEncounterSheet = useCallback((encounter: Encounter) => {
    actions.openSheet({ type: "encounter", id: encounter.id });
  }, [actions]);

  const openEventSheet = useCallback((eventId: string) => {
    actions.openSheet({ type: "event", id: eventId });
  }, [actions]);

  const value = useMemo<AppShellContextValue>(() => ({
    actions,
    bottomInset: insets.bottom,
    copy,
    derived,
    language,
    languageOptions: appLanguageOptions,
    openEncounterSheet,
    openEventSheet,
    setLanguage,
    state,
  }), [
    actions,
    copy,
    derived,
    insets.bottom,
    language,
    openEncounterSheet,
    openEventSheet,
    state,
  ]);

  return <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>;
}

export function useAppShellContext() {
  const context = useContext(AppShellContext);

  if (!context) {
    throw new Error("useAppShellContext must be used inside AppShellProvider");
  }

  return context;
}
