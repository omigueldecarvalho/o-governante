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
  },
    {
    id: "banker-private-jet-trip",
    category: "suspicious",

    icon: "🛩️",
    name: "Diária no jatinho do banqueiro",

    description:
      "Voo, jantar e hospedagem oferecidos por um banqueiro investigado. Segundo a assessoria, foi apenas uma carona republicana.",

    price: 0,
    repeatable: false,

    requirements: {
      minimumCorruption: 15
    },

    image: {
      humility: -8,
      ostentation: 16,
      scrutiny: 28
    },

    effects: {
      indicators: {
        people: -3,
        congress: 3,
        economy: 2,
        stability: -2
      },

      factions: {
        business: 8,
        press: -6
      },

      politics: {
        personalism: 5
      },

      corruption: 18
    },

    purchaseMessage:
      "O banqueiro garantiu que não pediu nada em troca. Curiosamente, trouxe uma minuta de decreto na bagagem."
  },

  {
    id: "presidential-country-estate",
    category: "property",

    icon: "🌾",
    name: "Sítio presidencial",

    description:
      "Piscina, lago, churrasqueira e espaço suficiente para guardar documentos que definitivamente não existem.",

    price: 18000000,
    repeatable: false,

    image: {
      humility: -15,
      ostentation: 24,
      scrutiny: 30
    },

    effects: {
      indicators: {
        people: -5,
        congress: 2,
        economy: 1,
        stability: -2
      },

      factions: {
        business: 3,
        press: -7
      },

      politics: {
        personalism: 7
      },

      corruption: 8
    },

    purchaseMessage:
      "O presidente comprou um sítio. A escritura está correta, mas ninguém consegue explicar os dez anexos reformados por empresários."
  },

  {
    id: "mysterious-private-island",
    category: "property",

    icon: "🏝️",
    name: "Ilha particular misteriosa",

    description:
      "Um refúgio exclusivo onde ministros não entram, jornalistas não desembarcam e o sinal de celular desaparece convenientemente.",

    price: 120000000,
    repeatable: false,

    image: {
      humility: -40,
      ostentation: 55,
      scrutiny: 50
    },

    effects: {
      indicators: {
        people: -10,
        congress: 4,
        economy: -4,
        stability: -5
      },

      factions: {
        business: 10,
        press: -12,
        military: 2
      },

      politics: {
        personalism: 14
      },

      corruption: 18
    },

    purchaseMessage:
      "A ilha foi comprada por uma empresa que pertence a outra empresa que pertence a alguém que ninguém conhece."
  },

  {
    id: "blue-beetle",
    category: "vehicle",

    icon: "🚙",
    name: "Fusca azul presidencial",

    description:
      "Um carro simples, econômico e sem blindagem. Inspirado em presidentes que ainda lembravam o preço do combustível.",

    price: 28000,
    repeatable: false,

    image: {
      humility: 15,
      ostentation: -8,
      scrutiny: -3
    },

    effects: {
      indicators: {
        people: 7,
        economy: 1,
        stability: 1
      },

      factions: {
        business: -1,
        unions: 3,
        socialMovements: 2,
        press: 3
      },

      politics: {
        personalism: -3
      },

      corruption: -2
    },

    purchaseMessage:
      "O presidente apareceu dirigindo um Fusca azul. Pela primeira vez, o patrimônio declarado pareceu compatível com o salário."
  },

  {
    id: "national-football-club",
    category: "empire",

    icon: "⚽",
    name: "Comprar um clube de futebol",

    description:
      "Torcida apaixonada, dívidas históricas e uma diretoria que faz a política nacional parecer organizada.",

    price: 250000000,
    repeatable: false,

    image: {
      humility: -25,
      ostentation: 48,
      scrutiny: 42
    },

    effects: {
      indicators: {
        people: 12,
        congress: 3,
        economy: -6,
        stability: 2
      },

      factions: {
        business: 10,
        unions: 2,
        press: 6
      },

      politics: {
        personalism: 15
      },

      corruption: 12
    },

    purchaseMessage:
      "O presidente comprou um clube. A torcida comemorou até descobrir que o ministro da Economia será o novo centroavante."
  },

  {
    id: "diplomatic-jewelry-gift",
    category: "suspicious",

    icon: "💍",
    name: "Kit de joias diplomático",

    description:
      "Um presente de outro governo. É do presidente, da Presidência ou do museu? A resposta muda conforme o advogado.",

    price: 0,
    repeatable: false,

    requirements: {
      minimumCorruption: 20
    },

    image: {
      humility: -18,
      ostentation: 30,
      scrutiny: 40
    },

    effects: {
      indicators: {
        people: -7,
        congress: 2,
        stability: -3
      },

      factions: {
        religiousGroups: 1,
        press: -10
      },

      politics: {
        personalism: 9
      },

      corruption: 20
    },

    purchaseMessage:
      "As joias entraram no país. A explicação ficou retida na alfândega."
  },

  {
    id: "cash-bought-penthouse",
    category: "property",

    icon: "🏢",
    name: "Cobertura em dinheiro vivo",

    description:
      "Vista panorâmica, elevador privativo e pagamento dividido em tantas parcelas físicas que a calculadora pediu demissão.",

    price: 14500000,
    repeatable: false,

    image: {
      humility: -20,
      ostentation: 32,
      scrutiny: 45
    },

    effects: {
      indicators: {
        people: -7,
        congress: 2,
        economy: 1,
        stability: -3
      },

      factions: {
        business: 5,
        press: -9
      },

      politics: {
        personalism: 8
      },

      corruption: 14
    },

    purchaseMessage:
      "A cobertura foi declarada. A origem das cédulas continua subindo pelas escadas."
  },

  {
    id: "presidential-cattle-ranch",
    category: "property",

    icon: "🐂",
    name: "Fazenda presidencial",

    description:
      "Milhares de hectares, criação de gado e uma cerca que parece avançar alguns metros toda madrugada.",

    price: 42000000,
    repeatable: false,

    image: {
      humility: -14,
      ostentation: 30,
      scrutiny: 30
    },

    effects: {
      indicators: {
        people: -4,
        congress: 5,
        economy: 5,
        stability: 1
      },

      factions: {
        business: 10,
        unions: -4,
        socialMovements: -7
      },

      country: {
        environment: -8,
        inequality: 3
      },

      politics: {
        economicPosition: 5,
        personalism: 6
      },

      corruption: 7
    },

    purchaseMessage:
      "A bancada do agro elogiou o investimento. O satélite ambiental também viu, mas não gostou."
  },

  {
    id: "presidential-yacht",
    category: "luxury",

    icon: "🛥️",
    name: "Iate da governabilidade",

    description:
      "Possui suíte presidencial, salão de reuniões e bote salva-vidas para abandonar aliados durante uma CPI.",

    price: 55000000,
    repeatable: false,

    image: {
      humility: -35,
      ostentation: 52,
      scrutiny: 38
    },

    effects: {
      indicators: {
        people: -9,
        congress: 4,
        economy: -3,
        stability: -2
      },

      factions: {
        business: 8,
        press: -7
      },

      politics: {
        personalism: 12
      },

      corruption: 9
    },

    purchaseMessage:
      "O iate foi lançado ao mar. A popularidade presidencial afundou no mesmo instante."
  },

  {
    id: "executive-private-jet",
    category: "vehicle",

    icon: "✈️",
    name: "Jato executivo particular",

    description:
      "Para compromissos urgentes, férias discretas e viagens oficiais que misteriosamente terminam em paraísos fiscais.",

    price: 95000000,
    repeatable: false,

    image: {
      humility: -40,
      ostentation: 60,
      scrutiny: 45
    },

    effects: {
      indicators: {
        people: -10,
        congress: 4,
        economy: -4,
        stability: 2
      },

      factions: {
        business: 12,
        press: -10
      },

      country: {
        environment: -5
      },

      politics: {
        personalism: 14
      },

      corruption: 12
    },

    purchaseMessage:
      "O jato decolou. A assessoria ainda tenta descobrir se a viagem era oficial, particular ou oficialmente particular."
  },

  {
    id: "questionable-art-collection",
    category: "culture",

    icon: "🖼️",
    name: "Coleção de arte inexplicável",

    description:
      "Quadros caríssimos comprados de artistas que ninguém conhece e avaliados por especialistas que ninguém encontrou.",

    price: 12500000,
    repeatable: false,

    image: {
      humility: -15,
      ostentation: 28,
      scrutiny: 32
    },

    effects: {
      indicators: {
        people: -3,
        economy: 1
      },

      factions: {
        business: 4,
        press: -5
      },

      country: {
        publicServices: 1
      },

      politics: {
        personalism: 4
      },

      corruption: 10
    },

    purchaseMessage:
      "A coleção foi exibida. O quadro mais valioso se chama 'Lavagem sobre tela'."
  },

  {
    id: "presidential-bunker",
    category: "luxury",

    icon: "🛡️",
    name: "Bunker presidencial particular",

    description:
      "Proteção contra guerra, revolta popular, jornalistas e familiares pedindo cargo no governo.",

    price: 38000000,
    repeatable: false,

    image: {
      humility: -18,
      ostentation: 28,
      scrutiny: 22
    },

    effects: {
      indicators: {
        people: -6,
        congress: -2,
        economy: -3,
        stability: 10
      },

      factions: {
        military: 10,
        business: 3,
        socialMovements: -6
      },

      politics: {
        authoritarianism: 8,
        personalism: 10
      },

      corruption: 5
    },

    purchaseMessage:
      "O bunker ficou pronto. O presidente declarou que é apenas uma salinha para momentos democráticos difíceis."
  },

  {
    id: "communication-conglomerate",
    category: "empire",

    icon: "📺",
    name: "Grupo de comunicação",

    description:
      "Televisão, rádio, jornal e portal de notícias unidos pela independência editorial de elogiar o proprietário.",

    price: 180000000,
    repeatable: false,

    image: {
      humility: -30,
      ostentation: 48,
      scrutiny: 50
    },

    effects: {
      indicators: {
        people: 5,
        congress: 8,
        economy: -5,
        stability: 4
      },

      factions: {
        business: 12,
        press: 15,
        socialMovements: -8
      },

      politics: {
        authoritarianism: 8,
        personalism: 18
      },

      corruption: 14
    },

    purchaseMessage:
      "O jornal garantiu independência editorial em um editorial escrito pessoalmente pelo presidente."
  },

  {
    id: "beachfront-resort",
    category: "empire",

    icon: "🏨",
    name: "Resort à beira-mar",

    description:
      "Um investimento totalmente privado, exceto pela estrada, pelo aeroporto e pelo financiamento público.",

    price: 68000000,
    repeatable: false,

    image: {
      humility: -28,
      ostentation: 44,
      scrutiny: 35
    },

    effects: {
      indicators: {
        people: -5,
        congress: 3,
        economy: 7,
        stability: 1
      },

      factions: {
        business: 12,
        unions: 2,
        press: -5
      },

      country: {
        environment: -7,
        inequality: 3
      },

      politics: {
        economicPosition: 4,
        personalism: 7
      },

      corruption: 8
    },

    purchaseMessage:
      "O resort foi inaugurado com recursos privados cuidadosamente escoltados por dinheiro público."
  },

  {
    id: "offshore-wealth-consultancy",
    category: "suspicious",

    icon: "🌐",
    name: "Consultoria patrimonial offshore",

    description:
      "Especialistas internacionais reorganizam seu dinheiro até ele perder completamente a nacionalidade.",

    price: 2500000,
    repeatable: false,

    requirements: {
      minimumCorruption: 30
    },

    image: {
      humility: -10,
      ostentation: 10,
      scrutiny: 45
    },

    effects: {
      indicators: {
        people: -5,
        congress: 3,
        economy: 2,
        stability: -3
      },

      factions: {
        business: 8,
        press: -8
      },

      politics: {
        personalism: 6
      },

      corruption: 22
    },

    purchaseMessage:
      "O dinheiro foi reorganizado com sucesso. Agora nem ele sabe onde está."
  },

  {
    id: "historic-luxury-palace",
    category: "property",

    icon: "🏰",
    name: "Palacete histórico",

    description:
      "Patrimônio arquitetônico restaurado com dinheiro suficiente para construir seis escolas e meia.",

    price: 85000000,
    repeatable: false,

    image: {
      humility: -35,
      ostentation: 58,
      scrutiny: 40
    },

    effects: {
      indicators: {
        people: -9,
        congress: 5,
        economy: -3,
        stability: 2
      },

      factions: {
        business: 8,
        press: -7,
        religiousGroups: 2
      },

      country: {
        inequality: 5,
        publicServices: -3
      },

      politics: {
        personalism: 13
      },

      corruption: 10
    },

    purchaseMessage:
      "O palacete foi restaurado. As seis escolas continuam aguardando uma tinta menos histórica."
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
  },

  empire: {
    icon: "👑",
    label: "Império"
  }
};