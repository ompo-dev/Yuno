import { StyleSheet, View } from "react-native";

import { FilterableScreenLayout } from "../components/organisms";
import { useAppShellContext } from "../features/app-shell/AppShellContext";
import { EventsFeed, EventsRadarSection } from "../features/events/components";
import { useEventsScreenState } from "../features/events/hooks/useEventsScreenState";
export function EventsScreen() {
  const {
    actions,
    copy,
    language,
    openEventSheet,
    state: {
      encounters,
      events,
    },
  } = useAppShellContext();
  const {
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
  } = useEventsScreenState({
    copy,
    encounters,
    events,
    language,
  });

  return (
    <View style={styles.screen}>
      <FilterableScreenLayout
        activeFilterCount={activeFilterCount}
        clearLabel={copy.common.clear}
        closeLabel={copy.common.close}
        description={copy.events.description}
        eyebrow={copy.events.eyebrow}
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
        title={copy.events.title}
        filterTitle={copy.common.filters}
        filtersVisible={filtersVisible}
      >
        <EventsRadarSection
          activeFilterCount={activeFilterCount}
          copy={copy}
          language={language}
          onClearFilters={clearFilters}
          onOpenEvent={(event) => openEventSheet(event.id)}
          radarEvents={radarEvents}
        />

        <EventsFeed
          activeFilterCount={activeFilterCount}
          copy={copy}
          encounters={encounters}
          events={filteredEvents}
          language={language}
          onClearFilters={clearFilters}
          onOpenEvent={(event) => openEventSheet(event.id)}
          onToggleSaved={actions.toggleSaveEvent}
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
