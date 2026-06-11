import { memo, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppCopy } from "../i18n";
import { Encounter, Language } from "../types";
import { theme } from "../theme";
import { EncounterCard } from "./EncounterCard";

interface ActivityHeatmapProps {
  copy: AppCopy;
  encounters: Encounter[];
  language: Language;
  onOpenEncounter: (encounter: Encounter) => void;
}

interface ActivityCell {
  connections: Encounter[];
  dateKey: string;
  date: Date;
  dateLabel: string;
  dayIndex: number;
  inYear: boolean;
  level: 0 | 1 | 2 | 3 | 4;
  weekIndex: number;
}

const CELL_SIZE = 11;
const CELL_GAP = 4;
const WEEK_WIDTH = CELL_SIZE + CELL_GAP;
const DAY_LABEL_WIDTH = 28;
const levelColors = [
  "#EBEDF0",
  "#D7F2DD",
  "#A7E0B1",
  "#57BF6B",
  "#1A7F37",
] as const;

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfWeek(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  const day = nextDate.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  nextDate.setDate(nextDate.getDate() + diff);
  return nextDate;
}

function diffInDays(start: Date, end: Date) {
  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

function normalizeDate(value: Date) {
  const nextDate = new Date(value);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

function resolveLevel(count: number) {
  if (count <= 0) {
    return 0;
  }

  if (count === 1) {
    return 1;
  }

  if (count === 2) {
    return 2;
  }

  if (count === 3) {
    return 3;
  }

  return 4;
}

function buildActivity(encounters: Encounter[], language: Language) {
  const visibleEncounters = encounters
    .filter((encounter) => encounter.connected && encounter.encounteredAtValue)
    .map((encounter) => ({
      ...encounter,
      encounteredAt: normalizeDate(new Date(encounter.encounteredAtValue!)),
    }));
  const locale = language === "pt-BR" ? "pt-BR" : "en-US";
  const dayFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  });
  const monthFormatter = new Intl.DateTimeFormat(locale, {
    month: "short",
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();
  const yearStart = new Date(currentYear, 0, 1);
  const gridStart = startOfWeek(yearStart);
  const totalDays = diffInDays(gridStart, today) + 1;
  const connectionsByDate = new Map<string, Encounter[]>();

  visibleEncounters.forEach((encounter) => {
    const date = encounter.encounteredAt;

    if (date.getFullYear() !== currentYear || date.getTime() > today.getTime()) {
      return;
    }

    const dateKey = toDateKey(date);
    const current = connectionsByDate.get(dateKey) ?? [];
    current.push(encounter);
    connectionsByDate.set(dateKey, current);
  });

  const cells: ActivityCell[] = Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    date.setHours(0, 0, 0, 0);
    const inYear = date.getFullYear() === currentYear;
    const dateKey = toDateKey(date);
    const dateConnections = connectionsByDate.get(dateKey) ?? [];

    return {
      connections: dateConnections,
      date,
      dateKey,
      dateLabel: dayFormatter.format(date),
      dayIndex: diffInDays(gridStart, date) % 7,
      inYear,
      level: resolveLevel(dateConnections.length),
      weekIndex: Math.floor(index / 7),
    };
  });

  const totalWeeks = Math.ceil(cells.length / 7);
  const weeks = Array.from({ length: totalWeeks }, (_, weekIndex) =>
    cells.slice(weekIndex * 7, weekIndex * 7 + 7),
  );
  const monthAnchors = Array.from({ length: today.getMonth() + 1 }, (_, monthIndex) => {
    const monthDate = new Date(currentYear, monthIndex, 1);
    return {
      label: monthFormatter.format(monthDate),
      monthIndex,
      weekIndex: Math.floor(diffInDays(gridStart, monthDate) / 7),
    };
  });

  return {
    monthAnchors,
    todayKey: toDateKey(new Date(currentYear, today.getMonth(), today.getDate())),
    weeks,
  };
}

export const ActivityHeatmap = memo(function ActivityHeatmap({
  copy,
  encounters,
  language,
  onOpenEncounter,
}: ActivityHeatmapProps) {
  const activity = useMemo(
    () => buildActivity(encounters, language),
    [encounters, language],
  );
  const weeks = activity.weeks;
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(
    activity.todayKey,
  );
  const flatCells = weeks.flat();
  const selectedCell =
    flatCells.find((cell) => cell.dateKey === selectedDateKey) ?? null;
  const fallbackSelectedCell =
    selectedCell ??
    flatCells.find((cell) => cell.dateKey === activity.todayKey) ??
    flatCells[flatCells.length - 1] ??
    null;
  const gridWidth = weeks.length * WEEK_WIDTH;
  const weekdayLabels =
    language === "pt-BR"
      ? ["Seg", "", "Qua", "", "Sex", "", ""]
      : ["Mon", "", "Wed", "", "Fri", "", ""];

  return (
    <View style={styles.card}>
      <ScrollView
        contentContainerStyle={styles.gridScroll}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.gridWrap}>
          <View style={styles.monthRow}>
            <View style={styles.dayLabelSpacer} />
            <View style={[styles.monthRail, { width: gridWidth }]}>
              {activity.monthAnchors.map((anchor) => (
                <Text
                  key={`${anchor.monthIndex}-${anchor.label}`}
                  style={[
                    styles.monthLabel,
                    { left: anchor.weekIndex * WEEK_WIDTH },
                  ]}
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
                      onPress={() => {
                        if (!cell.inYear) {
                          return;
                        }

                        setSelectedDateKey(cell.dateKey);
                      }}
                      style={[
                        styles.cell,
                        {
                          backgroundColor: cell.inYear
                            ? levelColors[cell.level]
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

      {fallbackSelectedCell ? (
        <View style={styles.expandedSection}>
          <View style={styles.expandedHeader}>
            <Text style={styles.expandedTitle}>{fallbackSelectedCell.dateLabel}</Text>
            <Text style={styles.expandedMeta}>
              {copy.profile.dayConnections(fallbackSelectedCell.connections.length)}
            </Text>
          </View>

          {fallbackSelectedCell.connections.length ? (
            <View style={styles.peopleList}>
              {fallbackSelectedCell.connections.map((encounter) => (
                <EncounterCard
                  encounter={{
                    ...encounter,
                    context: {
                      en: `Found on ${fallbackSelectedCell.dateLabel}`,
                      "pt-BR": `Encontrado em ${fallbackSelectedCell.dateLabel}`,
                    },
                  }}
                  key={`${fallbackSelectedCell.dateKey}-${encounter.id}`}
                  language={language}
                  onPress={onOpenEncounter}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.emptyState}>{copy.profile.noConnectionsThatDay}</Text>
          )}
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
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
