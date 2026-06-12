import { FilterSection } from "../../components/organisms";
import { getEncounterNoteEvents } from "../../noteTags";
import { getLatestNotesByEncounter } from "../../noteUtils";
import { AppCopy, resolveLocalizedText } from "../../i18n";
import { Encounter, EventSummary, Language, MemoryNote } from "../../types";

export interface NoteFeedItem {
  encounter: Encounter;
  note: MemoryNote;
  noteEvents: ReturnType<typeof getEncounterNoteEvents>;
}

interface FilterNoteItemsParams {
  items: NoteFeedItem[];
  language: Language;
  normalizedQuery: string;
  selectedEvents: string[];
  selectedPeople: string[];
  selectedTags: string[];
}

export function buildNoteFeedItems(
  notes: MemoryNote[],
  encounters: Encounter[],
  events: EventSummary[],
  language: Language,
) {
  return getLatestNotesByEncounter(notes)
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
    .filter((item): item is NoteFeedItem => Boolean(item));
}

export function buildNotesFilterSections(
  copy: AppCopy,
  items: NoteFeedItem[],
  language: Language,
): FilterSection[] {
  return [
    {
      key: "people",
      options: items.map(({ encounter }) => ({
        id: encounter.id,
        label: encounter.name,
      })),
      title: copy.common.connections,
    },
    {
      key: "tags",
      options: Array.from(
        new Set(
          items.flatMap(({ encounter }) =>
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
          items.map(({ encounter }) => [
            encounter.eventId,
            resolveLocalizedText(encounter.event, language),
          ]),
        ),
      ).map(([id, label]) => ({ id, label })),
      title: copy.common.events,
    },
  ];
}

export function filterNoteItems({
  items,
  language,
  normalizedQuery,
  selectedEvents,
  selectedPeople,
  selectedTags,
}: FilterNoteItemsParams) {
  return items.filter(({ encounter, note }) => {
    const matchesQuery =
      !normalizedQuery ||
      encounter.name.toLowerCase().includes(normalizedQuery) ||
      encounter.company.toLowerCase().includes(normalizedQuery) ||
      resolveLocalizedText(note.body, language).toLowerCase().includes(normalizedQuery);

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
}

export function getNotesEmptyTitle(language: Language, hasFilters: boolean) {
  if (hasFilters) {
    return language === "pt-BR"
      ? "Nenhuma nota encontrada com estes filtros."
      : "No notes match these filters.";
  }

  return language === "pt-BR"
    ? "Nenhuma nota para mostrar agora."
    : "No notes to show right now.";
}
