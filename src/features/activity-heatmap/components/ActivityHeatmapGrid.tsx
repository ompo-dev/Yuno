import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { theme } from "../../../theme";
import {
  ActivityCell,
  ActivityWeek,
  ACTIVITY_LEVEL_COLORS,
  CELL_GAP,
  CELL_SIZE,
  DAY_LABEL_WIDTH,
  WEEK_WIDTH,
} from "../model";

interface ActivityHeatmapGridProps {
  gridWidth: number;
  monthAnchors: Array<{ label: string; monthIndex: number; weekIndex: number }>;
  onSelectDate: (cell: ActivityCell) => void;
  selectedDateKey: string | null;
  weekdayLabels: string[];
  weeks: ActivityWeek[];
}

export function ActivityHeatmapGrid({
  gridWidth,
  monthAnchors,
  onSelectDate,
  selectedDateKey,
  weekdayLabels,
  weeks,
}: ActivityHeatmapGridProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.gridScroll}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.gridWrap}>
        <View style={styles.monthRow}>
          <View style={styles.dayLabelSpacer} />
          <View style={[styles.monthRail, { width: gridWidth }]}>
            {monthAnchors.map((anchor) => (
              <Text
                key={`${anchor.monthIndex}-${anchor.label}`}
                style={[styles.monthLabel, { left: anchor.weekIndex * WEEK_WIDTH }]}
              >
                {anchor.label}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.chartRow}>
          <View style={styles.dayLabelColumn}>
            {weekdayLabels.map((label, index) => (
              <View key={`${label}-${index}`} style={styles.dayLabelSlot}>
                {label ? <Text style={styles.dayLabel}>{label}</Text> : null}
              </View>
            ))}
          </View>

          <View style={styles.gridRow}>
            {weeks.map((week, weekIndex) => (
              <View key={`week-${weekIndex}`} style={styles.weekColumn}>
                {week.map((cell) => (
                  <Pressable
                    key={cell.dateKey}
                    onPress={() => onSelectDate(cell)}
                    style={[
                      styles.cell,
                      {
                        backgroundColor: cell.inYear
                          ? ACTIVITY_LEVEL_COLORS[cell.level]
                          : theme.colors.background,
                      },
                      !cell.inYear && styles.cellGhost,
                      selectedDateKey === cell.dateKey && styles.cellSelected,
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  gridScroll: {
    paddingRight: 8,
  },
  gridWrap: {
    gap: 8,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dayLabelSpacer: {
    width: DAY_LABEL_WIDTH,
  },
  monthRail: {
    position: "relative",
    height: 16,
  },
  monthLabel: {
    position: "absolute",
    top: 0,
    fontSize: 11,
    color: theme.colors.muted,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  dayLabelColumn: {
    width: DAY_LABEL_WIDTH,
    gap: CELL_GAP,
  },
  dayLabelSlot: {
    height: CELL_SIZE,
    justifyContent: "center",
  },
  dayLabel: {
    fontSize: 11,
    color: theme.colors.muted,
  },
  gridRow: {
    flexDirection: "row",
    gap: CELL_GAP,
    paddingBottom: 4,
  },
  weekColumn: {
    gap: CELL_GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 3,
  },
  cellGhost: {
    opacity: 0.35,
  },
  cellSelected: {
    borderWidth: 1,
    borderColor: theme.colors.ink,
  },
});
