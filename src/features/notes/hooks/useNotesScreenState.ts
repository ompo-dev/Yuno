import { useCallback, useMemo, useState } from "react";

import { useDeferredSearch } from "../../../hooks/useDeferredSearch";
import { AppCopy } from "../../../i18n";
import { Encounter, EventSummary, Language, MemoryNote } from "../../../types";
import { useMultiSelectFilters } from "../../filterable-sheet/hooks";
import {
  buildNoteFeedItems,
  buildNotesFilterSections,
  filterNoteItems,
} from "../model";

const notesScreenFilterKeys = ["people", "tags", "events"] as const;

interface UseNotesScreenStateParams {
  copy: AppCopy;
  encounters: Encounter[];
  events: EventSummary[];
  language: Language;
  notes: MemoryNote[];
}

export function useNotesScreenState({
  copy,
  encounters,
  events,
  language,
  notes,
}: UseNotesScreenStateParams) {
  const { normalizedQuery, query, setQuery } = useDeferredSearch();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const {
    activeFilterCount,
    clearFilters,
    selected,
    toggleFilter,
  } = useMultiSelectFilters(notesScreenFilterKeys);

  const noteItems = useMemo(
    () => buildNoteFeedItems(notes, encounters, events, language),
    [encounters, events, language, notes],
  );
  const filterSections = useMemo(
    () => buildNotesFilterSections(copy, noteItems, language),
    [copy, language, noteItems],
  );
  const filteredNotes = useMemo(
    () =>
      filterNoteItems({
        items: noteItems,
        language,
        normalizedQuery,
        selectedEvents: selected.events,
        selectedPeople: selected.people,
        selectedTags: selected.tags,
      }),
    [language, normalizedQuery, noteItems, selected.events, selected.people, selected.tags],
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
    filteredNotes,
    filtersVisible,
    openFilters,
    query,
    selected,
    setQuery,
    toggleFilter,
  };
}
