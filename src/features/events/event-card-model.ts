import { EventSummary } from "../../types";

export function getEventCardStatusTone(status: EventSummary["status"]) {
  if (status === "live") {
    return "green" as const;
  }

  if (status === "upcoming") {
    return "blue" as const;
  }

  return "purple" as const;
}

export function parseEventCardTimeRange(value: string) {
  const [datePart, timePart] = value.split(",");
  return {
    date: datePart?.trim() ?? value,
    time: timePart?.trim() ?? value,
  };
}
