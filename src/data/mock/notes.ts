import { resolveLocalizedText } from "../../i18n";
import { createNoteEventToken } from "../../noteTags";
import { LocalizedText, MemoryNote } from "../../types";
import { getEventById } from "./events";
import { localized, ts } from "./shared";
function eventToken(eventId: string, language: "en" | "pt-BR") {
  return createNoteEventToken(resolveLocalizedText(getEventById(eventId).name, language));
}
function buildNoteBody(
  eventIds: string[],
  en: string,
  ptBR: string,
): LocalizedText {
  const enPrefix = eventIds.map((eventId) => eventToken(eventId, "en")).join(" ");
  const ptPrefix = eventIds.map((eventId) => eventToken(eventId, "pt-BR")).join(" ");
  return {
    en: [enPrefix, en].filter(Boolean).join(" "),
    "pt-BR": [ptPrefix, ptBR].filter(Boolean).join(" "),
  };
}
type NoteSeed = {
  createdAt: LocalizedText;
  createdAtValue: number;
  encounterId: string;
  en: string;
  eventIds: string[];
  id: string;
  ptBR: string;
  updatedAt?: LocalizedText;
  updatedAtValue?: number;
};

function note(seed: NoteSeed): MemoryNote {
  return {
    body: buildNoteBody(seed.eventIds, seed.en, seed.ptBR),
    createdAt: seed.createdAt,
    createdAtValue: seed.createdAtValue,
    encounterId: seed.encounterId,
    id: seed.id,
    updatedAt: seed.updatedAt,
    updatedAtValue: seed.updatedAtValue,
  };
}
export const memoryNotes: MemoryNote[] = [
  note({
    id: "note-1",
    encounterId: "rohan-patel",
    eventIds: ["tech-connect"],
    en: "Rohan can sanity-check the background Bluetooth trade-offs once the interaction flow is stable.",
    ptBR: "O Rohan pode validar os trade-offs de Bluetooth em background quando o fluxo principal estiver redondo.",
    createdAt: localized("Saved Monday", "Salvo na segunda"),
    createdAtValue: ts("2026-06-09T09:20:00-03:00"),
    updatedAt: localized("Edited today", "Editado hoje"),
    updatedAtValue: ts("2026-06-11T11:15:00-03:00"),
  }),
  note({
    id: "note-2",
    encounterId: "rohan-patel",
    eventIds: ["ai-founder-forum"],
    en: "Send the exact iOS background constraints and ask for his real-world failure cases.",
    ptBR: "Voltar com as restricoes exatas de background no iOS e pedir os casos reais de falha que ele ja viu.",
    createdAt: localized("Saved 2 h ago", "Salvo ha 2 h"),
    createdAtValue: ts("2026-06-11T12:10:00-03:00"),
  }),
  note({
    id: "note-3",
    encounterId: "jason-lee",
    eventIds: ["investor-meet"],
    en: "Jason reacted well to Yuno as a memory layer for people you already met in real life.",
    ptBR: "Jason reagiu bem ao Yuno como camada de memoria para pessoas que voce ja conheceu no mundo real.",
    createdAt: localized("Saved 42 min ago", "Salvo ha 42 min"),
    createdAtValue: ts("2026-06-11T13:28:00-03:00"),
  }),
  note({
    id: "note-4",
    encounterId: "maya-reynolds",
    eventIds: ["design-summit", "retail-futures"],
    en: "Maya wants to test prompts that help quieter attendees remember who felt worth following up with.",
    ptBR: "A Maya quer testar prompts que ajudam participantes mais discretos a lembrar quem vale um follow-up.",
    createdAt: localized("Saved today", "Salvo hoje"),
    createdAtValue: ts("2026-06-11T10:05:00-03:00"),
  }),
  note({
    id: "note-5",
    encounterId: "avery-chen",
    eventIds: ["design-summit"],
    en: "Avery has a strong lens on onboarding moments where social friction usually kills follow-up.",
    ptBR: "A Avery tem uma visao muito forte sobre os momentos de onboarding em que a friccao social costuma matar o follow-up.",
    createdAt: localized("Saved 1 h ago", "Salvo ha 1 h"),
    createdAtValue: ts("2026-06-11T14:08:00-03:00"),
  }),
  note({
    id: "note-6",
    encounterId: "sofia-mendes",
    eventIds: ["operator-salon"],
    en: "Sofia is especially sharp on low-pressure rituals that still create warm intros.",
    ptBR: "A Sofia foi especialmente afiada sobre rituais de baixa pressao que ainda geram intros quentes.",
    createdAt: localized("Saved just now", "Salvo agora"),
    createdAtValue: ts("2026-06-11T16:45:00-03:00"),
  }),
  note({
    id: "note-7",
    encounterId: "thiago-alves",
    eventIds: ["founders-breakfast"],
    en: "Thiago immediately understood the retention story: timing plus memory beats a bigger contact list.",
    ptBR: "O Thiago entendeu na hora a tese de retencao: timing com memoria vale mais que uma lista maior de contatos.",
    createdAt: localized("Saved yesterday", "Salvo ontem"),
    createdAtValue: ts("2026-06-10T08:55:00-03:00"),
  }),
  note({
    id: "note-8",
    encounterId: "luca-moretti",
    eventIds: ["retail-futures"],
    en: "Luca could help if the product ever needs a more physical-event visual language.",
    ptBR: "O Luca pode ajudar se o produto algum dia precisar de uma linguagem visual mais ligada a eventos fisicos.",
    createdAt: localized("Saved yesterday", "Salvo ontem"),
    createdAtValue: ts("2026-06-10T09:58:00-03:00"),
  }),
  note({
    id: "note-9",
    encounterId: "nina-park",
    eventIds: ["tech-connect", "ai-founder-forum"],
    en: "Nina is a strong distribution angle if Yuno ever appears in devrel-heavy events and booths.",
    ptBR: "A Nina e uma boa alavanca de distribuicao se o Yuno aparecer em eventos e booths mais ligados a devrel.",
    createdAt: localized("Saved Tuesday", "Salvo na terca"),
    createdAtValue: ts("2026-06-09T19:34:00-03:00"),
  }),
  note({
    id: "note-10",
    encounterId: "amina-yusuf",
    eventIds: ["retail-futures"],
    en: "Amina ties physical traffic to follow-up behavior better than almost anyone in the room.",
    ptBR: "A Amina conecta fluxo fisico a comportamento de follow-up melhor que quase todo mundo na sala.",
    createdAt: localized("Saved last month", "Salvo no mes passado"),
    createdAtValue: ts("2026-05-14T13:48:00-03:00"),
  }),
  note({
    id: "note-11",
    encounterId: "elena-petrova",
    eventIds: ["ai-founder-forum"],
    en: "Elena has the cleanest founder-facing articulation for why this product is not random social discovery.",
    ptBR: "A Elena tem a articulacao mais limpa para founders sobre por que este produto nao e descoberta social aleatoria.",
    createdAt: localized("Saved in March", "Salvo em marco"),
    createdAtValue: ts("2026-03-18T18:04:00-03:00"),
  }),
  note({
    id: "note-12",
    encounterId: "noah-bennett",
    eventIds: ["tech-connect"],
    en: "Noah is the person to ask when a promised proximity behavior sounds too magical to be honest.",
    ptBR: "O Noah e a pessoa certa para perguntar quando um comportamento de proximidade parece magico demais para ser honesto.",
    createdAt: localized("Saved in January", "Salvo em janeiro"),
    createdAtValue: ts("2026-01-29T12:55:00-03:00"),
  }),
];
