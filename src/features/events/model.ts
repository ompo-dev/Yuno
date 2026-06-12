import { FilterSection } from "../../components/organisms";
import { getConnectedEventAttendees, getEventGuests } from "../../encounterUtils";
import { AppCopy, resolveLocalizedText } from "../../i18n";
import { Encounter, EventSummary, Language } from "../../types";

interface FilterEventsParams {
  encounters: Encounter[];
  events: EventSummary[];
  language: Language;
  normalizedQuery: string;
  selectedSignals: string[];
  selectedStatuses: string[];
}

export function buildEventsFilterSections(copy: AppCopy): FilterSection[] {
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
      key: "signals",
      options: [
        { id: "joined", label: copy.events.joinedStatus },
        { id: "saved", label: copy.common.saved },
        { id: "guests", label: copy.common.withGuests },
        { id: "connections", label: copy.common.withConnections },
      ],
      title: copy.common.filters,
    },
  ];
}

export function filterEvents({
  encounters,
  events,
  language,
  normalizedQuery,
  selectedSignals,
  selectedStatuses,
}: FilterEventsParams) {
  return events.filter((event) => {
    const guestCount = getEventGuests(encounters, event.id).length;
    const connectionCount = getConnectedEventAttendees(encounters, event.id).length;
    const matchesQuery =
      !normalizedQuery ||
      resolveLocalizedText(event.name, language).toLowerCase().includes(normalizedQuery) ||
      resolveLocalizedText(event.summary, language)
        .toLowerCase()
        .includes(normalizedQuery) ||
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
}

export function getRadarEvents(events: EventSummary[]) {
  return events.filter((event) => event.status !== "recent");
}

export function getEventsEmptyTitle(
  language: Language,
  hasFilters: boolean,
  surface: "list" | "radar",
) {
  if (surface === "radar") {
    if (hasFilters) {
      return language === "pt-BR"
        ? "Nenhum evento ativo aparece no radar com estes filtros."
        : "No active events appear in the radar with these filters.";
    }

    return language === "pt-BR"
      ? "Nenhum evento ativo aparece no radar agora."
      : "No active events appear in the radar right now.";
  }

  if (hasFilters) {
    return language === "pt-BR"
      ? "Nenhum evento encontrado com estes filtros."
      : "No events match these filters.";
  }

  return language === "pt-BR"
    ? "Nenhum evento para mostrar agora."
    : "No events to show right now.";
}
