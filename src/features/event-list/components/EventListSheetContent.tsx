import { StyleSheet, View } from "react-native";

import { FadeInView } from "../../../components/atoms";
import { EmptyStatePanel } from "../../../components/molecules";
import { EventCard } from "../../../components/organisms";
import { AppCopy } from "../../../i18n";
import { Encounter, EventSummary, Language } from "../../../types";
import { getEventListEmptyTitle } from "../event-list-model";

interface EventListSheetContentProps {
  activeFilterCount: number;
  copy: AppCopy;
  encounters: Encounter[];
  events: EventSummary[];
  language: Language;
  onClearFilters: () => void;
  onOpenEvent: (event: EventSummary) => void;
  onToggleSaved: (eventId: string) => void;
}

export function EventListSheetContent({
  activeFilterCount,
  copy,
  encounters,
  events,
  language,
  onClearFilters,
  onOpenEvent,
  onToggleSaved,
}: EventListSheetContentProps) {
  return (
    <View style={styles.list}>
      {events.length ? (
        events.map((event, index) => (
          <FadeInView delay={index * 45} key={event.id}>
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
          onAction={activeFilterCount ? onClearFilters : undefined}
          title={getEventListEmptyTitle(language, activeFilterCount > 0)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 14,
  },
});
