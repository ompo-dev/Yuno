import { useCallback, useMemo, useState } from "react";

import { useDeferredSearch } from "../../../hooks/useDeferredSearch";
import { AppCopy } from "../../../i18n";
import { Encounter, Language } from "../../../types";
import { useFilterableSheetState, useMultiSelectFilters } from "../../filterable-sheet/hooks";
import {
  buildPeopleListFilterSections,
  filterPeopleList,
} from "../people-list-model";

const peopleListFilterKeys = ["tags", "events", "periods"] as const;

interface UsePeopleListModalStateParams {
  copy: AppCopy;
  encounters: Encounter[];
  language: Language;
  title: string;
  visible: boolean;
}

export function usePeopleListModalState({
  copy,
  encounters,
  language,
  title,
  visible,
}: UsePeopleListModalStateParams) {
  const { normalizedQuery, query, resetQuery, setQuery } = useDeferredSearch();
  const {
    activeFilterCount,
    clearFilters,
    selected,
    toggleFilter,
  } = useMultiSelectFilters(peopleListFilterKeys);
  const {
    activeItems,
    activeTitle,
    closeFilters,
    filtersVisible,
    openFilters,
  } = useFilterableSheetState({
    items: encounters,
    onResetState: clearFilters,
    resetQuery,
    title,
    visible,
  });

  const filterSections = useMemo(
    () => buildPeopleListFilterSections(copy, activeItems, language),
    [activeItems, copy, language],
  );
  const filteredEncounters = useMemo(
    () =>
      filterPeopleList({
        encounters: activeItems,
        language,
        normalizedQuery,
        selectedEvents: selected.events,
        selectedPeriods: selected.periods,
        selectedTags: selected.tags,
      }),
    [activeItems, language, normalizedQuery, selected.events, selected.periods, selected.tags],
  );

  return {
    activeFilterCount,
    activeTitle,
    clearFilters,
    closeFilters,
    filterSections,
    filteredEncounters,
    filtersVisible,
    openFilters,
    query,
    selected,
    setQuery,
    toggleFilter,
  };
}
