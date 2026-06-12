import { StyleSheet, View } from "react-native";

import { FilterableScreenLayout } from "../components/organisms";
import { useAppShellContext } from "../features/app-shell/AppShellContext";
import { NotesFeed } from "../features/notes/components/NotesFeed";
import { useNotesScreenState } from "../features/notes/hooks/useNotesScreenState";
export function NotesScreen() {
  const {
    copy,
    language,
    openEncounterSheet,
    state: {
      encounters,
      events,
      notes,
    },
  } = useAppShellContext();
  const {
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
  } = useNotesScreenState({
    copy,
    encounters,
    events,
    language,
    notes,
  });

  return (
    <View style={styles.screen}>
      <FilterableScreenLayout
        activeFilterCount={activeFilterCount}
        clearLabel={copy.common.clear}
        closeLabel={copy.common.close}
        description={copy.notes.description}
        eyebrow={copy.notes.eyebrow}
        hasActiveFilters={activeFilterCount > 0}
        onChangeQuery={setQuery}
        onClearFilters={clearFilters}
        onCloseFilters={closeFilters}
        onOpenFilters={openFilters}
        onToggleFilter={toggleFilter}
        placeholder={`${copy.common.search}...`}
        query={query}
        sections={filterSections}
        selected={selected}
        title={copy.notes.title}
        filterTitle={copy.common.filters}
        filtersVisible={filtersVisible}
      >
        <NotesFeed
          activeFilterCount={activeFilterCount}
          copy={copy}
          items={filteredNotes}
          language={language}
          onClearFilters={clearFilters}
          onOpenEncounter={openEncounterSheet}
        />
      </FilterableScreenLayout>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
