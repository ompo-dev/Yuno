import {
  startTransition,
  useCallback,
  useDeferredValue,
  useMemo,
  useState,
} from "react";

import { normalizeSearchQuery } from "../filterUtils";

export function useDeferredSearch(initialValue = "") {
  const [query, setQueryState] = useState(initialValue);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = useMemo(
    () => normalizeSearchQuery(deferredQuery),
    [deferredQuery],
  );

  const setQuery = useCallback((value: string) => {
    startTransition(() => {
      setQueryState(value);
    });
  }, []);

  const resetQuery = useCallback(() => {
    startTransition(() => {
      setQueryState("");
    });
  }, []);

  return {
    normalizedQuery,
    query,
    resetQuery,
    setQuery,
  };
}
