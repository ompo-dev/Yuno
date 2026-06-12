import { Language, LocalizedText } from "../types";
export function resolveLocalizedText(value: LocalizedText, language: Language) {
  if (typeof value === "string") {
    return value;
  }
  return value[language];
}
export function getInitialLanguage(): Language {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase();
  return locale.startsWith("pt") ? "pt-BR" : "en";
}
