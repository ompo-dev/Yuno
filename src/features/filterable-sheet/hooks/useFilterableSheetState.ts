import { useEffect, useState } from "react";

interface UseFilterableSheetStateOptions<T> {
  items: T[];
  onResetState: () => void;
  resetQuery: () => void;
  title: string;
  visible: boolean;
}

export function useFilterableSheetState<T>({
  items,
  onResetState,
  resetQuery,
  title,
  visible,
}: UseFilterableSheetStateOptions<T>) {
  const [cachedItems, setCachedItems] = useState(items);
  const [cachedTitle, setCachedTitle] = useState(title);
  const [filtersVisible, setFiltersVisible] = useState(false);

  useEffect(() => {
    if (items.length) {
      setCachedItems(items);
    }
  }, [items]);

  useEffect(() => {
    if (title) {
      setCachedTitle(title);
    }
  }, [title]);

  useEffect(() => {
    if (!visible) {
      resetQuery();
      setFiltersVisible(false);
      onResetState();
    }
  }, [onResetState, resetQuery, visible]);

  return {
    activeItems: items.length ? items : cachedItems,
    activeTitle: title || cachedTitle,
    closeFilters: () => setFiltersVisible(false),
    filtersVisible,
    openFilters: () => setFiltersVisible(true),
  };
}
