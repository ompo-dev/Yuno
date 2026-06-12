import { PeopleListSheetContent } from "../../features/people-list/components";
import { usePeopleListModalState } from "../../features/people-list/hooks";

import { FilterableSheetScaffold } from "../../features/filterable-sheet/components";
import { AppCopy } from "../../i18n";
import { Encounter, Language } from "../../types";
import { FilterDialog } from "./FilterDialog";

interface PeopleListModalProps {
  bottomInset: number;
  copy: AppCopy;
  encounters: Encounter[];
  language: Language;
  onClose: () => void;
  onOpenEncounter: (encounter: Encounter) => void;
  title: string;
  visible: boolean;
}

export function PeopleListModal({
  bottomInset,
  copy,
  encounters,
  language,
  onClose,
  onOpenEncounter,
  title,
  visible,
}: PeopleListModalProps) {
  const {
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
  } = usePeopleListModalState({
    copy,
    encounters,
    language,
    title,
    visible,
  });

  return (
    <FilterableSheetScaffold
      activeFilterCount={activeFilterCount}
      bottomInset={bottomInset}
      count={filteredEncounters.length}
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
      <PeopleListSheetContent
        activeFilterCount={activeFilterCount}
        copy={copy}
        encounters={filteredEncounters}
        language={language}
        onClearFilters={clearFilters}
        onOpenEncounter={onOpenEncounter}
      />
    </FilterableSheetScaffold>
  );
}
