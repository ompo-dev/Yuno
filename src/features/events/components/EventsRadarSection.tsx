import { StyleSheet, Text, View } from "react-native";

import { EmptyStatePanel } from "../../../components/molecules";
import { EventRadar } from "../../../components/organisms";
import { AppCopy } from "../../../i18n";
import { theme } from "../../../theme";
import { EventSummary, Language } from "../../../types";
import { getEventsEmptyTitle } from "../model";

interface EventsRadarSectionProps {
  activeFilterCount: number;
  copy: AppCopy;
  language: Language;
  onClearFilters: () => void;
  onOpenEvent: (event: EventSummary) => void;
  radarEvents: EventSummary[];
}

export function EventsRadarSection({
  activeFilterCount,
  copy,
  language,
  onClearFilters,
  onOpenEvent,
  radarEvents,
}: EventsRadarSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.label}>{copy.events.radarTitle}</Text>
        <Text style={styles.meta}>{copy.events.radarActive(radarEvents.length)}</Text>
      </View>

      {radarEvents.length ? (
        <EventRadar events={radarEvents} language={language} onOpenEvent={onOpenEvent} />
      ) : (
        <EmptyStatePanel
          actionLabel={activeFilterCount ? copy.common.clear : undefined}
          icon={activeFilterCount ? "options-outline" : "radio-outline"}
          onAction={activeFilterCount ? onClearFilters : undefined}
          title={getEventsEmptyTitle(language, activeFilterCount > 0, "radar")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: theme.colors.muted,
  },
  meta: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.muted,
  },
});
