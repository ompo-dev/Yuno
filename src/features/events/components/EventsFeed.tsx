import { StyleSheet, View } from "react-native";

import { FadeInView } from "../../../components/atoms";
import { EmptyStatePanel } from "../../../components/molecules";
import { EventCard } from "../../../components/organisms";
import { AppCopy } from "../../../i18n";
import { Encounter, EventSummary, Language } from "../../../types";
import { getEventsEmptyTitle } from "../model";

interface EventsFeedProps {
  activeFilterCount: number;
  copy: AppCopy;
  encounters: Encounter[];
  events: EventSummary[];
  language: Language;
  onClearFilters: () => void;
  onOpenEvent: (event: EventSummary) => void;
  onToggleSaved: (eventId: string) => void;
}

export function EventsFeed({
  activeFilterCount,
  copy,
  encounters,
  events,
  language,
  onClearFilters,
  onOpenEvent,
  onToggleSaved,
}: EventsFeedProps) {
  return (
    <View style={styles.list}>
      {events.length ? (
        events.map((event, index) => (
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
          onAction={activeFilterCount ? onClearFilters : undefined}
          title={getEventsEmptyTitle(language, activeFilterCount > 0, "list")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16,
  },
});
