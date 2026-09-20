function numberOrZero(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

export const ACHIEVEMENTS = [
  {
    id: "clean-hands",
    icon: "🧼",
    name: "Mãos Limpas",

    description:
      "Chegue a dez decisões mantendo a corrupção abaixo de 10.",

    secretDescription:
      "Continue governando para descobrir.",

    condition(gameState) {
      const decisions =
        numberOrZero(
          gameState.government
            ?.decisionsTaken
        );

      const corruption =
        numberOrZero(
          gameState.corruption
        );

      return (
        decisions >= 10 &&
        corruption < 10
      );
    }
  },

  {
    id: "rouba-mas-investe",

    icon: "💼",
    name: "Empreendedor Público",

    description:
      "Acumule mais de R$ 2 milhões com corrupção acima de 50.",

    secretDescription:
      "Continue movimentando a economia pessoal.",

    condition(gameState) {
      const wealth =
        numberOrZero(
          gameState.player
            ?.personalWealth
        );

      const corruption =
        numberOrZero(
          gameState.corruption
        );

      return (
        wealth >= 2000000 &&
        corruption >= 50
      );
    }
  },

  {
    id: "humble-helicopter",

    icon: "🚁",
    name: "Humilde de Helicóptero",

    description:
      "Alcance 30 pontos de ostentação.",

    secretDescription:
      "Compre algumas coisinhas no Shopping Presidencial.",

    condition(gameState) {
      return (
        numberOrZero(
          gameState.player
            ?.image
            ?.ostentation
        ) >= 30
      );
    }
  },

  {
    id: "popular-leader",

    icon: "❤️",
    name: "Pai dos Pobres Premium",

    description:
      "Alcance 99 pontos de apoio popular.",

    secretDescription:
      "Faça o povo amar você.",

    condition(gameState) {
      return (
        numberOrZero(
          gameState.indicators
            ?.people
        ) >= 99
      );
    }
  },

  {
    id: "market-darling",

    icon: "📈",
    name: "O Mercado Sorriu",

    description:
      "Alcance 90 pontos de economia.",

    secretDescription:
      "Faça alguma coisa que anime o mercado.",

    condition(gameState) {
      return (
        numberOrZero(
          gameState.indicators
            ?.economy
        ) >= 90
      );
    }
  },

  {
    id: "congress-owner",

    icon: "🏛️",
    name: "Dono do Congresso",

    description:
      "Alcance 90 pontos de apoio no Congresso.",

    secretDescription:
      "Conquiste a confiança dos parlamentares ou compre-a.",

    condition(gameState) {
      return (
        numberOrZero(
          gameState.indicators
            ?.congress
        ) >= 90
      );
    }
  },

  {
    id: "enemy-of-rival",

    icon: "🥊",
    name: "Inimigo do Zap",

    description:
      "Descubra dois escândalos do seu adversário.",

    secretDescription:
      "Investigue quem investiga você.",

    condition(gameState) {
      return (
        numberOrZero(
          gameState.government
            ?.politicalRival
            ?.scandals
        ) >= 2
      );
    }
  },

  {
    id: "tigrinho-survivor",

    icon: "🐯",
    name: "Deu Green",

    description:
      "Saia do Tigrinho com patrimônio pessoal.",

    secretDescription:
      "Confie no felino.",

    condition(gameState) {
      const usedDecisions =
        gameState.usedDecisionIds ??
        [];

      const wealth =
        numberOrZero(
          gameState.player
            ?.personalWealth
        );

      return (
        usedDecisions.includes(
          "tigrinho"
        ) &&
        wealth > 0
      );
    }
  },

  {
    id: "flag-artist",

    icon: "🎨",
    name: "Design Pátrio",

    description:
      "Crie uma nova bandeira nacional.",

    secretDescription:
      "O país precisa de uma identidade visual.",

    condition(gameState) {
      return Boolean(
        gameState.country?.flag
      );
    }
  },

  {
    id: "survived-brazil",

    icon: "🫡",
    name: "Sobreviveu ao Brasil",

    description:
      "Complete vinte decisões sem perder o governo.",

    secretDescription:
      "Continue no cargo tempo suficiente.",

    condition(gameState) {
      return (
        numberOrZero(
          gameState.government
            ?.decisionsTaken
        ) >= 20
      );
    }
  }
];