import { Encounter, Language } from "../../types";

export interface ActivityCell {
  connections: Encounter[];
  dateKey: string;
  date: Date;
  dateLabel: string;
  dayIndex: number;
  inYear: boolean;
  level: 0 | 1 | 2 | 3 | 4;
  weekIndex: number;
}

export type ActivityWeek = ActivityCell[];

export const CELL_SIZE = 11;
export const CELL_GAP = 4;
export const WEEK_WIDTH = CELL_SIZE + CELL_GAP;
export const DAY_LABEL_WIDTH = 28;
export const ACTIVITY_LEVEL_COLORS = [
  "#EBEDF0",
  "#D7F2DD",
  "#A7E0B1",
  "#57BF6B",
  "#1A7F37",
] as const;

export function resolveLevel(count: number) {
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

export function buildActivity(encounters: Encounter[], language: Language) {
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

export function getActivityWeekdayLabels(language: Language) {
  return language === "pt-BR"
    ? ["Seg", "", "Qua", "", "Sex", "", ""]
    : ["Mon", "", "Wed", "", "Fri", "", ""];
}

export function getActivitySelectedCell(
  weeks: ActivityWeek[],
  selectedDateKey: string | null,
  todayKey: string,
) {
  const flatCells = weeks.flat();
  const selectedCell =
    flatCells.find((cell) => cell.dateKey === selectedDateKey) ?? null;

  return (
    selectedCell ??
    flatCells.find((cell) => cell.dateKey === todayKey) ??
    flatCells[flatCells.length - 1] ??
    null
  );
}

export function buildActivityEncounterContext(dateLabel: string) {
  return {
    en: `Found on ${dateLabel}`,
    "pt-BR": `Encontrado em ${dateLabel}`,
  } as const;
}
