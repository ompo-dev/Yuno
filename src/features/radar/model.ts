import { resolveLocalizedText } from "../../i18n";
import { theme } from "../../theme";
import { Encounter, EventSummary, Language } from "../../types";

export interface RadarPresence {
  active: boolean;
  x: number;
  y: number;
}

export interface RadarAnchor {
  id: string;
  x: number;
  y: number;
}

export const RADAR_SIZE = 232;
export const NODE_SIZE = 38;
export const GHOST_ICON_SIZE = 20;
export const CENTER = RADAR_SIZE / 2 - NODE_SIZE / 2;
export const GHOST_ANCHORS: RadarAnchor[] = [
  { id: "ghost-1", x: -78, y: -58 },
  { id: "ghost-2", x: 64, y: -44 },
  { id: "ghost-3", x: -82, y: 26 },
  { id: "ghost-4", x: 34, y: 58 },
  { id: "ghost-5", x: 2, y: -80 },
];
export const GHOST_IDS = GHOST_ANCHORS.map((anchor) => anchor.id);

export function getEncounterRadarPoints(encounters: Encounter[]) {
  return encounters.filter((encounter) => encounter.radar).slice(0, 4);
}

export function buildEncounterRadarSignature(encounters: Encounter[]) {
  return encounters
    .map((encounter) =>
      encounter.radar
        ? `${encounter.id}:${encounter.radar.x}:${encounter.radar.y}:${encounter.radar.color}`
        : encounter.id,
    )
    .join("|");
}

export function getEventAbbreviation(event: EventSummary, language: Language) {
  const words = resolveLocalizedText(event.name, language)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2);

  return words.map((word) => word[0]?.toUpperCase() ?? "").join("");
}

export function getEventProgressBorder(progress: number) {
  if (progress <= 30) {
    return "#1A7F37";
  }

  if (progress <= 70) {
    return "#BF8700";
  }

  return "#CF222E";
}

export function getEventToneColors(tone: EventSummary["tone"]) {
  if (tone === "green") {
    return {
      background: theme.colors.greenSoft,
      text: theme.colors.green,
    };
  }

  if (tone === "purple") {
    return {
      background: "#F3EEFF",
      text: theme.colors.rose,
    };
  }

  return {
    background: theme.colors.blueSoft,
    text: theme.colors.blue,
  };
}
