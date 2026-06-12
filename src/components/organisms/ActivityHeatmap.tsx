import { memo } from "react";
import { StyleSheet, View } from "react-native";

import {
  ActivityHeatmapGrid,
  ActivityHeatmapSelection,
} from "../../features/activity-heatmap/components";
import { useActivityHeatmapState } from "../../features/activity-heatmap/hooks/useActivityHeatmapState";
import {
  ActivityCell,
} from "../../features/activity-heatmap/model";
import { AppCopy } from "../../i18n";
import { Encounter, Language } from "../../types";

interface ActivityHeatmapProps {
  copy: AppCopy;
  encounters: Encounter[];
  language: Language;
  onOpenEncounter: (encounter: Encounter) => void;
}

export const ActivityHeatmap = memo(function ActivityHeatmap({
  copy,
  encounters,
  language,
  onOpenEncounter,
}: ActivityHeatmapProps) {
  const {
    activity,
    gridWidth,
    selectedCell,
    selectedDateKey,
    setSelectedDateKey,
    weekdayLabels,
  } = useActivityHeatmapState(encounters, language);

  const handleSelectDate = (cell: ActivityCell) => {
    if (!cell.inYear) {
      return;
    }

    setSelectedDateKey(cell.dateKey);
  };

  return (
    <View style={styles.card}>
      <ActivityHeatmapGrid
        gridWidth={gridWidth}
        monthAnchors={activity.monthAnchors}
        onSelectDate={handleSelectDate}
        selectedDateKey={selectedDateKey}
        weekdayLabels={weekdayLabels}
        weeks={activity.weeks}
      />

      <ActivityHeatmapSelection
        cell={selectedCell}
        copy={copy}
        language={language}
        onOpenEncounter={onOpenEncounter}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
});
