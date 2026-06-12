import { useCallback, useEffect, useState } from "react";

import { ActiveSheet } from "../model";

export function useSheetCoordinator() {
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [pendingSheet, setPendingSheet] = useState<ActiveSheet>(null);

  const openSheet = useCallback((nextSheet: ActiveSheet) => {
    if (!nextSheet) {
      setActiveSheet(null);
      return;
    }

    setActiveSheet((currentSheet) => {
      if (currentSheet) {
        setPendingSheet(nextSheet);
        return null;
      }

      return nextSheet;
    });
  }, []);

  const closeSheet = useCallback(() => {
    setActiveSheet(null);
  }, []);

  useEffect(() => {
    if (!activeSheet && pendingSheet) {
      const timeout = setTimeout(() => {
        setActiveSheet(pendingSheet);
        setPendingSheet(null);
      }, 240);

      return () => clearTimeout(timeout);
    }
  }, [activeSheet, pendingSheet]);

  return {
    activeSheet,
    closeSheet,
    openSheet,
  };
}
