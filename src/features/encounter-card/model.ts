import { resolveLocalizedText } from "../../i18n";
import { Encounter, Language } from "../../types";

export function getEncounterEventTone(encounter: Encounter) {
  return encounter.eventTone === "green"
    ? "green"
    : encounter.eventTone === "purple"
      ? "purple"
      : "blue";
}

export function getEncounterInteractionCopy(
  encounter: Encounter,
  language: Language,
) {
  return resolveLocalizedText(encounter.interactionLabel ?? encounter.context, language);
}

export function getEncounterFollowUpLabel(
  encounter: Encounter,
  language: Language,
) {
  if (encounter.connected) {
    return language === "pt-BR" ? "Conectado" : "Connected";
  }

  if (language === "pt-BR") {
    if (encounter.followUp === "warm") {
      return "Quente";
    }

    if (encounter.followUp === "starred") {
      return "Prioridade";
    }

    return "Pendente";
  }

  if (encounter.followUp === "warm") {
    return "Warm";
  }

  if (encounter.followUp === "starred") {
    return "Starred";
  }

  return "Pending";
}
