import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { EmptyStatePanel } from "../components/EmptyStatePanel";
import { EventCard } from "../components/EventCard";
import { EventRadar } from "../components/EventRadar";
import { FadeInView } from "../components/FadeInView";
import { FilterDialog, FilterSection } from "../components/FilterDialog";
import { ScreenHeader } from "../components/ScreenHeader";
import { SheetSearchBar } from "../components/SheetSearchBar";
import { getConnectedEventAttendees, getEventGuests } from "../encounterUtils";
import { toggleFilterValue } from "../filterUtils";
import { useDeferredSearch } from "../hooks/useDeferredSearch";
import { AppCopy, resolveLocalizedText } from "../i18n";
import { Encounter, EventSummary, Language } from "../types";
import { theme } from "../theme";

interface EventsScreenProps {
  copy: AppCopy;
  encounters: Encounter[];
  events: EventSummary[];
  language: Language;
  onOpenEvent: (event: EventSummary) => void;
  onToggleSaved: (eventId: string) => void;
}

export function EventsScreen({
  copy,
  encounters,
  events,
  language,
  onOpenEvent,
  onToggleSaved,
}: EventsScreenProps) {
  const { normalizedQuery, query, setQuery } = useDeferredSearch();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedSignals, setSelectedSignals] = useState<string[]>([]);

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
        key: "signals",
        options: [
          { id: "joined", label: copy.events.joinedStatus },
          { id: "saved", label: copy.common.saved },
          { id: "guests", label: copy.common.withGuests },
          { id: "connections", label: copy.common.withConnections },
        ],
        title: copy.common.filters,
      },
    ],
    [copy],
  );

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const guestCount = getEventGuests(encounters, event.id).length;
      const connectionCount = getConnectedEventAttendees(encounters, event.id).length;
      const matchesQuery =
        !normalizedQuery ||
        resolveLocalizedText(event.name, language).toLowerCase().includes(normalizedQuery) ||
        resolveLocalizedText(event.summary, language).toLowerCase().includes(normalizedQuery) ||
        resolveLocalizedText(event.venue, language).toLowerCase().includes(normalizedQuery) ||
        resolveLocalizedText(event.host, language).toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        !selectedStatuses.length || selectedStatuses.includes(event.status);

      const matchesSignals =
        !selectedSignals.length ||
        selectedSignals.every((signal) => {
          if (signal === "joined") {
            return event.joined;
          }

          if (signal === "saved") {
            return event.saved;
          }

          if (signal === "guests") {
            return guestCount > 0;
          }

          if (signal === "connections") {
            return connectionCount > 0;
          }

          return true;
        });

      return matchesQuery && matchesStatus && matchesSignals;
    });
  }, [encounters, events, language, normalizedQuery, selectedSignals, selectedStatuses]);

  const radarEvents = useMemo(
    () => filteredEvents.filter((event) => event.status !== "recent"),
    [filteredEvents],
  );
  const activeFilterCount = selectedStatuses.length + selectedSignals.length;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          description={copy.events.description}
          eyebrow={copy.events.eyebrow}
          title={copy.events.title}
        />

        <SheetSearchBar
          activeFilterCount={activeFilterCount}
          onChangeText={setQuery}
          onOpenFilters={() => setFiltersVisible(true)}
          placeholder={`${copy.common.search}...`}
          surfaceTone="white"
          value={query}
        />

        <View style={styles.radarSection}>
          <View style={styles.radarHeader}>
            <Text style={styles.radarLabel}>{copy.events.radarTitle}</Text>
            <Text style={styles.radarMeta}>{copy.events.radarActive(radarEvents.length)}</Text>
          </View>

          {radarEvents.length ? (
            <EventRadar
              events={radarEvents}
              language={language}
              onOpenEvent={onOpenEvent}
            />
          ) : (
            <EmptyStatePanel
              actionLabel={activeFilterCount ? copy.common.clear : undefined}
              icon={activeFilterCount ? "options-outline" : "radio-outline"}
              onAction={
                activeFilterCount
                  ? () => {
                      setSelectedSignals([]);
                      setSelectedStatuses([]);
                    }
                  : undefined
              }
              title={
                activeFilterCount
                  ? language === "pt-BR"
                    ? "Nenhum evento ativo aparece no radar com estes filtros."
                    : "No active events appear in the radar with these filters."
                  : language === "pt-BR"
                    ? "Nenhum evento ativo aparece no radar agora."
                    : "No active events appear in the radar right now."
              }
            />
          )}
        </View>

        <View style={styles.list}>
          {filteredEvents.length ? (
            filteredEvents.map((event, index) => (
              <FadeInView delay={index * 50} key={event.id}>
                <EventCard
                  copy={copy}
                  encounters={encounters}
                  event={event}
                  language={language}
                  onOpenEvent={onOpenEvent}
                  onToggleSaved={onToggleSaved}
                />
              </FadeInView>
            ))
          ) : (
            <EmptyStatePanel
              actionLabel={activeFilterCount ? copy.common.clear : undefined}
              icon={activeFilterCount ? "options-outline" : "calendar-outline"}
              onAction={
                activeFilterCount
                  ? () => {
                      setSelectedSignals([]);
                      setSelectedStatuses([]);
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
      </ScrollView>

      <FilterDialog
        clearLabel={copy.common.clear}
        closeLabel={copy.common.close}
        hasActiveFilters={activeFilterCount > 0}
        onClear={() => {
          setSelectedSignals([]);
          setSelectedStatuses([]);
        }}
        onClose={() => setFiltersVisible(false)}
        onToggle={(sectionKey, optionId) => {
          if (sectionKey === "status") {
            setSelectedStatuses((current) => toggleFilterValue(current, optionId));
            return;
          }

          setSelectedSignals((current) => toggleFilterValue(current, optionId));
        }}
        sections={filterSections}
        selected={{
          signals: selectedSignals,
          status: selectedStatuses,
        }}
        title={copy.common.filters}
        visible={filtersVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 172,
    gap: 16,
  },
  radarSection: {
    gap: 12,
  },
  radarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  radarLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: theme.colors.muted,
  },
  radarMeta: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  list: {
    gap: 16,
  },
});
