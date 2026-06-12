import { useCallback, useMemo, useState } from "react";

import { useDeferredSearch } from "../../../hooks/useDeferredSearch";
import { AppCopy } from "../../../i18n";
import { Encounter, EventSummary, Language } from "../../../types";
import { useFilterableSheetState, useMultiSelectFilters } from "../../filterable-sheet/hooks";
import {
  buildEventListFilterSections,
  filterEventList,
} from "../event-list-model";

const eventListFilterKeys = ["status", "time", "signals"] as const;

interface UseEventListModalStateParams {
  copy: AppCopy;
  encounters: Encounter[];
  events: EventSummary[];
  language: Language;
  title: string;
  visible: boolean;
}

export function useEventListModalState({
  copy,
  encounters,
  events,
  language,
  title,
  visible,
}: UseEventListModalStateParams) {
  const { normalizedQuery, query, resetQuery, setQuery } = useDeferredSearch();
  const {
    activeFilterCount,
    clearFilters,
    selected,
    toggleFilter,
  } = useMultiSelectFilters(eventListFilterKeys);
  const {
    activeItems,
    activeTitle,
    closeFilters,
    filtersVisible,
    openFilters,
  } = useFilterableSheetState({
    items: events,
    onResetState: clearFilters,
    resetQuery,
    title,
    visible,
  });

  const filterSections = useMemo(() => buildEventListFilterSections(copy), [copy]);
  const filteredEvents = useMemo(
    () =>
      filterEventList({
        encounters,
        events: activeItems,
        language,
        normalizedQuery,
        selectedSignals: selected.signals,
        selectedStatuses: selected.status,
        selectedTimes: selected.time,
      }),
    [activeItems, encounters, language, normalizedQuery, selected.signals, selected.status, selected.time],
  );

  return {
    activeFilterCount,
    activeTitle,
    clearFilters,
    closeFilters,
    filterSections,
    filteredEvents,
    filtersVisible,
    openFilters,
    query,
    selected,
    setQuery,
    toggleFilter,
  };
}
