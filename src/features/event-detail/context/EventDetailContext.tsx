import { createContext, ReactNode, useContext } from "react";

import { EventDetailContextValue, EventDetailProviderProps } from "./types";
import { useEventDetailState } from "./useEventDetailState";

const EventDetailContext = createContext<EventDetailContextValue | null>(null);

export function EventDetailProvider({
  children,
  ...props
}: EventDetailProviderProps & { children: ReactNode }) {
  const value = useEventDetailState(props);

  return <EventDetailContext.Provider value={value}>{children}</EventDetailContext.Provider>;
}

export function useEventDetailContext() {
  const context = useContext(EventDetailContext);

  if (!context) {
    throw new Error("useEventDetailContext must be used inside EventDetailProvider");
  }

  return context;
}
