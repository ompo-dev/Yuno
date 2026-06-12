import { VisibilityPreset } from "../../types";
export const ptBRCopy = {
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
  } as const;
