export const PRESIDENTIAL_SHOP_ITEMS = [
  {
    id: "popular-watch",
    category: "fashion",

    icon: "⌚",
    name: "Relógio do povão",

    description:
      "Resistente à água, às crises institucionais e a três mandatos.",

    price: 350,
    repeatable: false,

    image: {
      humility: 3,
      ostentation: 0,
      scrutiny: 0
    },

    effects: {
      indicators: {
        people: 1
      }
    },

    purchaseMessage:
      "A imprensa elogiou a simplicidade presidencial."
  },

  {
    id: "national-suit",
    category: "fashion",

    icon: "🤵",
    name: "Terno nacional",

    description:
      "Produzido por alfaiates brasileiros e aprovado pelo cerimonial do Planalto.",

    price: 4500,
    repeatable: false,

    image: {
      humility: 1,
      ostentation: 2,
      scrutiny: 0
    },

    effects: {
      indicators: {
        congress: 1
      },

      factions: {
        business: 1,
        unions: 1
      }
    },

    purchaseMessage:
      "O presidente agora parece preparado até quando não sabe o que está acontecendo."
  },

  {
    id: "used-popular-car",
    category: "vehicle",

    icon: "🚗",
    name: "Carro popular usado",

    description:
      "Completo: direção, quatro pneus e adesivo da última campanha eleitoral.",

    price: 55000,
    repeatable: false,

    image: {
      humility: 6,
      ostentation: -2,
      scrutiny: 1
    },

    effects: {
      indicators: {
        people: 3,
        stability: 1
      }
    },

    purchaseMessage:
      "O presidente foi fotografado dirigindo um carro popular. A embreagem não sobreviveu."
  },

  {
    id: "presidential-library",
    category: "culture",

    icon: "📚",
    name: "Biblioteca presidencial",

    description:
      "Quinhentos livros cuidadosamente organizados para nunca serem abertos.",

    price: 25000,
    repeatable: false,

    image: {
      humility: 2,
      ostentation: 1,
      scrutiny: 0
    },

    effects: {
      indicators: {
        people: 1,
        congress: 1
      },

      country: {
        publicServices: 1
      }
    },

    purchaseMessage:
      "A biblioteca foi inaugurada. O presidente prometeu começar pelos resumos."
  },

  {
    id: "patriotic-jet-ski",
    category: "leisure",

    icon: "🌊",
    name: "Jet ski patriótico",

    description:
      "Pintado com as cores nacionais e equipado para fugir de perguntas difíceis.",

    price: 120000,
    repeatable: false,

    image: {
      humility: -4,
      ostentation: 8,
      scrutiny: 5
    },

    effects: {
      indicators: {
        people: -1,
        stability: -1
      },

      politics: {
        personalism: 3
      }
    },

    purchaseMessage:
      "O passeio presidencial virou notícia. A crise continuou trabalhando normalmente."
  },

  {
    id: "swiss-watch",
    category: "luxury",

    icon: "💎",
    name: "Relógio suíço",

    description:
      "Tão preciso que informa exatamente a hora em que uma CPI será instalada.",

    price: 180000,
    repeatable: false,

    image: {
      humility: -10,
      ostentation: 14,
      scrutiny: 12
    },

    effects: {
      indicators: {
        people: -3,
        congress: 2
      },

      factions: {
        business: 3,
        press: -2
      },

      politics: {
        personalism: 4
      }
    },

    purchaseMessage:
      "O novo relógio chamou atenção. A assessoria afirmou que ele estava em promoção."
  },

  {
    id: "armored-suv",
    category: "vehicle",

    icon: "🚙",
    name: "SUV presidencial blindada",

    description:
      "Blindagem reforçada contra tiros, protestos e pesquisas de popularidade.",

    price: 700000,
    repeatable: false,

    image: {
      humility: -12,
      ostentation: 18,
      scrutiny: 14
    },

    effects: {
      indicators: {
        people: -4,
        stability: 4
      },

      factions: {
        military: 3,
        business: 2
      },

      politics: {
        personalism: 5
      }
    },

    purchaseMessage:
      "O presidente agora está protegido da população e, principalmente, das perguntas dela."
  },

  {
    id: "luxury-mansion",
    category: "property",

    icon: "🏛️",
    name: "Mansão presidencial particular",

    description:
      "Doze quartos, piscina aquecida e uma escritura capaz de causar três investigações.",

    price: 8000000,
    repeatable: false,

    image: {
      humility: -30,
      ostentation: 40,
      scrutiny: 35
    },

    effects: {
      indicators: {
        people: -8,
        congress: 3
      },

      factions: {
        business: 5,
        press: -8
      },

      politics: {
        personalism: 10
      }
    },

    purchaseMessage:
      "A mansão apareceu na declaração patrimonial. A origem do dinheiro ainda está procurando estacionamento."
  },

  {
    id: "borrowed-country-house",
    category: "suspicious",

    icon: "🌳",
    name: "Sítio de um amigo",

    description:
      "Você não comprou, não alugou e não sabe por que suas iniciais estão nas toalhas.",

    price: 0,
    repeatable: false,

    requirements: {
      minimumCorruption: 20
    },

    image: {
      humility: -5,
      ostentation: 8,
      scrutiny: 28
    },

    effects: {
      indicators: {
        people: -3,
        stability: -2
      },

      corruption: 12,

      politics: {
        personalism: 6
      }
    },

    purchaseMessage:
      "O presidente passou o fim de semana no sítio que definitivamente não é dele."
  },

  {
    id: "businessman-helicopter",
    category: "suspicious",

    icon: "🚁",
    name: "Helicóptero emprestado",

    description:
      "Um empresário ofereceu transporte gratuito sem absolutamente nenhum interesse futuro.",

    price: 0,
    repeatable: false,

    requirements: {
      minimumCorruption: 35
    },

    image: {
      humility: -12,
      ostentation: 22,
      scrutiny: 30
    },

    effects: {
      indicators: {
        congress: 3,
        people: -4
      },

      factions: {
        business: 8,
        press: -6
      },

      corruption: 15,

      politics: {
        personalism: 8
      }
    },

    purchaseMessage:
      "O empresário garantiu que o empréstimo não exigia contrapartida. Depois entregou uma lista de contratos."
  }
];

export const SHOP_CATEGORIES = {
  fashion: {
    icon: "👔",
    label: "Moda"
  },

  vehicle: {
    icon: "🚗",
    label: "Veículos"
  },

  culture: {
    icon: "📚",
    label: "Cultura"
  },

  leisure: {
    icon: "🌊",
    label: "Lazer"
  },

  luxury: {
    icon: "💎",
    label: "Luxo"
  },

  property: {
    icon: "🏛️",
    label: "Imóveis"
  },

  suspicious: {
    icon: "🤝",
    label: "Oportunidades"
  }
};