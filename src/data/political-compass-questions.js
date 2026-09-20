export const POLITICAL_COMPASS_QUESTIONS = [
  {
    id: "tax-rich",

    title:
      "Os muito ricos devem pagar mais impostos?",

    description:
      "O governo precisa aumentar sua arrecadação para financiar serviços públicos.",

    answers: [
      {
        id: "tax-more",
        text:
          "Sim. Quem possui mais deve contribuir mais.",

        effects: {
          economicPosition: -3,
          popularParticipation: 1
        }
      },

      {
        id: "moderate-tax",
        text:
          "Sim, mas sem assustar os investidores.",

        effects: {
          economicPosition: -1,
          personalism: -1
        }
      },

      {
        id: "keep-taxes",
        text:
          "Não. Os impostos atuais já são suficientes.",

        effects: {
          economicPosition: 2
        }
      },

      {
        id: "remove-taxes",
        text:
          "Não. O Estado deveria cobrar muito menos de todos.",

        effects: {
          economicPosition: 4
        }
      }
    ]
  },

  {
    id: "public-company",

    title:
      "Uma grande empresa pública está dando prejuízo. O que fazer?",

    description:
      "A empresa emprega milhares de pessoas e presta um serviço considerado importante.",

    answers: [
      {
        id: "privatize",
        text:
          "Vender imediatamente para uma empresa privada.",

        effects: {
          economicPosition: 4
        }
      },

      {
        id: "restructure",
        text:
          "Manter pública, mas trocar a administração.",

        effects: {
          economicPosition: -1,
          personalism: -1
        }
      },

      {
        id: "workers-control",
        text:
          "Entregar a administração aos trabalhadores.",

        effects: {
          economicPosition: -4,
          popularParticipation: 4
        }
      },

      {
        id: "president-controls",
        text:
          "Colocar alguém de confiança do presidente no comando.",

        effects: {
          personalism: 4,
          authoritarianism: 1
        }
      }
    ]
  },

  {
    id: "workweek",

    title:
      "O que deveria acontecer com a escala de trabalho 6x1?",

    description:
      "Empresários alertam para possíveis custos. Trabalhadores reclamam da falta de descanso.",

    answers: [
      {
        id: "end-workweek",
        text:
          "Deve acabar, mesmo que algumas empresas reclamem.",

        effects: {
          economicPosition: -4,
          popularParticipation: 2
        }
      },

      {
        id: "gradual-reduction",
        text:
          "Deve ser reduzida aos poucos e com negociação.",

        effects: {
          economicPosition: -2
        }
      },

      {
        id: "company-choice",
        text:
          "Cada empresa deve escolher sua própria escala.",

        effects: {
          economicPosition: 3
        }
      },

      {
        id: "keep-workweek",
        text:
          "Deve continuar como está para proteger a economia.",

        effects: {
          economicPosition: 4,
          socialPosition: 1
        }
      }
    ]
  },

  {
    id: "religion-government",

    title:
      "A religião deve influenciar as decisões do governo?",

    description:
      "Líderes religiosos defendem que seus valores orientem novas leis.",

    answers: [
      {
        id: "secular-state",
        text:
          "Não. Religião e governo devem permanecer separados.",

        effects: {
          socialPosition: -4,
          authoritarianism: -1
        }
      },

      {
        id: "listen-religions",
        text:
          "O governo pode ouvir religiões, mas não deve favorecê-las.",

        effects: {
          socialPosition: -1,
          popularParticipation: 1
        }
      },

      {
        id: "religious-values",
        text:
          "As leis devem respeitar os valores religiosos da maioria.",

        effects: {
          socialPosition: 3
        }
      },

      {
        id: "religious-government",
        text:
          "O país deveria ser governado com base na religião.",

        effects: {
          socialPosition: 4,
          authoritarianism: 4
        }
      }
    ]
  },

  {
    id: "personal-freedom",

    title:
      "O governo deve controlar escolhas pessoais?",

    description:
      "O debate envolve costumes, relacionamentos, drogas e comportamento individual.",

    answers: [
      {
        id: "maximum-freedom",
        text:
          "Não. Cada adulto deve cuidar da própria vida.",

        effects: {
          socialPosition: -4,
          authoritarianism: -4
        }
      },

      {
        id: "freedom-with-limits",
        text:
          "Somente quando houver risco claro para outras pessoas.",

        effects: {
          socialPosition: -2,
          authoritarianism: -2
        }
      },

      {
        id: "traditional-values",
        text:
          "O governo deve proteger os valores tradicionais.",

        effects: {
          socialPosition: 3,
          authoritarianism: 2
        }
      },

      {
        id: "strict-control",
        text:
          "Comportamentos considerados imorais devem ser proibidos.",

        effects: {
          socialPosition: 4,
          authoritarianism: 4
        }
      }
    ]
  },

  {
    id: "national-protest",

    title:
      "Manifestantes bloquearam as principais avenidas. O que fazer?",

    description:
      "O protesto é pacífico, mas está causando trânsito e prejuízos econômicos.",

    answers: [
      {
        id: "negotiate-protest",
        text:
          "Negociar e garantir o direito à manifestação.",

        effects: {
          authoritarianism: -3,
          popularParticipation: 3
        }
      },

      {
        id: "set-deadline",
        text:
          "Dar um prazo para liberarem as avenidas.",

        effects: {
          authoritarianism: 1
        }
      },

      {
        id: "remove-protesters",
        text:
          "Mandar a polícia retirar os manifestantes.",

        effects: {
          authoritarianism: 3,
          popularParticipation: -2
        }
      },

      {
        id: "arrest-leaders",
        text:
          "Prender os líderes e proibir novos protestos.",

        effects: {
          authoritarianism: 5,
          popularParticipation: -4
        }
      }
    ]
  },

  {
    id: "presidential-criticism",

    title:
      "Um humorista fez uma piada pesada com o presidente.",

    description:
      "A piada viralizou e deixou apoiadores do governo indignados.",

    answers: [
      {
        id: "accept-criticism",
        text:
          "Faz parte. Presidente também precisa aguentar piada.",

        effects: {
          authoritarianism: -4,
          personalism: -3
        }
      },

      {
        id: "public-response",
        text:
          "Responder publicamente, mas sem usar o Estado.",

        effects: {
          authoritarianism: -1,
          personalism: 1
        }
      },

      {
        id: "investigate-comedian",
        text:
          "Mandar investigar possíveis crimes do humorista.",

        effects: {
          authoritarianism: 3,
          personalism: 3
        }
      },

      {
        id: "ban-content",
        text:
          "Retirar o conteúdo e punir quem compartilhou.",

        effects: {
          authoritarianism: 5,
          personalism: 4
        }
      }
    ]
  },

  {
    id: "popular-votes",

    title:
      "Como as decisões importantes deveriam ser tomadas?",

    description:
      "O Congresso afirma que foi eleito para decidir. Movimentos populares querem participar diretamente.",

    answers: [
      {
        id: "direct-democracy",
        text:
          "Com plebiscitos e participação popular frequente.",

        effects: {
          popularParticipation: 5,
          personalism: -2
        }
      },

      {
        id: "mixed-democracy",
        text:
          "Congresso normalmente, plebiscito em assuntos importantes.",

        effects: {
          popularParticipation: 2,
          personalism: -1
        }
      },

      {
        id: "congress-decides",
        text:
          "O Congresso foi eleito para tomar essas decisões.",

        effects: {
          popularParticipation: -2,
          personalism: -2
        }
      },

      {
        id: "president-decides",
        text:
          "O presidente venceu a eleição e deve decidir.",

        effects: {
          popularParticipation: -4,
          personalism: 5
        }
      }
    ]
  },

  {
    id: "congress-opposition",

    title:
      "O Congresso está impedindo quase todos os projetos do presidente.",

    description:
      "O governo acusa parlamentares de sabotar o país.",

    answers: [
      {
        id: "keep-negotiating",
        text:
          "Continuar negociando dentro das regras.",

        effects: {
          authoritarianism: -2,
          personalism: -3
        }
      },

      {
        id: "popular-pressure",
        text:
          "Convocar a população para pressionar o Congresso.",

        effects: {
          popularParticipation: 3,
          personalism: 1
        }
      },

      {
        id: "rule-by-decree",
        text:
          "Governar por decretos sempre que for possível.",

        effects: {
          authoritarianism: 3,
          personalism: 4
        }
      },

      {
        id: "close-congress",
        text:
          "Fechar o Congresso. Se atrapalha, não serve.",

        effects: {
          authoritarianism: 6,
          personalism: 6,
          popularParticipation: -5
        }
      }
    ]
  },

  {
    id: "national-crisis",

    title:
      "Uma grande crise ameaça o país. Quanto poder o presidente deve receber?",

    description:
      "Aliados afirmam que decisões rápidas são necessárias para restaurar a ordem.",

    answers: [
      {
        id: "constitutional-response",
        text:
          "Somente os poderes previstos na Constituição.",

        effects: {
          authoritarianism: -4,
          personalism: -3
        }
      },

      {
        id: "temporary-powers",
        text:
          "Poderes temporários, fiscalizados pelo Congresso e pela Justiça.",

        effects: {
          authoritarianism: 1,
          personalism: 1
        }
      },

      {
        id: "broad-powers",
        text:
          "Poderes amplos até que a crise termine.",

        effects: {
          authoritarianism: 4,
          personalism: 4
        }
      },

      {
        id: "unlimited-powers",
        text:
          "Poder total. Em crise, democracia só atrapalha.",

        effects: {
          authoritarianism: 7,
          personalism: 6,
          popularParticipation: -5
        }
      }
    ]
  }
];