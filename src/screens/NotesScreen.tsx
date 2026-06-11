import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { EmptyStatePanel } from "../components/EmptyStatePanel";
import { FadeInView } from "../components/FadeInView";
import { FilterDialog, FilterSection } from "../components/FilterDialog";
import { MemoryNoteCard } from "../components/MemoryNoteCard";
import { ScreenHeader } from "../components/ScreenHeader";
import { SheetSearchBar } from "../components/SheetSearchBar";
import { toggleFilterValue } from "../filterUtils";
import { useDeferredSearch } from "../hooks/useDeferredSearch";
import { AppCopy, resolveLocalizedText } from "../i18n";
import { getEncounterNoteEvents } from "../noteTags";
import { getLatestNotesByEncounter } from "../noteUtils";
import { Encounter, EventSummary, Language, MemoryNote } from "../types";

interface NotesScreenProps {
  copy: AppCopy;
  encounters: Encounter[];
  events: EventSummary[];
  language: Language;
  notes: MemoryNote[];
  onOpenEncounter: (encounter: Encounter) => void;
}

export function NotesScreen({
  copy,
  encounters,
  events,
  language,
  notes,
  onOpenEncounter,
}: NotesScreenProps) {
  const { normalizedQuery, query, setQuery } = useDeferredSearch();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const noteItems = useMemo(
    () =>
      getLatestNotesByEncounter(notes)
        .map((note) => {
          const encounter = encounters.find((item) => item.id === note.encounterId);
          return encounter
            ? {
                encounter,
                note,
                noteEvents: getEncounterNoteEvents(encounter, events, language),
              }
            : null;
        })
        .filter(
          (
            item,
          ): item is {
            encounter: Encounter;
            note: MemoryNote;
            noteEvents: ReturnType<typeof getEncounterNoteEvents>;
          } => Boolean(item),
        ),
    [encounters, events, language, notes],
  );

  const filterSections: FilterSection[] = useMemo(
    () => [
      {
        key: "people",
        options: noteItems.map(({ encounter }) => ({
          id: encounter.id,
          label: encounter.name,
        })),
        title: copy.common.connections,
      },
      {
        key: "tags",
        options: Array.from(
          new Set(
            noteItems.flatMap(({ encounter }) =>
              encounter.tags.map((tag) => resolveLocalizedText(tag, language)),
            ),
          ),
        ).map((label) => ({ id: label, label })),
        title: copy.common.tags,
      },
      {
        key: "events",
        options: Array.from(
          new Map(
            noteItems.map(({ encounter }) => [
              encounter.eventId,
              resolveLocalizedText(encounter.event, language),
            ]),
          ),
        ).map(([id, label]) => ({ id, label })),
        title: copy.common.events,
      },
    ],
    [copy.common.connections, copy.common.events, copy.common.tags, language, noteItems],
  );

  const filteredNotes = useMemo(() => {
    return noteItems.filter(({ encounter, note }) => {
      const matchesQuery =
        !normalizedQuery ||
        encounter.name.toLowerCase().includes(normalizedQuery) ||
        encounter.company.toLowerCase().includes(normalizedQuery) ||
        resolveLocalizedText(note.body, language)
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesPeople =
        !selectedPeople.length || selectedPeople.includes(encounter.id);

      const matchesTags =
        !selectedTags.length ||
        encounter.tags.some((tag) =>
          selectedTags.includes(resolveLocalizedText(tag, language)),
        );

      const matchesEvents =
        !selectedEvents.length || selectedEvents.includes(encounter.eventId);

      return matchesQuery && matchesPeople && matchesTags && matchesEvents;
    });
  }, [language, normalizedQuery, noteItems, selectedEvents, selectedPeople, selectedTags]);

  const activeFilterCount =
    selectedPeople.length + selectedTags.length + selectedEvents.length;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          description={copy.notes.description}
          eyebrow={copy.notes.eyebrow}
          title={copy.notes.title}
        />

        <SheetSearchBar
          activeFilterCount={activeFilterCount}
          onChangeText={setQuery}
          onOpenFilters={() => setFiltersVisible(true)}
          placeholder={`${copy.common.search}...`}
          surfaceTone="white"
          value={query}
        />

        <View style={styles.notesList}>
          {filteredNotes.length ? (
            filteredNotes.map(({ encounter, note, noteEvents }, index) => (
              <FadeInView delay={index * 45} key={note.id}>
                <MemoryNoteCard
                  copy={copy}
                  encounter={encounter}
                  language={language}
                  note={note}
                  noteEvents={noteEvents}
                  onPress={onOpenEncounter}
                />
              </FadeInView>
            ))
          ) : (
            <EmptyStatePanel
              actionLabel={activeFilterCount ? copy.common.clear : undefined}
              icon={activeFilterCount ? "options-outline" : "document-text-outline"}
              onAction={
                activeFilterCount
                  ? () => {
                      setSelectedPeople([]);
                      setSelectedTags([]);
                      setSelectedEvents([]);
                    }
                  : undefined
              }
              title={
                activeFilterCount
                  ? language === "pt-BR"
                    ? "Nenhuma nota encontrada com estes filtros."
                    : "No notes match these filters."
                  : language === "pt-BR"
                    ? "Nenhuma nota para mostrar agora."
                    : "No notes to show right now."
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
          setSelectedPeople([]);
          setSelectedTags([]);
          setSelectedEvents([]);
        }}
        onClose={() => setFiltersVisible(false)}
        onToggle={(sectionKey, optionId) => {
          if (sectionKey === "people") {
            setSelectedPeople((current) => toggleFilterValue(current, optionId));
            return;
          }

          if (sectionKey === "tags") {
            setSelectedTags((current) => toggleFilterValue(current, optionId));
            return;
          }

          setSelectedEvents((current) => toggleFilterValue(current, optionId));
        }}
        sections={filterSections}
        selected={{
          events: selectedEvents,
          people: selectedPeople,
          tags: selectedTags,
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
  notesList: {
    gap: 14,
  },
});
