import { useCallback, useMemo, useState } from "react";

import { toggleFilterValue } from "../../../filterUtils";

type FilterSelections<T extends string> = Record<T, string[]>;

function createFilterSelections<T extends string>(keys: readonly T[]): FilterSelections<T> {
  return keys.reduce((accumulator, key) => {
    accumulator[key] = [];
    return accumulator;
  }, {} as FilterSelections<T>);
}

function isFilterSelectionKey<T extends string>(keys: readonly T[], value: string): value is T {
  return (keys as readonly string[]).includes(value);
}

export function useMultiSelectFilters<T extends string>(keys: readonly T[]) {
  const [selected, setSelected] = useState<FilterSelections<T>>(() => createFilterSelections(keys));

  const clearFilters = useCallback(() => {
    setSelected(createFilterSelections(keys));
  }, [keys]);

  const toggleFilter = useCallback((sectionKey: string, optionId: string) => {
    if (!isFilterSelectionKey(keys, sectionKey)) {
      return;
    }

    setSelected((current) => ({
      ...current,
      [sectionKey]: toggleFilterValue(current[sectionKey], optionId),
    }));
  }, [keys]);

  const activeFilterCount = useMemo(
    () => keys.reduce((total, key) => total + selected[key].length, 0),
    [keys, selected],
  );

  return {
    activeFilterCount,
    clearFilters,
    selected,
    setSelected,
    toggleFilter,
  };
}
