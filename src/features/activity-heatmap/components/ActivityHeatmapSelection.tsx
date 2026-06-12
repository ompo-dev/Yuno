import { StyleSheet, Text, View } from "react-native";

import { EncounterCard } from "../../../components/organisms";
import { AppCopy } from "../../../i18n";
import { Encounter, Language } from "../../../types";
import { theme } from "../../../theme";
import { ActivityCell, buildActivityEncounterContext } from "../model";

interface ActivityHeatmapSelectionProps {
  cell: ActivityCell | null;
  copy: AppCopy;
  language: Language;
  onOpenEncounter: (encounter: Encounter) => void;
}

export function ActivityHeatmapSelection({
  cell,
  copy,
  language,
  onOpenEncounter,
}: ActivityHeatmapSelectionProps) {
  if (!cell) {
    return null;
  }

  return (
    <View style={styles.expandedSection}>
      <View style={styles.expandedHeader}>
        <Text style={styles.expandedTitle}>{cell.dateLabel}</Text>
        <Text style={styles.expandedMeta}>
          {copy.profile.dayConnections(cell.connections.length)}
        </Text>
      </View>

      {cell.connections.length ? (
        <View style={styles.peopleList}>
          {cell.connections.map((encounter) => (
            <EncounterCard
              encounter={{
                ...encounter,
                context: buildActivityEncounterContext(cell.dateLabel),
              }}
              key={`${cell.dateKey}-${encounter.id}`}
              language={language}
              onPress={onOpenEncounter}
            />
          ))}
        </View>
      ) : (
        <Text style={styles.emptyState}>{copy.profile.noConnectionsThatDay}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  expandedSection: {
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.line,
    paddingTop: 12,
  },
  expandedHeader: {
    gap: 2,
  },
  expandedTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  expandedMeta: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  peopleList: {
    gap: 10,
  },
  emptyState: {
    fontSize: 13,
    color: theme.colors.muted,
  },
});
