import { Language } from "./types";
import { enCopy } from "./i18n/translations/en";
import { ptBRCopy } from "./i18n/translations/ptBR";
export { getInitialLanguage, resolveLocalizedText } from "./i18n/shared";
const translations = {
  en: enCopy,
  "pt-BR": ptBRCopy,
} as const;
export type AppCopy = (typeof translations)[Language];
export function getCopy(language: Language) {
  return translations[language];
}
