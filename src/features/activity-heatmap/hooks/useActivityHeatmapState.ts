import { useMemo, useState } from "react";

import { Encounter, Language } from "../../../types";
import {
  buildActivity,
  getActivitySelectedCell,
  getActivityWeekdayLabels,
  WEEK_WIDTH,
} from "../model";

export function useActivityHeatmapState(encounters: Encounter[], language: Language) {
  const activity = useMemo(() => buildActivity(encounters, language), [encounters, language]);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(activity.todayKey);
  const gridWidth = activity.weeks.length * WEEK_WIDTH;
  const selectedCell = useMemo(
    () => getActivitySelectedCell(activity.weeks, selectedDateKey, activity.todayKey),
    [activity.todayKey, activity.weeks, selectedDateKey],
  );
  const weekdayLabels = useMemo(() => getActivityWeekdayLabels(language), [language]);

  return {
    activity,
    gridWidth,
    selectedCell,
    selectedDateKey,
    setSelectedDateKey,
    weekdayLabels,
  };
}
