import { useAppActions } from "../features/app-model/hooks/useAppActions";
import { useAppDerivedState } from "../features/app-model/hooks/useAppDerivedState";
import { useAppStateStore } from "../features/app-model/hooks/useAppStateStore";
import { AppModel } from "../features/app-model/types";
import { Language } from "../types";

export function useAppModel(language: Language) {
  const { closeSheet, openSheet, setters, state } = useAppStateStore();
  const derived = useAppDerivedState(state, language);
  const actions = useAppActions({
    closeSheet,
    derived,
    openSheet,
    setters,
  });

  return {
    actions,
    derived,
    state,
  } satisfies AppModel;
}

export type { AppActions, AppDerived, AppState } from "../features/app-model/types";
export type { AppModel } from "../features/app-model/types";
