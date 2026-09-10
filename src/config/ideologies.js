export const IDEOLOGIES = [
  {
    id: "anarchism",
    name: "Anarquismo",
    description:
      "Descentralização do poder, autogestão e enfrentamento das estruturas do Estado.",

    initialEffects: {
      people: 5,
      congress: -10,
      economy: -5,
      stability: -10,
      corruption: 0
    },

    factionSupport: {
      military: -20,
      business: -15,
      unions: 10,
      socialMovements: 25,
      religiousGroups: -5,
      press: 5
    }
  },

  {
    id: "communism",
    name: "Comunismo",
    description:
      "Planejamento econômico, propriedade coletiva e fortalecimento dos trabalhadores.",

    initialEffects: {
      people: 5,
      congress: -10,
      economy: -5,
      stability: -5,
      corruption: 0
    },

    factionSupport: {
      military: -15,
      business: -25,
      unions: 25,
      socialMovements: 20,
      religiousGroups: -10,
      press: -5
    }
  },

  {
    id: "left",
    name: "Esquerda",
    description:
      "Redução das desigualdades, direitos sociais e fortalecimento dos serviços públicos.",

    initialEffects: {
      people: 7,
      congress: -5,
      economy: -3,
      stability: 2,
      corruption: 0
    },

    factionSupport: {
      military: -5,
      business: -10,
      unions: 20,
      socialMovements: 20,
      religiousGroups: -5,
      press: 5
    }
  },

  {
    id: "center-left",
    name: "Centro-esquerda",
    description:
      "Políticas sociais combinadas com negociação institucional e economia de mercado.",

    initialEffects: {
      people: 5,
      congress: 5,
      economy: 0,
      stability: 5,
      corruption: 0
    },

    factionSupport: {
      military: 0,
      business: 0,
      unions: 10,
      socialMovements: 10,
      religiousGroups: 0,
      press: 5
    }
  },

  {
    id: "center",
    name: "Centro",
    description:
      "Negociação, pragmatismo e tentativa de conciliar diferentes interesses.",

    initialEffects: {
      people: 0,
      congress: 10,
      economy: 0,
      stability: 5,
      corruption: 3
    },

    factionSupport: {
      military: 0,
      business: 5,
      unions: 0,
      socialMovements: -5,
      religiousGroups: 5,
      press: 5
    }
  },

  {
    id: "center-right",
    name: "Centro-direita",
    description:
      "Responsabilidade fiscal, economia de mercado e manutenção das instituições.",

    initialEffects: {
      people: -2,
      congress: 7,
      economy: 5,
      stability: 5,
      corruption: 0
    },

    factionSupport: {
      military: 5,
      business: 15,
      unions: -10,
      socialMovements: -10,
      religiousGroups: 5,
      press: 5
    }
  },

  {
    id: "right",
    name: "Direita",
    description:
      "Conservadorismo, livre mercado, segurança e redução da atuação estatal.",

    initialEffects: {
      people: -3,
      congress: 3,
      economy: 7,
      stability: 0,
      corruption: 0
    },

    factionSupport: {
      military: 15,
      business: 20,
      unions: -20,
      socialMovements: -20,
      religiousGroups: 15,
      press: -5
    }
  },

  {
    id: "bolsonarism",
    name: "Bolsonarismo",
    description:
      "Personalismo, conservadorismo, mobilização permanente e confronto institucional.",

    initialEffects: {
      people: 5,
      congress: 5,
      economy: 0,
      stability: -10,
      corruption: 10
    },

    factionSupport: {
      military: 25,
      business: 10,
      unions: -25,
      socialMovements: -25,
      religiousGroups: 20,
      press: -15
    }
  }
];