import { Language, LocalizedText, VisibilityPreset } from "./types";

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

const translations = {
  en: {
    tabs: {
      home: "Home",
      events: "Events",
      notes: "Notes",
      profile: "Profile",
    },
    visibility: {
      "1h": "1h",
      "8h": "8h",
      "24h": "24h",
      off: "Off",
    } as Record<VisibilityPreset, string>,
    onboarding: {
      auth: {
        eyebrow: "Real-world networking",
        title: "Keep the right people within reach after the room is gone.",
        body:
          "Mock sign in with Apple or Google to enter the prototype. Yuno remembers who was physically nearby, which event you shared, and what is worth following up on.",
        appleLabel: "Continue with Apple",
        googleLabel: "Continue with Google",
        hint: "Mock authentication for this prototype.",
      },
      steps: [
        {
          eyebrow: "Nearby memory",
          title: "Meet first. Reconnect later without QR detours.",
          body:
            "When two people with the app spend time nearby, the profile is remembered automatically so nobody needs to interrupt the conversation asking for links.",
          points: [
            "Recent encounters",
            "Direct profile links",
            "No awkward second ask",
          ],
          icon: "people-outline" as const,
        },
        {
          eyebrow: "Event context",
          title: "See which connections are inside the same event.",
          body:
            "Open an event to spot joined connections, invited guests, and the exact room where the strongest follow-up might happen.",
          points: [
            "Joined events",
            "Invited guests",
            "Connections going",
          ],
          icon: "calendar-outline" as const,
        },
        {
          eyebrow: "Notes that matter",
          title: "Save the detail that makes the follow-up feel human.",
          body:
            "Add a quick note right after the conversation so days later you still remember the topic, timing, and why that person mattered.",
          points: [
            "Quick notes",
            "Shared-event tags",
            "Better follow-up",
          ],
          icon: "document-text-outline" as const,
        },
      ],
      continueLabel: "Continue",
      enterLabel: "Enter demo",
    },
    home: {
      greeting: (name: string) => `Good evening, ${name}`,
      title: "Recent Encounters",
      visibleNow: "Visible now",
      invisibleFor: (preset: string) => `Invisible for ${preset}`,
      mockScanActive: "Mock scan active",
      nearbyToday: (count: number) => `${count} nearby today`,
      heroTitle: "Recover the people that mattered, even after the room is gone.",
      heroBody:
        "Every encounter in this demo is mocked, but the product feeling is real: meet someone in person, open the app later, and reconnect with context.",
      visibleProfiles: "visible profiles",
      privatePassBys: "private pass-bys",
      warmFollowUps: "warm follow-ups",
      hiddenProfilesTitle: (count: number) =>
        `${count} hidden profiles passed nearby`,
      hiddenProfilesBody:
        "You know someone was there, but identity stays private until they choose to be seen.",
      sectionTitle: "People to revisit",
      sectionMeta: "Tap a row for the profile sheet",
      listTitle: "People you can revisit",
      listBody: "Only real nearby encounters stay here, with enough context to reconnect later.",
      filters: {
        all: "All",
        people: "People",
        passBys: "Pass-bys",
      },
      subtitle: "People you've met nearby in the last 7 days.",
      radarLive: "Live radar",
      presenceTitle: "Visible nearby",
      presenceBody:
        "Turn this off and your profile disappears completely from nearby discovery until you enable it again.",
      visibleNearby: "Nearby sharing on",
      invisibleNearby: "Nearby sharing off",
      radarButton: "Radar",
      radarTitle: "Live proximity radar",
      radarDetected: (count: number) => `${count} people detected`,
      radarDetectedCompact: (count: number) => `${count} nearby`,
      privatePassBySummary: (count: number) => `${count} private pass-bys`,
      privatePassByBody: "People nearby who chose to remain private.",
      passBysEmptyTitle: "Private pass-bys stay anonymous",
      passBysEmptyBody:
        "This view only confirms they were nearby. Their profile stays hidden until they choose to appear.",
    },
    events: {
      eyebrow: "Event memory",
      title: "Where your best conversations happened",
      description:
        "Group encounters by event so every follow-up keeps its original context.",
      radarTitle: "Event radar",
      radarActive: (count: number) =>
        count === 1 ? "1 event live in radar" : `${count} events live in radar`,
      eventDetails: "Event details",
      viewEvent: "View event",
      joinEvent: "Join event",
      leaveEvent: "Leave event",
      joinedStatus: "Joined",
      invitedGuests: (count: number) =>
        count === 1 ? "1 guest" : `${count} guests`,
      invitedGuestsTitle: "Invited guests",
      privateGuest: "Private guest",
      membersOnly: "Members only nearby",
      participantsLabel: "participants",
      connectionsGoing: "connections going",
      yourConnections: "Your connections in this event",
      mayRunInto: "People you may run into",
      hostedBy: "Hosted by",
      eventPrivacyTitle: "Protected visibility while inside the event",
      eventPrivacyBody:
        "When you join an event, only members of that event can discover you in that place and time window.",
      eventPrivacyActive:
        "You are protected from everyone outside this event while checked in.",
      eventPrivacyInactive:
        "Join the event to become visible only to members during the event window.",
      status: {
        live: "Live",
        upcoming: "Upcoming",
        recent: "Closed",
      },
      peopleSeen: "people seen",
      warmLeads: "warm leads",
      savedInFeed: "saved in feed",
      attendees: "People from this event",
      attendeeCount: (count: number) => `${count} people captured`,
      signal:
        "Best used when event organizers encourage attendees to keep the app open.",
    },
    notes: {
      eyebrow: "Memory notes",
      title: "Keep the conversation context while it is still fresh.",
      description:
        "Small notes make the later follow-up feel intentional instead of random.",
      tipTitle: "This is the quiet retention mechanic.",
      tipBody:
        "Notes are what make the app still useful three weeks after the event.",
      addNote: "Add note",
      editNote: "Edit note",
      deleteNote: "Delete note",
      openProfile: "Open profile",
    },
    profile: {
      title: "You",
      description:
        "Tune what people see when they rediscover you after the event.",
      activityTitle: "Network activity",
      activityBody:
        "A yearly view of how often you found people worth remembering and how strongly those moments turned into real connections.",
      activityLegendQuiet: "lighter",
      activityLegendDense: "stronger",
      peopleFound: "people found",
      connectionsClosed: "connections kept",
      joinedEvents: "joined events",
      bestWeek: (value: number) => `Best week ${value}`,
      dayConnections: (count: number) =>
        count === 1 ? "1 connection that day" : `${count} connections that day`,
      viewPeople: "View people",
      connectedThatDay: "Connected that day",
      noConnectionsThatDay: "No saved connections on this day",
      memberPrivacyTitle: "Event-member visibility",
      memberPrivacyBody:
        "When you join an event, your presence there is only discoverable by other members of that same event.",
      edit: "Edit",
      done: "Done",
      cancel: "Cancel",
      addLink: "Add",
      editLink: "Save link",
      removeLink: "Delete link",
      addInterest: "Add interest",
      addInterestPlaceholder: "Type a tag you want to show",
      socialLinkPlaceholder: "Paste your profile link, email, or number",
      socialLinkHint:
        "Yuno detects the network from the link and formats the tag automatically.",
      changePhoto: "Change photo",
      changePhotoHint: "Pick a profile image style for this mock profile.",
      editProfileTitle: "Profile details",
      editProfileBody:
        "Keep this short and immediately useful after a real conversation.",
      fullNameLabel: "Full name",
      roleLabel: "Role",
      subtitleLabel: "Subtitle",
      companyLabel: "Company",
      headlineLabel: "Headline",
      publicLinksTitle: "Public links",
      publicLinksBody:
        "These are the contact paths people expect after a strong event conversation.",
      linkedinLabel: "LinkedIn",
      instagramLabel: "Instagram",
      whatsappLabel: "WhatsApp",
      xLabel: "X",
      telegramLabel: "Telegram",
      emailLabel: "Email",
      interestsTitle: "Interests",
      interestsBody: "These tags shape how you appear in nearby memory.",
      languageTitle: "Language",
      languageBody:
        "Switch all product copy between English and Brazilian Portuguese.",
      recentEncounters: "recent encounters",
      connectionsSaved: "connections saved",
      invisibleMode: "Invisible mode",
      invisibleBody:
        "Control when your profile disappears from nearby history.",
      premiumTitle: "Premium privacy enabled",
      premiumBody:
        "This mock includes instant invisibility, event-member visibility, and extended history as the clearest premium hooks.",
      connectionsTitle: "Your connections",
      eventsTitle: "Your events",
    },
    encounterCard: {
      connected: "Connected",
      openProfile: "Open profile",
      followUp: {
        warm: "Warm",
        starred: "Starred",
        pending: "Pending",
      },
    },
    detail: {
      remember: "What you will remember",
      actions: "Available profile actions",
      notes: "Notes",
      notePlaceholder: "Add a quick note for later...",
      saveNote: "Save note",
      more: "More",
      block: "Block",
      restrictedTitle: "Profile locked for now",
      restrictedBody:
        "This person is visible in the event, but links, notes, and connection actions stay locked until they are nearby or choose to share.",
      totalConnections: (count: number) =>
        count === 1 ? "1 connection" : `${count} connections`,
      sharedEvents: (count: number) =>
        count === 1 ? "1 shared event" : `${count} shared events`,
      mutualConnectionsLabel: "Mutual connections",
      mutualConnections: (count: number) =>
        count === 1 ? "1 mutual connection" : `${count} mutual connections`,
      saved: "Connection saved",
      connect: "Connect and unlock",
    },
    common: {
      at: "at",
      keyboardDone: "Done",
      search: "Search",
      filters: "Filters",
      clear: "Clear",
      close: "Done",
      saved: "Saved",
      tags: "Tags",
      periods: "Periods",
      events: "Events",
      status: "Status",
      time: "Time",
      guests: "Guests",
      connections: "Connections",
      today: "Today",
      earlier: "Earlier",
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
      withGuests: "With guests",
      withConnections: "With connections",
    },
  },
  "pt-BR": {
    tabs: {
      home: "Inicio",
      events: "Eventos",
      notes: "Notas",
      profile: "Perfil",
    },
    visibility: {
      "1h": "1h",
      "8h": "8h",
      "24h": "24h",
      off: "Off",
    } as Record<VisibilityPreset, string>,
    onboarding: {
      auth: {
        eyebrow: "Networking presencial",
        title: "Mantenha as pessoas certas por perto mesmo depois que o evento acaba.",
        body:
          "Entre com Apple ou Google de forma mockada para ver o prototipo. O Yuno lembra quem esteve perto de voce, qual evento voces compartilharam e o que vale um follow-up.",
        appleLabel: "Continuar com Apple",
        googleLabel: "Continuar com Google",
        hint: "Autenticacao mockada para este prototipo.",
      },
      steps: [
        {
          eyebrow: "Memoria por proximidade",
          title: "Converse primeiro. Reconecte depois sem QR code no meio.",
          body:
            "Quando duas pessoas com o app passam um tempo por perto, o perfil fica salvo automaticamente e ninguem precisa cortar a conversa pedindo link.",
          points: [
            "Encontros recentes",
            "Links diretos",
            "Sem pedir de novo",
          ],
          icon: "people-outline" as const,
        },
        {
          eyebrow: "Contexto do evento",
          title: "Veja quais conexoes estao no mesmo evento.",
          body:
            "Abra um evento para ver conexoes inscritas, convidados confirmados e onde pode acontecer o melhor follow-up.",
          points: [
            "Eventos ativos",
            "Convidados",
            "Conexoes indo",
          ],
          icon: "calendar-outline" as const,
        },
        {
          eyebrow: "Notas que ajudam",
          title: "Guarde o detalhe que deixa o follow-up humano.",
          body:
            "Adicione uma nota rapida logo depois da conversa para lembrar dias depois do assunto, do momento e do motivo daquela conexao importar.",
          points: [
            "Notas rapidas",
            "Tags de evento",
            "Melhor follow-up",
          ],
          icon: "document-text-outline" as const,
        },
      ],
      continueLabel: "Continuar",
      enterLabel: "Entrar na demo",
    },
    home: {
      greeting: (name: string) => `Boa noite, ${name}`,
      title: "Encontros Recentes",
      visibleNow: "Visivel agora",
      invisibleFor: (preset: string) => `Invisivel por ${preset}`,
      mockScanActive: "Leitura mockada ativa",
      nearbyToday: (count: number) => `${count} por perto hoje`,
      heroTitle: "Recupere as pessoas que importaram, mesmo depois que o ambiente esvazia.",
      heroBody:
        "Todo encontro nesta demo e mockado, mas a sensacao do produto e real: conheca alguem pessoalmente, abra o app mais tarde e reconecte com contexto.",
      visibleProfiles: "perfis visiveis",
      privatePassBys: "passagens privadas",
      warmFollowUps: "follow-ups quentes",
      hiddenProfilesTitle: (count: number) =>
        `${count} perfis ocultos passaram por perto`,
      hiddenProfilesBody:
        "Voce sabe que alguem esteve ali, mas a identidade continua privada ate essa pessoa querer aparecer.",
      sectionTitle: "Pessoas para revisitar",
      sectionMeta: "Toque em uma linha para abrir o perfil",
      listTitle: "Pessoas que valem revisita",
      listBody:
        "So encontros reais por proximidade ficam aqui, com contexto suficiente para voce retomar a conversa depois.",
      filters: {
        all: "Todos",
        people: "Pessoas",
        passBys: "Passagens",
      },
      subtitle: "Pessoas que voce encontrou por perto nos ultimos 7 dias.",
      radarLive: "Radar ao vivo",
      presenceTitle: "Visivel por perto",
      presenceBody:
        "Desative isso e seu perfil some completamente da descoberta por proximidade ate voce ligar de novo.",
      visibleNearby: "Compartilhamento ativo",
      invisibleNearby: "Compartilhamento desligado",
      radarButton: "Radar",
      radarTitle: "Radar de proximidade",
      radarDetected: (count: number) => `${count} pessoas detectadas`,
      radarDetectedCompact: (count: number) => `${count} por perto`,
      privatePassBySummary: (count: number) => `${count} passagens privadas`,
      privatePassByBody: "Pessoas por perto que escolheram continuar privadas.",
      passBysEmptyTitle: "Passagens privadas seguem anonimas",
      passBysEmptyBody:
        "Esta visualizacao apenas confirma que houve proximidade. O perfil continua oculto ate a pessoa escolher aparecer.",
    },
    events: {
      eyebrow: "Memoria do evento",
      title: "Onde aconteceram suas melhores conversas",
      description:
        "Agrupe os encontros por evento para cada follow-up manter o contexto original.",
      radarTitle: "Radar de eventos",
      radarActive: (count: number) =>
        count === 1 ? "1 evento ativo no radar" : `${count} eventos ativos no radar`,
      eventDetails: "Detalhes do evento",
      viewEvent: "Ver evento",
      joinEvent: "Entrar no evento",
      leaveEvent: "Sair do evento",
      joinedStatus: "Participando",
      invitedGuests: (count: number) =>
        count === 1 ? "1 convidado" : `${count} convidados`,
      invitedGuestsTitle: "Convidados",
      privateGuest: "Perfil privado",
      membersOnly: "So membros por perto",
      participantsLabel: "participantes",
      connectionsGoing: "conexoes indo",
      yourConnections: "Suas conexoes neste evento",
      mayRunInto: "Pessoas que voce pode encontrar",
      hostedBy: "Organizado por",
      eventPrivacyTitle: "Visibilidade protegida dentro do evento",
      eventPrivacyBody:
        "Ao entrar em um evento, sua presenca ali fica descoberta apenas por outros membros do mesmo evento naquele lugar e periodo.",
      eventPrivacyActive:
        "Voce fica protegido de quem esta fora do evento enquanto estiver em check-in.",
      eventPrivacyInactive:
        "Entre no evento para aparecer apenas para membros durante a janela do evento.",
      status: {
        live: "Ao vivo",
        upcoming: "Proximo",
        recent: "Encerrado",
      },
      peopleSeen: "pessoas vistas",
      warmLeads: "leads quentes",
      savedInFeed: "salvos no feed",
      attendees: "Pessoas deste evento",
      attendeeCount: (count: number) => `${count} pessoas capturadas`,
      signal:
        "Funciona melhor quando os organizadores incentivam o publico a manter o app aberto.",
    },
    notes: {
      eyebrow: "Notas de memoria",
      title: "Guarde o contexto da conversa enquanto ele ainda esta fresco.",
      description:
        "Notas pequenas fazem o follow-up parecer intencional, nao aleatorio.",
      tipTitle: "Aqui esta a mecanica silenciosa de retencao.",
      tipBody:
        "As notas sao o que fazem o app continuar util tres semanas depois do evento.",
      addNote: "Adicionar nota",
      editNote: "Editar nota",
      deleteNote: "Excluir nota",
      openProfile: "Abrir perfil",
    },
    profile: {
      title: "Voce",
      description:
        "Ajuste o que as pessoas veem quando reencontram voce depois do evento.",
      activityTitle: "Atividade de networking",
      activityBody:
        "Uma visao anual de quantas pessoas voce encontrou e de quantos encontros realmente viraram conexao.",
      activityLegendQuiet: "leve",
      activityLegendDense: "forte",
      peopleFound: "pessoas encontradas",
      connectionsClosed: "conexoes mantidas",
      joinedEvents: "eventos ativos",
      bestWeek: (value: number) => `Melhor semana ${value}`,
      dayConnections: (count: number) =>
        count === 1 ? "1 conexao nesse dia" : `${count} conexoes nesse dia`,
      viewPeople: "Ver pessoas",
      connectedThatDay: "Conectados nesse dia",
      noConnectionsThatDay: "Nenhuma conexao salva nesse dia",
      memberPrivacyTitle: "Visibilidade por membros do evento",
      memberPrivacyBody:
        "Quando voce entra em um evento, sua presenca naquele lugar fica visivel apenas para outros membros desse mesmo evento.",
      edit: "Editar",
      done: "Concluir",
      cancel: "Cancelar",
      addLink: "Adicionar",
      editLink: "Salvar link",
      removeLink: "Excluir link",
      addInterest: "Adicionar interesse",
      addInterestPlaceholder: "Digite uma tag para aparecer no perfil",
      socialLinkPlaceholder: "Cole o link, email ou numero da sua rede",
      socialLinkHint:
        "O Yuno identifica a rede pelo link e ajusta a tag automaticamente.",
      changePhoto: "Trocar foto",
      changePhotoHint: "Escolha um estilo de foto para este perfil mockado.",
      editProfileTitle: "Detalhes do perfil",
      editProfileBody:
        "Deixe isso curto, claro e util logo depois de uma conversa real.",
      fullNameLabel: "Nome completo",
      roleLabel: "Cargo",
      subtitleLabel: "Subtitulo",
      companyLabel: "Empresa",
      headlineLabel: "Headline",
      publicLinksTitle: "Links publicos",
      publicLinksBody:
        "Estes sao os caminhos de contato que as pessoas esperam depois de uma boa conversa em evento.",
      linkedinLabel: "LinkedIn",
      instagramLabel: "Instagram",
      whatsappLabel: "WhatsApp",
      xLabel: "X",
      telegramLabel: "Telegram",
      emailLabel: "Email",
      interestsTitle: "Interesses",
      interestsBody: "Essas tags moldam como voce aparece na memoria por proximidade.",
      languageTitle: "Idioma",
      languageBody:
        "Troque todo o texto do produto entre ingles e portugues do Brasil.",
      recentEncounters: "encontros recentes",
      connectionsSaved: "conexoes salvas",
      invisibleMode: "Modo invisivel",
      invisibleBody:
        "Controle quando seu perfil some do historico por proximidade.",
      premiumTitle: "Privacidade premium ativa",
      premiumBody:
        "Esta mock inclui invisibilidade instantanea, visibilidade por membros de evento e historico estendido como os ganchos premium mais claros.",
      connectionsTitle: "Suas conexoes",
      eventsTitle: "Seus eventos",
    },
    encounterCard: {
      connected: "Conectado",
      openProfile: "Abrir perfil",
      followUp: {
        warm: "Quente",
        starred: "Prioridade",
        pending: "Pendente",
      },
    },
    detail: {
      remember: "O que voce vai lembrar",
      actions: "Acoes disponiveis do perfil",
      notes: "Notas",
      notePlaceholder: "Adicione uma nota rapida para depois...",
      saveNote: "Salvar nota",
      more: "Mais",
      block: "Bloquear",
      restrictedTitle: "Perfil bloqueado por enquanto",
      restrictedBody:
        "Essa pessoa aparece no evento, mas links, notas e conexao ficam bloqueados ate ela estar por perto ou escolher compartilhar.",
      totalConnections: (count: number) =>
        count === 1 ? "1 conexao" : `${count} conexoes`,
      sharedEvents: (count: number) =>
        count === 1 ? "1 evento em comum" : `${count} eventos em comum`,
      mutualConnectionsLabel: "Conexoes mutuas",
      mutualConnections: (count: number) =>
        count === 1 ? "1 conexao mutua" : `${count} conexoes mutuas`,
      saved: "Conexao salva",
      connect: "Conectar e liberar",
    },
    common: {
      at: "na",
      keyboardDone: "Fechar",
      search: "Buscar",
      filters: "Filtros",
      clear: "Limpar",
      close: "Concluir",
      saved: "Salvo",
      tags: "Tags",
      periods: "Periodos",
      events: "Eventos",
      status: "Status",
      time: "Horario",
      guests: "Convidados",
      connections: "Conexoes",
      today: "Hoje",
      earlier: "Antes",
      morning: "Manha",
      afternoon: "Tarde",
      evening: "Noite",
      withGuests: "Com convidados",
      withConnections: "Com conexoes",
    },
  },
} as const;

export type AppCopy = (typeof translations)[Language];

export function getCopy(language: Language) {
  return translations[language];
}
