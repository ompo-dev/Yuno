import { Encounter } from "../../../types";
import { localized, ts } from "../shared";
import { encounter } from "./shared";

export const operatorSalonEncounters: Encounter[] = [
  encounter({
    id: "clara-ferraz",
    name: "Clara Ferraz",
    initials: "CF",
    avatarUrl: "https://i.pravatar.cc/160?img=50",
    encounteredAtValue: ts("2026-06-06T19:20:00-03:00"),
    role: localized("Product Operator", "Operadora de Produto"),
    company: "Evening Loop",
    eventId: "operator-salon",
    context: localized(
      "You met at a smaller salon about the systems behind thoughtful follow-up.",
      "Voce conheceu a Clara num salon menor sobre sistemas por tras de follow-up bem pensado.",
    ),
    description: localized(
      "Likes products that remove social admin from people's heads without removing consent from the experience.",
      "Gosta de produtos que tiram a administracao social da cabeca das pessoas sem tirar consentimento da experiencia.",
    ),
    interactionLabel: localized("Operator salon", "Salon de operadores"),
    interactionIcon: "people-outline",
    note: localized(
      "Great reference for shaping flows that feel calm, explicit, and easy to trust.",
      "Otima referencia para desenhar fluxos calmos, explicitos e faceis de confiar.",
    ),
    distance: localized("11 m", "11 m"),
    timeAgo: localized("5 d", "5 d"),
    tags: [localized("Operator", "Operadora"), localized("Consent", "Consentimento")],
    connectionCount: 423,
    sharedEventIds: ["operator-salon", "design-summit", "founders-breakfast"],
    mutualConnectionIds: ["sofia-mendes", "gabriel-santos", "noah-bennett"],
    socials: [
      { provider: "linkedin", value: "clara-ferraz-ops" },
      { provider: "instagram", value: "clarafz" },
    ],
    followUp: "warm",
    connected: true,
    gradient: ["#D7FFE8", "#66D59B"],
    radar: { color: "#5BC889", x: -18, y: 58 },
  }),
  encounter({
    id: "ravi-mehta",
    name: "Ravi Mehta",
    initials: "RM",
    avatarUrl: "https://i.pravatar.cc/160?img=36",
    encounteredAtValue: ts("2026-06-06T20:08:00-03:00"),
    role: localized("Systems Coach", "Coach de Sistemas"),
    company: "Harbor Practice",
    eventId: "operator-salon",
    context: localized(
      "You ended up talking about small habits people actually keep after the event is over.",
      "Voce acabou falando com Ravi sobre pequenos habitos que as pessoas realmente mantem depois que o evento acaba.",
    ),
    description: localized(
      "Pushes teams toward fewer but more trustworthy interaction surfaces and cleaner decision moments.",
      "Empurra times para menos superficies de interacao, mas com mais confianca e decisao mais limpa.",
    ),
    interactionLabel: localized("Systems chat", "Conversa de sistemas"),
    interactionIcon: "chatbubble-ellipses-outline",
    note: localized(
      "Would be useful if Yuno ever adds more reflective, lower-pressure prompts in the product.",
      "Seria util se o Yuno adicionar prompts mais reflexivos e de menor pressao dentro do produto.",
    ),
    distance: localized("15 m", "15 m"),
    timeAgo: localized("5 d", "5 d"),
    tags: [localized("Habits", "Habitos"), localized("Systems", "Sistemas")],
    connectionCount: 298,
    sharedEventIds: ["operator-salon", "ai-founder-forum"],
    mutualConnectionIds: ["clara-ferraz", "diego-lima", "thiago-alves"],
    socials: [
      { provider: "linkedin", value: "ravi-mehta-systems" },
      { provider: "telegram", value: "ravimehta" },
    ],
    followUp: "pending",
    connected: false,
    gradient: ["#E7E7FF", "#8D91FF"],
  }),
];
