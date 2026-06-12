import { EventListSheetContent } from "../../features/event-list/components";
import { useEventListModalState } from "../../features/event-list/hooks";

import { FilterableSheetScaffold } from "../../features/filterable-sheet/components";
import { AppCopy } from "../../i18n";
import { Encounter, EventSummary, Language } from "../../types";
import { FilterDialog } from "./FilterDialog";

interface EventListModalProps {
  bottomInset: number;
  copy: AppCopy;
  encounters: Encounter[];
  events: EventSummary[];
  language: Language;
  onClose: () => void;
  onOpenEvent: (event: EventSummary) => void;
  onToggleSaved: (eventId: string) => void;
  title: string;
  visible: boolean;
}

export function EventListModal({
  bottomInset,
  copy,
  encounters,
  events,
  language,
  onClose,
  onOpenEvent,
  onToggleSaved,
  title,
  visible,
}: EventListModalProps) {
  const {
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
  } = useEventListModalState({
    copy,
    encounters,
    events,
    language,
    title,
    visible,
  });

  return (
    <FilterableSheetScaffold
      activeFilterCount={activeFilterCount}
      bottomInset={bottomInset}
      count={filteredEvents.length}
      onChangeQuery={setQuery}
      onClose={onClose}
      onOpenFilters={openFilters}
      overlayContent={
        <FilterDialog
          clearLabel={copy.common.clear}
          closeLabel={copy.common.close}
          hasActiveFilters={activeFilterCount > 0}
          onClear={clearFilters}
          onClose={closeFilters}
          onToggle={toggleFilter}
          sections={filterSections}
          selected={selected}
          title={copy.common.filters}
          visible={filtersVisible}
        />
      }
      placeholder={`${copy.common.search}...`}
      query={query}
      title={activeTitle}
      visible={visible}
    >
      <EventListSheetContent
        activeFilterCount={activeFilterCount}
        copy={copy}
        encounters={encounters}
        events={filteredEvents}
        language={language}
        onClearFilters={clearFilters}
        onOpenEvent={onOpenEvent}
        onToggleSaved={onToggleSaved}
      />
    </FilterableSheetScaffold>
  );
}
