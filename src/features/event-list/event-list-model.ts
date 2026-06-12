import { FilterSection } from "../../components/organisms";
import { getConnectedEventAttendees, getEventGuests } from "../../encounterUtils";
import { AppCopy, resolveLocalizedText } from "../../i18n";
import { Encounter, EventSummary, Language } from "../../types";

interface FilterEventListParams {
  encounters: Encounter[];
  events: EventSummary[];
  language: Language;
  normalizedQuery: string;
  selectedSignals: string[];
  selectedStatuses: string[];
  selectedTimes: string[];
}

export function getTimeBucket(event: EventSummary, language: Language) {
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

export function buildEventListFilterSections(copy: AppCopy): FilterSection[] {
  return [
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
  ];
}

export function filterEventList({
  encounters,
  events,
  language,
  normalizedQuery,
  selectedSignals,
  selectedStatuses,
  selectedTimes,
}: FilterEventListParams) {
  return events.filter((event) => {
    const guestCount = getEventGuests(encounters, event.id).length;
    const connectedCount = getConnectedEventAttendees(encounters, event.id).length;
    const matchesQuery =
      !normalizedQuery ||
      resolveLocalizedText(event.name, language).toLowerCase().includes(normalizedQuery) ||
      resolveLocalizedText(event.venue, language).toLowerCase().includes(normalizedQuery);

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
}

export function getEventListEmptyTitle(language: Language, hasFilters: boolean) {
  if (hasFilters) {
    return language === "pt-BR"
      ? "Nenhum evento encontrado com estes filtros."
      : "No events match these filters.";
  }

  return language === "pt-BR"
    ? "Nenhum evento para mostrar agora."
    : "No events to show right now.";
}
