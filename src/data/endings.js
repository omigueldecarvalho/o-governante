export const ENDINGS = {
  popularRevolt: {
    id: "popular-revolt",
    icon: "🔥",
    title: "A revolta começou",

    description:
      "Sem apoio popular, seu governo perdeu o controle das ruas. Manifestantes ocuparam o palácio e exigiram sua saída.",

    sharePhrase:
      "Prometeu governar para o povo. O povo respondeu pessoalmente.",

    tone: "defeat"
  },

  impeachment: {
    id: "impeachment",
    icon: "🏛️",
    title: "Seu governo foi derrubado",

    description:
      "Sem apoio no Congresso, o processo de impeachment avançou rapidamente. Seu mandato chegou ao fim.",

    sharePhrase:
      "Perdeu o Congresso, o cargo e provavelmente alguns amigos.",

    tone: "defeat"
  },

  economicCollapse: {
    id: "economic-collapse",
    icon: "📉",
    title: "A economia entrou em colapso",

    description:
      "Empresas fecharam, o desemprego disparou e seu governo perdeu qualquer capacidade de reação.",

    sharePhrase:
      "O plano econômico funcionou perfeitamente, desde que o objetivo fosse destruir a economia.",

    tone: "defeat"
  },

  institutionalRupture: {
    id: "institutional-rupture",
    icon: "⚔️",
    title: "As instituições não resistiram",

    description:
      "O conflito político destruiu a estabilidade do país e encerrou seu governo de maneira abrupta.",

    sharePhrase:
      "As instituições funcionaram até o momento em que deixaram de funcionar.",

    tone: "defeat"
  },

  corruptionPrison: {
    id: "corruption-prison",
    icon: "🚔",
    title: "O esquema foi descoberto",

    description:
      "Investigações revelaram um amplo esquema de corrupção. Seu patrimônio foi bloqueado e você acabou preso.",

    sharePhrase:
      "Entrou para a história, para os jornais e para o sistema penitenciário.",

    tone: "defeat"
  },

  foreignOccupation: {
    id: "foreign-occupation",
    icon: "🏴",
    title: "O país foi ocupado",

    description:
      "As forças invasoras tomaram os centros de poder. Seu governo terminou junto com a soberania nacional.",

    sharePhrase:
      "Perdeu a guerra, o governo e parte do território nacional.",

    tone: "defeat"
  },

  suspiciousAccident: {
    id: "suspicious-accident",
    icon: "🚘",
    title: "Acidente suspeito",

    description:
      "O comboio presidencial sofreu um acidente fatal. Investigações, versões oficiais e teorias conflitantes atravessaram gerações.",

    sharePhrase:
      "A versão oficial possui menos estabilidade que o veículo presidencial.",

    tone: "defeat"
  },

  initialElectionDefeat: {
    id: "initial-election-defeat",
    icon: "🗳️",
    title: "O povo escolheu outro",

    description:
      "Sua campanha terminou em derrota. Você ainda exigiu uma recontagem, mas até sua equipe reconheceu o resultado.",

    sharePhrase:
      "Prometeu mudar o país, mas não passou da urna.",

    tone: "defeat"
  },

  midtermElectionDefeat: {
    id: "midterm-election-defeat",
    icon: "📦",
    title: "Mudança no Palácio",

    description:
      "A população antecipou o fim do seu governo. Seus pertences foram colocados em caixas antes mesmo do encerramento da apuração.",

    sharePhrase:
      "O povo decidiu que quatro anos já pareciam oito.",

    tone: "defeat"
  },

  dictatorship: {
    id: "dictatorship",
    icon: "🦅",
    title: "A democracia saiu de férias",

    description:
      "Seu governo concentrou poder, enfraqueceu os demais poderes e transformou medidas excepcionais em regras permanentes. As eleições continuam existindo, mas o resultado ficou previsível.",

    sharePhrase:
      "Conquistou estabilidade eliminando tudo que poderia discordar.",

    tone: "authoritarian"
  },

  anarchistCommune: {
    id: "anarchist-commune",
    icon: "🏴",
    title: "O governo aboliu o governo",

    description:
      "O poder foi descentralizado entre conselhos, comunidades e organizações populares. O antigo palácio virou biblioteca, assembleia e espaço cultural.",

    sharePhrase:
      "Chegou ao poder e utilizou o cargo para acabar com o próprio cargo.",

    tone: "revolution"
  },

  socialistRevolution: {
    id: "socialist-revolution",
    icon: "🚩",
    title: "A revolução venceu nas urnas",

    description:
      "Seu governo ampliou a participação popular, reduziu desigualdades e transferiu poder econômico para trabalhadores e organizações sociais.",

    sharePhrase:
      "Mudou o sistema sem esquecer de preencher todos os formulários do Congresso.",

    tone: "revolution"
  },

  kleptocracy: {
    id: "kleptocracy",
    icon: "💎",
    title: "O país empobreceu, você não",

    description:
      "Seu governo terminou cercado de suspeitas, propriedades, contas e presentes incompatíveis com a renda presidencial. Você deixou o cargo milionário e com excelentes advogados.",

    sharePhrase:
      "O país ficou com o legado. Você ficou com o patrimônio.",

    tone: "corruption"
  },

  economicMiracle: {
    id: "economic-miracle",
    icon: "📈",
    title: "O milagre econômico",

    description:
      "A economia encerrou seu governo em alta. Empresas cresceram, empregos surgiram e até os especialistas tiveram dificuldade para reclamar.",

    sharePhrase:
      "Fez a economia crescer e deixou o mercado temporariamente sem motivos para entrar em pânico.",

    tone: "victory"
  },

  popularLegacy: {
    id: "popular-legacy",
    icon: "❤️",
    title: "Nos braços do povo",

    description:
      "Você deixou o governo com uma popularidade histórica. Apoiadores ocuparam as ruas e aliados começaram a disputar quem sempre esteve ao seu lado.",

    sharePhrase:
      "Saiu do palácio diretamente para os livros, camisetas e nomes de avenida.",

    tone: "victory"
  },

  democraticLegacy: {
    id: "democratic-legacy",
    icon: "🕊️",
    title: "A democracia sobreviveu",

    description:
      "Seu governo terminou com apoio social, instituições estáveis e transição democrática. Parece pouco, mas para este país já foi um acontecimento histórico.",

    sharePhrase:
      "Governou, entregou o cargo e ninguém precisou invadir nenhum prédio.",

    tone: "victory"
  },

  mandateCompleted: {
    id: "mandate-completed",
    icon: "🎖️",
    title: "Você concluiu o mandato",

    description:
      "Depois de crises, acordos e decisões difíceis, seu governo chegou ao fim. O país sobreviveu e os historiadores agora terão trabalho.",

    sharePhrase:
      "Não salvou completamente o país, mas também não o destruiu completamente.",

    tone: "neutral"
  },

  prototypeCompleted: {
    id: "prototype-completed",
    icon: "🧪",
    title: "Protótipo concluído",

    description:
      "Você tomou todas as decisões disponíveis nesta versão de O Governante.",

    sharePhrase:
      "Governou até o jogo ficar sem decisões.",

    tone: "neutral"
  }
};