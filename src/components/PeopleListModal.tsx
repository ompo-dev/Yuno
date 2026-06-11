import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppCopy, resolveLocalizedText } from "../i18n";
import { toggleFilterValue } from "../filterUtils";
import { useDeferredSearch } from "../hooks/useDeferredSearch";
import { Encounter, Language } from "../types";
import { theme } from "../theme";
import { BottomSheetModal } from "./BottomSheetModal";
import { EmptyStatePanel } from "./EmptyStatePanel";
import { FilterDialog, FilterSection } from "./FilterDialog";
import { ProfileListRow } from "./ProfileListRow";
import { SheetSearchBar } from "./SheetSearchBar";

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

function getEncounterPeriod(encounter: Encounter, language: Language) {
  const value = resolveLocalizedText(encounter.timeAgo, language).toLowerCase();
  return value.includes("d") ? "earlier" : "today";
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
  const [cachedEncounters, setCachedEncounters] = useState(encounters);
  const [cachedTitle, setCachedTitle] = useState(title);
  const { normalizedQuery, query, resetQuery, setQuery } = useDeferredSearch();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const activeEncounters = encounters.length ? encounters : cachedEncounters;
  const activeTitle = title || cachedTitle;

  useEffect(() => {
    if (encounters.length) {
      setCachedEncounters(encounters);
    }
  }, [encounters]);

  useEffect(() => {
    if (title) {
      setCachedTitle(title);
    }
  }, [title]);

  useEffect(() => {
    if (!visible) {
      resetQuery();
      setFiltersVisible(false);
      setSelectedTags([]);
      setSelectedEvents([]);
      setSelectedPeriods([]);
    }
  }, [resetQuery, visible]);

  const tagOptions = useMemo(
    () =>
      Array.from(
        new Set(
          activeEncounters.flatMap((encounter) =>
            encounter.tags.map((tag) => resolveLocalizedText(tag, language)),
          ),
        ),
      ).map((label) => ({ id: label, label })),
    [activeEncounters, language],
  );

  const eventOptions = useMemo(
    () =>
      Array.from(
        new Map(
          activeEncounters.map((encounter) => [
            encounter.eventId,
            resolveLocalizedText(encounter.event, language),
          ]),
        ),
      ).map(([id, label]) => ({ id, label })),
    [activeEncounters, language],
  );

  const filterSections: FilterSection[] = useMemo(
    () => [
      {
        key: "tags",
        options: tagOptions,
        title: copy.common.tags,
      },
      {
        key: "events",
        options: eventOptions,
        title: copy.common.events,
      },
      {
        key: "periods",
        options: [
          { id: "today", label: copy.common.today },
          { id: "earlier", label: copy.common.earlier },
        ],
        title: copy.common.periods,
      },
    ],
    [
      copy.common.earlier,
      copy.common.events,
      copy.common.periods,
      copy.common.tags,
      copy.common.today,
      eventOptions,
      tagOptions,
    ],
  );

  const filteredEncounters = useMemo(() => {
    return activeEncounters.filter((encounter) => {
      const matchesQuery =
        !normalizedQuery ||
        encounter.name.toLowerCase().includes(normalizedQuery) ||
        encounter.company.toLowerCase().includes(normalizedQuery) ||
        resolveLocalizedText(encounter.role, language)
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesTags =
        !selectedTags.length ||
        encounter.tags.some((tag) =>
          selectedTags.includes(resolveLocalizedText(tag, language)),
        );

      const matchesEvents =
        !selectedEvents.length || selectedEvents.includes(encounter.eventId);

      const matchesPeriods =
        !selectedPeriods.length ||
        selectedPeriods.includes(getEncounterPeriod(encounter, language));

      return matchesQuery && matchesTags && matchesEvents && matchesPeriods;
    });
  }, [activeEncounters, language, normalizedQuery, selectedEvents, selectedPeriods, selectedTags]);

  const activeFilterCount =
    selectedTags.length + selectedEvents.length + selectedPeriods.length;

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
            setSelectedTags([]);
            setSelectedEvents([]);
            setSelectedPeriods([]);
          }}
          onClose={() => setFiltersVisible(false)}
          onToggle={(sectionKey, optionId) => {
            if (sectionKey === "tags") {
              setSelectedTags((current) => toggleFilterValue(current, optionId));
              return;
            }

            if (sectionKey === "events") {
              setSelectedEvents((current) => toggleFilterValue(current, optionId));
              return;
            }

            setSelectedPeriods((current) => toggleFilterValue(current, optionId));
          }}
          sections={filterSections}
          selected={{
            events: selectedEvents,
            periods: selectedPeriods,
            tags: selectedTags,
          }}
          title={copy.common.filters}
          visible={filtersVisible}
        />
      }
      visible={visible}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{activeTitle}</Text>
        <Text style={styles.meta}>{filteredEncounters.length}</Text>
      </View>

      <SheetSearchBar
        activeFilterCount={activeFilterCount}
        onChangeText={setQuery}
        onOpenFilters={() => setFiltersVisible(true)}
        placeholder={`${copy.common.search}...`}
        value={query}
      />

      <View style={styles.list}>
        {filteredEncounters.length ? (
          filteredEncounters.map((encounter) => (
            <ProfileListRow
              encounter={encounter}
              key={encounter.id}
              language={language}
              onPress={onOpenEncounter}
            />
          ))
        ) : (
          <EmptyStatePanel
            actionLabel={activeFilterCount ? copy.common.clear : undefined}
            icon={activeFilterCount ? "options-outline" : "people-outline"}
            onAction={
              activeFilterCount
                ? () => {
                    setSelectedTags([]);
                    setSelectedEvents([]);
                    setSelectedPeriods([]);
                  }
                : undefined
            }
            title={
              activeFilterCount
                ? language === "pt-BR"
                  ? "Nenhuma conexao encontrada com estes filtros."
                  : "No connections match these filters."
                : language === "pt-BR"
                  ? "Nenhuma conexao para mostrar agora."
                  : "No connections to show right now."
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
    gap: 10,
  },
});
