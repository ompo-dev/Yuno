import { EventSummary } from "../../types";
import { localized } from "./shared";

export const recentEvents: EventSummary[] = [
  {
    id: "design-summit",
    name: localized("Design Summit", "Design Summit"),
    summary: localized(
      "A dense room for product, design, and research leaders who actually want to talk after sessions.",
      "Um ambiente denso de produto, design e pesquisa para quem realmente quer conversar depois das sessoes.",
    ),
    venue: localized("Pier 48", "Pier 48"),
    host: localized("Hosted by Craft Systems", "Organizado pela Craft Systems"),
    timeRange: localized("Today, 09:00 - 18:00", "Hoje, 09:00 - 18:00"),
    encounters: 12,
    warmLeads: 5,
    participants: 128,
    joined: true,
    saved: true,
    membersOnly: true,
    status: "live",
    tone: "blue",
    highlight: localized(
      "Strong density of product leaders and research operators in one room.",
      "Alta densidade de liderancas de produto e pesquisa no mesmo espaco.",
    ),
    progress: 82,
    radar: {
      x: 72,
      y: -18,
    },
  },
  {
    id: "tech-connect",
    name: localized("Tech Connect", "Tech Connect"),
    summary: localized(
      "A tighter technical crowd where warm intros outperform random outreach and hallway conversations matter.",
      "Um publico tecnico mais fechado, onde intros quentes funcionam melhor que abordagem aleatoria e conversas de corredor contam muito.",
    ),
    venue: localized("Warehouse North", "Warehouse North"),
    host: localized("Hosted by Pioneer Labs", "Organizado pela Pioneer Labs"),
    timeRange: localized("Tomorrow, 18:30 - 22:00", "Amanha, 18:30 - 22:00"),
    encounters: 9,
    warmLeads: 4,
    participants: 84,
    joined: false,
    saved: false,
    membersOnly: true,
    status: "upcoming",
    tone: "green",
    highlight: localized(
      "Engineering-heavy room where warm intros mattered more than cold outreach.",
      "Ambiente focado em engenharia, onde intros quentes valeram mais que outreach frio.",
    ),
    progress: 18,
    radar: {
      x: -60,
      y: 34,
    },
  },
  {
    id: "investor-meet",
    name: localized("Investor Meet", "Investor Meet"),
    summary: localized(
      "A compact investor session with short, high-signal conversations and a high chance of follow-up.",
      "Uma sessao compacta com investidores, conversas curtas e alto sinal para follow-up.",
    ),
    venue: localized("Skyline Club", "Skyline Club"),
    host: localized("Hosted by Leafline Circle", "Organizado pela Leafline Circle"),
    timeRange: localized("Friday, 08:30 - 10:00", "Sexta, 08:30 - 10:00"),
    encounters: 7,
    warmLeads: 3,
    participants: 42,
    joined: false,
    saved: true,
    membersOnly: true,
    status: "upcoming",
    tone: "purple",
    highlight: localized(
      "Short format, but every conversation had clear follow-up potential.",
      "Formato curto, mas com alto potencial de follow-up em cada conversa.",
    ),
    progress: 34,
    radar: {
      x: 18,
      y: 72,
    },
  },
  {
    id: "founders-breakfast",
    name: localized("Founders Breakfast", "Founders Breakfast"),
    summary: localized(
      "A small morning table for founders and early operators who prefer depth over loud networking.",
      "Uma mesa de manha para founders e operadores iniciais que preferem profundidade a networking barulhento.",
    ),
    venue: localized("Mercury House", "Mercury House"),
    host: localized("Hosted by Northline Circle", "Organizado pela Northline Circle"),
    timeRange: localized("Yesterday, 08:00 - 10:30", "Ontem, 08:00 - 10:30"),
    encounters: 6,
    warmLeads: 4,
    participants: 36,
    joined: true,
    saved: false,
    membersOnly: true,
    status: "recent",
    tone: "green",
    highlight: localized(
      "Smaller room, but the follow-up quality stayed unusually high.",
      "Sala menor, mas a qualidade do follow-up ficou acima da media.",
    ),
    progress: 100,
    radar: {
      x: -74,
      y: -22,
    },
  },
  {
    id: "retail-futures",
    name: localized("Retail Futures", "Retail Futures"),
    summary: localized(
      "An afternoon mix of operators, designers, and commerce leaders discussing real in-store behavior.",
      "Uma tarde com operadores, designers e liderancas de comercio discutindo comportamento real em loja.",
    ),
    venue: localized("Studio South", "Studio South"),
    host: localized("Hosted by Atlas Commerce", "Organizado pela Atlas Commerce"),
    timeRange: localized("Tuesday, 14:00 - 19:00", "Terca, 14:00 - 19:00"),
    encounters: 8,
    warmLeads: 3,
    participants: 94,
    joined: true,
    saved: true,
    membersOnly: true,
    status: "recent",
    tone: "blue",
    highlight: localized(
      "Strong overlap between research, retail ops, and product experimentation.",
      "Boa sobreposicao entre pesquisa, operacao de varejo e experimentacao de produto.",
    ),
    progress: 100,
    radar: {
      x: 64,
      y: 18,
    },
  },
  {
    id: "ai-founder-forum",
    name: localized("AI Founder Forum", "AI Founder Forum"),
    summary: localized(
      "A focused half-day for technical founders, investor guests, and product leaders building in AI.",
      "Um meio periodo focado em founders tecnicos, convidados investidores e liderancas de produto construindo em IA.",
    ),
    venue: localized("Signal Hall", "Signal Hall"),
    host: localized("Hosted by Runtime Ventures", "Organizado pela Runtime Ventures"),
    timeRange: localized("Saturday, 10:00 - 13:00", "Sabado, 10:00 - 13:00"),
    encounters: 5,
    warmLeads: 2,
    participants: 58,
    joined: false,
    saved: true,
    membersOnly: true,
    status: "upcoming",
    tone: "purple",
    highlight: localized(
      "A compact room where most intros already start with product context.",
      "Uma sala compacta em que quase toda intro ja comeca com contexto de produto.",
    ),
    progress: 57,
    radar: {
      x: -10,
      y: -76,
    },
  },
  {
    id: "operator-salon",
    name: localized("Operator Salon", "Operator Salon"),
    summary: localized(
      "An after-hours room for growth, product ops, and community people trading real workflows.",
      "Um encontro noturno para growth, product ops e comunidade trocando workflows reais.",
    ),
    venue: localized("Canopy Loft", "Canopy Loft"),
    host: localized("Hosted by Quiet Systems", "Organizado pela Quiet Systems"),
    timeRange: localized("Last week, 19:00 - 22:00", "Semana passada, 19:00 - 22:00"),
    encounters: 4,
    warmLeads: 2,
    participants: 31,
    joined: false,
    saved: false,
    membersOnly: true,
    status: "recent",
    tone: "green",
    highlight: localized(
      "Fewer people, but unusually practical notes and repeat intros.",
      "Menos gente, mas notas muito praticas e varias intros repetidas.",
    ),
    progress: 100,
    radar: {
      x: 0,
      y: 64,
    },
  },
];

const eventMap = new Map(recentEvents.map((event) => [event.id, event] as const));

export function getEventById(eventId: string) {
  const event = eventMap.get(eventId);

  if (!event) {
    throw new Error(`Missing mock event: ${eventId}`);
  }

  return event;
}
