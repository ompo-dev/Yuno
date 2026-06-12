import { createContext, ReactNode, useContext } from "react";

import { EncounterDetailContextValue, EncounterDetailProviderProps } from "./types";
import { useEncounterDetailState } from "./useEncounterDetailState";

const EncounterDetailContext = createContext<EncounterDetailContextValue | null>(null);

export function EncounterDetailProvider({
  children,
  ...props
}: EncounterDetailProviderProps & { children: ReactNode }) {
  const value = useEncounterDetailState(props);

  return (
    <EncounterDetailContext.Provider value={value}>
      {children}
    </EncounterDetailContext.Provider>
  );
}

export function useEncounterDetailContext() {
  const context = useContext(EncounterDetailContext);

  if (!context) {
    throw new Error("useEncounterDetailContext must be used inside EncounterDetailProvider");
  }

  return context;
}
