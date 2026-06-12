import { useCallback, useMemo, useState } from "react";

import { useDeferredSearch } from "../../../hooks/useDeferredSearch";
import { AppCopy } from "../../../i18n";
import { Encounter, EventSummary, Language } from "../../../types";
import { useMultiSelectFilters } from "../../filterable-sheet/hooks";
import {
  buildEventsFilterSections,
  filterEvents,
  getRadarEvents,
} from "../model";

const eventsScreenFilterKeys = ["status", "signals"] as const;

interface UseEventsScreenStateParams {
  copy: AppCopy;
  encounters: Encounter[];
  events: EventSummary[];
  language: Language;
}

export function useEventsScreenState({
  copy,
  encounters,
  events,
  language,
}: UseEventsScreenStateParams) {
  const { normalizedQuery, query, setQuery } = useDeferredSearch();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const {
    activeFilterCount,
    clearFilters,
    selected,
    toggleFilter,
  } = useMultiSelectFilters(eventsScreenFilterKeys);

  const filterSections = useMemo(
    () => buildEventsFilterSections(copy),
    [copy],
  );
  const filteredEvents = useMemo(
    () =>
      filterEvents({
        encounters,
        events,
        language,
        normalizedQuery,
        selectedSignals: selected.signals,
        selectedStatuses: selected.status,
      }),
    [encounters, events, language, normalizedQuery, selected.signals, selected.status],
  );
  const radarEvents = useMemo(
    () => getRadarEvents(filteredEvents),
    [filteredEvents],
  );
  const openFilters = useCallback(() => {
    setFiltersVisible(true);
  }, []);
  const closeFilters = useCallback(() => {
    setFiltersVisible(false);
  }, []);

  return {
    activeFilterCount,
    clearFilters,
    closeFilters,
    filterSections,
    filteredEvents,
    filtersVisible,
    openFilters,
    query,
    radarEvents,
    selected,
    setQuery,
    toggleFilter,
  };
}
