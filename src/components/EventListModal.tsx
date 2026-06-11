import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { getConnectedEventAttendees, getEventGuests } from "../encounterUtils";
import { toggleFilterValue } from "../filterUtils";
import { useDeferredSearch } from "../hooks/useDeferredSearch";
import { AppCopy, resolveLocalizedText } from "../i18n";
import { Encounter, EventSummary, Language } from "../types";
import { theme } from "../theme";
import { BottomSheetModal } from "./BottomSheetModal";
import { EmptyStatePanel } from "./EmptyStatePanel";
import { EventCard } from "./EventCard";
import { FilterDialog, FilterSection } from "./FilterDialog";
import { SheetSearchBar } from "./SheetSearchBar";

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

function getTimeBucket(event: EventSummary, language: Language) {
  const timeRange = resolveLocalizedText(event.timeRange, language);
  const match = timeRange.match(/(\d{1,2}):(\d{2})/);
  const hour = match ? Number(match[1]) : 0;

  if (hour < 12) {
    return "morning";
  }

  if (hour < 18) {
    return "afternoon";
  }

  return "evening";
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
  const [cachedEvents, setCachedEvents] = useState(events);
  const [cachedTitle, setCachedTitle] = useState(title);
  const { normalizedQuery, query, resetQuery, setQuery } = useDeferredSearch();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedSignals, setSelectedSignals] = useState<string[]>([]);
  const activeEvents = events.length ? events : cachedEvents;
  const activeTitle = title || cachedTitle;

  useEffect(() => {
    if (events.length) {
      setCachedEvents(events);
    }
  }, [events]);

  useEffect(() => {
    if (title) {
      setCachedTitle(title);
    }
  }, [title]);

  useEffect(() => {
    if (!visible) {
      resetQuery();
      setFiltersVisible(false);
      setSelectedStatuses([]);
      setSelectedTimes([]);
      setSelectedSignals([]);
    }
  }, [resetQuery, visible]);

  const filterSections: FilterSection[] = useMemo(
    () => [
      {
        key: "status",
        options: [
          { id: "live", label: copy.events.status.live },
          { id: "upcoming", label: copy.events.status.upcoming },
          { id: "recent", label: copy.events.status.recent },
        ],
        title: copy.common.status,
      },
      {
        key: "time",
        options: [
          { id: "morning", label: copy.common.morning },
          { id: "afternoon", label: copy.common.afternoon },
          { id: "evening", label: copy.common.evening },
        ],
        title: copy.common.time,
      },
      {
        key: "signals",
        options: [
          { id: "withConnections", label: copy.common.withConnections },
          { id: "withGuests", label: copy.common.withGuests },
        ],
        title: copy.common.filters,
      },
    ],
    [
      copy.common.afternoon,
      copy.common.evening,
      copy.common.filters,
      copy.common.morning,
      copy.common.status,
      copy.common.time,
      copy.common.withConnections,
      copy.common.withGuests,
      copy.events.status.live,
      copy.events.status.recent,
      copy.events.status.upcoming,
    ],
  );

  const filteredEvents = useMemo(() => {
    return activeEvents.filter((event) => {
      const guestCount = getEventGuests(encounters, event.id).length;
      const connectedCount = getConnectedEventAttendees(encounters, event.id).length;
      const matchesQuery =
        !normalizedQuery ||
        resolveLocalizedText(event.name, language).toLowerCase().includes(normalizedQuery) ||
        resolveLocalizedText(event.venue, language)
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesStatus =
        !selectedStatuses.length || selectedStatuses.includes(event.status);

      const matchesTime =
        !selectedTimes.length ||
        selectedTimes.includes(getTimeBucket(event, language));

      const matchesSignals =
        !selectedSignals.length ||
        selectedSignals.every((signal) => {
          if (signal === "withGuests") {
            return guestCount > 0;
          }

          if (signal === "withConnections") {
            return connectedCount > 0;
          }

          return true;
        });

      return matchesQuery && matchesStatus && matchesTime && matchesSignals;
    });
  }, [activeEvents, encounters, language, normalizedQuery, selectedSignals, selectedStatuses, selectedTimes]);

  const activeFilterCount =
    selectedStatuses.length + selectedTimes.length + selectedSignals.length;

  return (
    <BottomSheetModal
      bodyStyle={styles.body}
      bottomInset={bottomInset}
      onClose={onClose}
      overlayContent={
        <FilterDialog
          clearLabel={copy.common.clear}
          closeLabel={copy.common.close}
          hasActiveFilters={activeFilterCount > 0}
          onClear={() => {
            setSelectedStatuses([]);
            setSelectedTimes([]);
            setSelectedSignals([]);
          }}
          onClose={() => setFiltersVisible(false)}
          onToggle={(sectionKey, optionId) => {
            if (sectionKey === "status") {
              setSelectedStatuses((current) => toggleFilterValue(current, optionId));
              return;
            }

            if (sectionKey === "time") {
              setSelectedTimes((current) => toggleFilterValue(current, optionId));
              return;
            }

            setSelectedSignals((current) => toggleFilterValue(current, optionId));
          }}
          sections={filterSections}
          selected={{
            signals: selectedSignals,
            status: selectedStatuses,
            time: selectedTimes,
          }}
          title={copy.common.filters}
          visible={filtersVisible}
        />
      }
      visible={visible}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{activeTitle}</Text>
        <Text style={styles.meta}>{filteredEvents.length}</Text>
      </View>

      <SheetSearchBar
        activeFilterCount={activeFilterCount}
        onChangeText={setQuery}
        onOpenFilters={() => setFiltersVisible(true)}
        placeholder={`${copy.common.search}...`}
        value={query}
      />

      <View style={styles.list}>
        {filteredEvents.length ? (
          filteredEvents.map((event) => (
            <EventCard
              copy={copy}
              encounters={encounters}
              event={event}
              key={event.id}
              language={language}
              onOpenEvent={onOpenEvent}
              onToggleSaved={onToggleSaved}
            />
          ))
        ) : (
          <EmptyStatePanel
            actionLabel={activeFilterCount ? copy.common.clear : undefined}
            icon={activeFilterCount ? "options-outline" : "calendar-outline"}
            onAction={
              activeFilterCount
                ? () => {
                    setSelectedStatuses([]);
                    setSelectedTimes([]);
                    setSelectedSignals([]);
                  }
                : undefined
            }
            title={
              activeFilterCount
                ? language === "pt-BR"
                  ? "Nenhum evento encontrado com estes filtros."
                  : "No events match these filters."
                : language === "pt-BR"
                  ? "Nenhum evento para mostrar agora."
                  : "No events to show right now."
            }
          />
        )}
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  meta: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.muted,
  },
  list: {
    gap: 14,
  },
});
