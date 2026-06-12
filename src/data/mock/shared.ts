import { LocalizedText } from "../../types";
export const localized = (en: string, ptBR: string): LocalizedText => ({
  en,
  "pt-BR": ptBR,
});
export const ts = (value: string) => new Date(value).getTime();
