import { FilterSection } from "../../components/organisms";
import { AppCopy, resolveLocalizedText } from "../../i18n";
import { Encounter, Language } from "../../types";

export function getEncounterPeriod(encounter: Encounter, language: Language) {
  const value = resolveLocalizedText(encounter.timeAgo, language).toLowerCase();
  return value.includes("d") ? "earlier" : "today";
}

export function buildPeopleListFilterSections(
  copy: AppCopy,
  encounters: Encounter[],
  language: Language,
): FilterSection[] {
  const tagOptions = Array.from(
    new Set(
      encounters.flatMap((encounter) =>
        encounter.tags.map((tag) => resolveLocalizedText(tag, language)),
      ),
    ),
  ).map((label) => ({ id: label, label }));
  const eventOptions = Array.from(
    new Map(
      encounters.map((encounter) => [
        encounter.eventId,
        resolveLocalizedText(encounter.event, language),
      ]),
    ),
  ).map(([id, label]) => ({ id, label }));

  return [
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
  ];
}

interface FilterPeopleListParams {
  encounters: Encounter[];
  language: Language;
  normalizedQuery: string;
  selectedEvents: string[];
  selectedPeriods: string[];
  selectedTags: string[];
}

export function filterPeopleList({
  encounters,
  language,
  normalizedQuery,
  selectedEvents,
  selectedPeriods,
  selectedTags,
}: FilterPeopleListParams) {
  return encounters.filter((encounter) => {
    const matchesQuery =
      !normalizedQuery ||
      encounter.name.toLowerCase().includes(normalizedQuery) ||
      encounter.company.toLowerCase().includes(normalizedQuery) ||
      resolveLocalizedText(encounter.role, language).toLowerCase().includes(normalizedQuery);

    const matchesTags =
      !selectedTags.length ||
      encounter.tags.some((tag) => selectedTags.includes(resolveLocalizedText(tag, language)));

    const matchesEvents =
      !selectedEvents.length || selectedEvents.includes(encounter.eventId);

    const matchesPeriods =
      !selectedPeriods.length ||
      selectedPeriods.includes(getEncounterPeriod(encounter, language));

    return matchesQuery && matchesTags && matchesEvents && matchesPeriods;
  });
}

export function getPeopleListEmptyTitle(language: Language, hasFilters: boolean) {
  if (hasFilters) {
    return language === "pt-BR"
      ? "Nenhuma conexao encontrada com estes filtros."
      : "No connections match these filters.";
  }

  return language === "pt-BR"
    ? "Nenhuma conexao para mostrar agora."
    : "No connections to show right now.";
}
