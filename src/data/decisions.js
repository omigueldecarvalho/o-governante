const BASE_DECISIONS = [
  {
    id: "school-meals",
    category: "Educação",

    character: {
      name: "Helena Duarte",
      role: "Ministra da Educação"
    },

    title: "Alimentação nas escolas",

    description:
      "A ministra propõe ampliar a alimentação escolar. O programa custará caro, mas poderá aumentar a frequência dos estudantes.",

    choices: [
      {
        id: "approve",
        text: "Aprovar o programa",

        resultText:
          "O programa foi aprovado. Famílias e movimentos sociais comemoraram, enquanto parlamentares questionaram o custo da medida.",

        effects: {
          indicators: {
            people: 8,
            congress: -4,
            economy: -7,
            stability: 2
          },

          politics: {
            economicPosition: -15,
            socialPosition: -5,
            authoritarianism: 0,
            popularParticipation: 5,
            personalism: 0
          },

          factions: {
            military: 0,
            business: -3,
            unions: 5,
            socialMovements: 7,
            religiousGroups: 0,
            press: 2
          },

          country: {
            inequality: -3,
            publicServices: 6,
            environment: 0
          },

          corruption: 0,
          personalWealth: 0
        },

        futureEffect: {
          afterMonths: 6,

          message:
            "A frequência escolar aumentou depois da ampliação do programa de alimentação.",

          effects: {
            indicators: {
              people: 4,
              congress: 0,
              economy: 3,
              stability: 2
            },

            factions: {
              unions: 2,
              socialMovements: 3
            },

            country: {
              inequality: -2,
              publicServices: 3
            },

            corruption: 0,
            personalWealth: 0
          }
        }
      },

      {
        id: "reject",
        text: "Recusar por falta de recursos",

        resultText:
          "O governo preservou recursos públicos, mas foi acusado de abandonar estudantes em situação de vulnerabilidade.",

        effects: {
          indicators: {
            people: -6,
            congress: 4,
            economy: 6,
            stability: 0
          },

          politics: {
            economicPosition: 12,
            socialPosition: 0,
            authoritarianism: 0,
            popularParticipation: -2,
            personalism: 0
          },

          factions: {
            military: 0,
            business: 4,
            unions: -5,
            socialMovements: -7,
            religiousGroups: 0,
            press: -2
          },

          country: {
            inequality: 2,
            publicServices: -4,
            environment: 0
          },

          corruption: 0,
          personalWealth: 0
        }
      }
    ]
  },

  {
    id: "truck-drivers-strike",
    category: "Economia",

    character: {
      name: "Roberto Almeida",
      role: "Ministro da Infraestrutura"
    },

    title: "O país parou",

    description:
      "Caminhoneiros bloquearam as principais rodovias do país e exigem uma redução imediata no preço do diesel.",

    choices: [
      {
        id: "negotiate",
        text: "Negociar a redução",

        resultText:
          "O governo anunciou uma redução temporária. Os bloqueios começaram a terminar, mas a equipe econômica demonstrou preocupação.",

        effects: {
          indicators: {
            people: 8,
            congress: -3,
            economy: -7,
            stability: 8
          },

          politics: {
            economicPosition: -5,
            socialPosition: 0,
            authoritarianism: 0,
            popularParticipation: 10,
            personalism: 0
          },

          factions: {
            military: 0,
            business: 3,
            unions: 5,
            socialMovements: 3,
            religiousGroups: 0,
            press: 2
          },

          country: {
            inequality: 0,
            publicServices: 0,
            environment: -2
          },

          corruption: 0,
          personalWealth: 0
        },

        futureEffect: {
          afterMonths: 3,

          message:
            "A redução do imposto sobre o diesel aumentou o déficit público.",

          effects: {
            indicators: {
              people: -2,
              congress: -3,
              economy: -6,
              stability: -1
            },

            factions: {
              business: -2,
              press: -2
            },

            country: {
              publicServices: -2
            },

            corruption: 0,
            personalWealth: 0
          }
        }
      },

      {
        id: "use-force",
        text: "Ordenar a liberação das estradas",

        resultText:
          "As forças de segurança começaram a liberar as rodovias. Parte da população apoiou a medida, enquanto os confrontos aumentaram.",

        effects: {
          indicators: {
            people: -8,
            congress: 5,
            economy: 7,
            stability: -10
          },

          politics: {
            economicPosition: 5,
            socialPosition: 5,
            authoritarianism: 20,
            popularParticipation: -10,
            personalism: 8
          },

          factions: {
            military: 10,
            business: 7,
            unions: -10,
            socialMovements: -8,
            religiousGroups: 2,
            press: -5
          },

          country: {
            inequality: 0,
            publicServices: 0,
            environment: 0
          },

          corruption: 0,
          personalWealth: 0
        },

        futureEffect: {
          afterMonths: 2,

          message:
            "Imagens da repressão aos caminhoneiros provocaram novos protestos pelo país.",

          effects: {
            indicators: {
              people: -5,
              congress: -2,
              economy: -2,
              stability: -5
            },

            factions: {
              military: 3,
              unions: -5,
              socialMovements: -5,
              press: -5
            },

            corruption: 0,
            personalWealth: 0
          }
        }
      }
    ]
  },

  {
    id: "congress-agreement",
    category: "Política",

    character: {
      name: "Augusto Nogueira",
      role: "Presidente da Câmara"
    },

    title: "O preço da governabilidade",

    description:
      "Um grupo de parlamentares promete apoiar os projetos do governo, mas exige o controle de ministérios e de parte do orçamento.",

    choices: [
      {
        id: "reject-agreement",
        text: "Recusar o acordo",

        resultText:
          "O governo manteve o discurso de independência, mas perdeu votos importantes no Congresso.",

        effects: {
          indicators: {
            people: 5,
            congress: -12,
            economy: -2,
            stability: -5
          },

          politics: {
            economicPosition: 0,
            socialPosition: 0,
            authoritarianism: 2,
            popularParticipation: 5,
            personalism: 8
          },

          factions: {
            military: 0,
            business: -3,
            unions: 3,
            socialMovements: 5,
            religiousGroups: 0,
            press: 5
          },

          country: {
            inequality: 0,
            publicServices: 0,
            environment: 0
          },

          corruption: -2,
          personalWealth: 0
        }
      },

      {
        id: "accept-agreement",
        text: "Aceitar as indicações",

        resultText:
          "Os novos aliados anunciaram apoio ao governo. Em troca, seus indicados assumiram ministérios e cargos estratégicos.",

        effects: {
          indicators: {
            people: -4,
            congress: 15,
            economy: 3,
            stability: 7
          },

          politics: {
            economicPosition: 5,
            socialPosition: 0,
            authoritarianism: 5,
            popularParticipation: -5,
            personalism: 12
          },

          factions: {
            military: 0,
            business: 5,
            unions: -3,
            socialMovements: -5,
            religiousGroups: 3,
            press: -5
          },

          country: {
            inequality: 1,
            publicServices: -2,
            environment: 0
          },

          corruption: 8,
          personalWealth: 0
        },

        futureEffect: {
          afterMonths: 4,

          message:
            "Uma investigação encontrou contratos suspeitos em um dos ministérios entregues aos aliados.",

          effects: {
            indicators: {
              people: -8,
              congress: -5,
              economy: -3,
              stability: -6
            },

            factions: {
              business: -3,
              socialMovements: -5,
              press: -8
            },

            country: {
              publicServices: -2
            },

            corruption: 10,
            personalWealth: 0
          }
        }
      }
    ]
  },

  {
    id: "construction-company-bribe",
    category: "Corrupção",

    character: {
      name: "Eduardo Ferraz",
      role: "Empresário do setor de infraestrutura"
    },

    title: "Uma contribuição pessoal",

    description:
      "Um empresário oferece dinheiro em uma conta no exterior em troca da aprovação de uma grande obra pública.",

    choices: [
      {
        id: "refuse-bribe",
        text: "Recusar e denunciar",

        resultText:
          "A proposta foi denunciada. A imprensa elogiou a decisão, mas empresários próximos ao governo ficaram preocupados.",

        effects: {
          indicators: {
            people: 8,
            congress: -3,
            economy: -2,
            stability: 5
          },

          politics: {
            economicPosition: 0,
            socialPosition: 0,
            authoritarianism: 0,
            popularParticipation: 5,
            personalism: -5
          },

          factions: {
            military: 0,
            business: -10,
            unions: 5,
            socialMovements: 7,
            religiousGroups: 2,
            press: 12
          },

          country: {
            inequality: 0,
            publicServices: 0,
            environment: 0
          },

          corruption: -10,
          personalWealth: 0
        },

        futureEffect: {
          afterMonths: 2,

          message:
            "A denúncia levou à prisão de empresários e aumentou a confiança nas instituições.",

          effects: {
            indicators: {
              people: 5,
              congress: -2,
              economy: -2,
              stability: 6
            },

            factions: {
              business: -5,
              socialMovements: 3,
              press: 5
            },

            corruption: -5,
            personalWealth: 0
          }
        }
      },

      {
        id: "accept-bribe",
        text: "Aceitar a proposta",

        resultText:
          "O valor foi transferido por meio de empresas no exterior. Publicamente, o governo anunciou uma nova parceria pela infraestrutura.",

        effects: {
          indicators: {
            people: 0,
            congress: 7,
            economy: 5,
            stability: 0
          },

          politics: {
            economicPosition: 8,
            socialPosition: 0,
            authoritarianism: 5,
            popularParticipation: -5,
            personalism: 25
          },

          factions: {
            military: 0,
            business: 12,
            unions: -3,
            socialMovements: -3,
            religiousGroups: 0,
            press: -5
          },

          country: {
            inequality: 3,
            publicServices: -2,
            environment: -3
          },

          corruption: 20,
          personalWealth: 2500000
        },

        futureEffect: {
          afterMonths: 3,

          message:
            "Documentos da empreiteira mencionando membros do governo foram entregues a jornalistas.",

          effects: {
            indicators: {
              people: -12,
              congress: -8,
              economy: -3,
              stability: -10
            },

            factions: {
              business: -5,
              unions: -5,
              socialMovements: -8,
              press: -12
            },

            country: {
              inequality: 2,
              publicServices: -2
            },

            corruption: 15,
            personalWealth: 0
          }
        }
      }
    ]
  },

  {
    id: "national-protest",
    category: "Sociedade",

    character: {
      name: "Marina Campos",
      role: "Ministra da Justiça"
    },

    title: "Manifestantes ocupam as ruas",

    description:
      "Milhares de pessoas protestam contra o governo. A ministra solicita uma decisão antes que as manifestações aumentem.",

    choices: [
      {
        id: "open-dialogue",
        text: "Receber os manifestantes",

        resultText:
          "Representantes dos movimentos foram recebidos pelo governo. O diálogo reduziu a tensão, mas passou uma imagem de fraqueza para alguns aliados.",

        effects: {
          indicators: {
            people: 8,
            congress: -4,
            economy: -2,
            stability: 7
          },

          politics: {
            economicPosition: -3,
            socialPosition: -8,
            authoritarianism: -10,
            popularParticipation: 20,
            personalism: -5
          },

          factions: {
            military: -5,
            business: -3,
            unions: 8,
            socialMovements: 12,
            religiousGroups: 0,
            press: 5
          },

          country: {
            inequality: -1,
            publicServices: 0,
            environment: 0
          },

          corruption: 0,
          personalWealth: 0
        },

        futureEffect: {
          afterMonths: 2,

          message:
            "O diálogo com os movimentos resultou em propostas populares enviadas ao Congresso.",

          effects: {
            indicators: {
              people: 4,
              congress: -3,
              economy: -1,
              stability: 4
            },

            factions: {
              unions: 3,
              socialMovements: 5,
              press: 2
            },

            corruption: 0,
            personalWealth: 0
          }
        }
      },

      {
        id: "repress-protest",
        text: "Ordenar a dispersão",

        resultText:
          "As forças de segurança retiraram os manifestantes. As ruas foram liberadas, mas imagens dos confrontos circularam pelo país.",

        effects: {
          indicators: {
            people: -12,
            congress: 5,
            economy: 4,
            stability: -8
          },

          politics: {
            economicPosition: 5,
            socialPosition: 12,
            authoritarianism: 30,
            popularParticipation: -20,
            personalism: 15
          },

          factions: {
            military: 12,
            business: 8,
            unions: -12,
            socialMovements: -15,
            religiousGroups: 3,
            press: -10
          },

          country: {
            inequality: 2,
            publicServices: -1,
            environment: 0
          },

          corruption: 0,
          personalWealth: 0
        },

        futureEffect: {
          afterMonths: 2,

          message:
            "As imagens da repressão deram origem a uma nova onda de manifestações.",

          effects: {
            indicators: {
              people: -7,
              congress: -2,
              economy: -3,
              stability: -8
            },

            factions: {
              military: 3,
              business: -3,
              unions: -7,
              socialMovements: -10,
              press: -8
            },

            corruption: 0,
            personalWealth: 0
          }
        }
      }
    ]
  },
  {
  id: "national-emergency-law",
  type: "law",
  category: "Lei presidencial",

  character: {
    name: "Beatriz Vasconcelos",
    role: "Ministra-Chefe da Casa Civil"
  },

  title: "Uma lei para tempos difíceis",

  description:
    "A crise exige uma resposta do governo. Escolha a medida, dê um nome à nova lei e explique ao país por que ela é necessária.",

  choices: [
    {
      id: "state-of-siege",
      text: "Decretar estado de sítio",

      optionDescription:
        "Amplia os poderes do governo e permite restringir manifestações e liberdades temporariamente.",

      resultText:
        "O governo recebeu poderes extraordinários. Militares ocuparam pontos estratégicos enquanto juristas questionavam a medida.",

      effects: {
        indicators: {
          people: -25,
          congress: -15,
          economy: -5,
          stability: -20
        },

        factions: {
          military: 25,
          business: 5,
          unions: -20,
          socialMovements: -25,
          religiousGroups: 5,
          press: -25
        },

        corruption: 5,
        personalWealth: 0
      },

      futureEffect: {
        afterMonths: 2,

        message:
          "Os poderes emergenciais passaram a ser utilizados contra adversários do governo.",

        effects: {
          indicators: {
            people: -10,
            congress: -8,
            stability: -12
          },

          corruption: 5
        }
      }
    },

    {
      id: "print-money",
      text: "Autorizar expansão monetária",

      optionDescription:
        "Libera recursos emergenciais para estimular a economia e financiar programas públicos.",

      resultText:
        "Novos recursos começaram a circular. O consumo cresceu rapidamente, mas economistas alertaram para o risco de inflação.",

      effects: {
        indicators: {
          people: 8,
          congress: -8,
          economy: 18,
          stability: -4
        },

        factions: {
          military: 0,
          business: 5,
          unions: 8,
          socialMovements: 6,
          religiousGroups: 0,
          press: -5
        },

        corruption: 3,
        personalWealth: 0
      },

      futureEffect: {
        afterMonths: 2,

        message:
          "A expansão monetária pressionou os preços e a inflação começou a afetar as famílias.",

        effects: {
          indicators: {
            people: -15,
            congress: -5,
            economy: -25,
            stability: -8
          },

          corruption: 0
        }
      }
    },

    {
      id: "transparency-law",
      text: "Criar uma lei de transparência",

      optionDescription:
        "Amplia a fiscalização de contratos, emendas, ministérios e gastos do governo.",

      resultText:
        "A nova lei foi elogiada pela população, mas provocou revolta entre parlamentares e integrantes da própria base.",

      effects: {
        indicators: {
          people: 12,
          congress: -12,
          economy: -3,
          stability: 8
        },

        factions: {
          military: 0,
          business: -5,
          unions: 5,
          socialMovements: 10,
          religiousGroups: 0,
          press: 15
        },

        corruption: -15,
        personalWealth: 0
      },

      futureEffect: {
        afterMonths: 3,

        message:
          "A lei de transparência revelou irregularidades cometidas por aliados do próprio governo.",

        effects: {
          indicators: {
            people: 5,
            congress: -10,
            economy: -2,
            stability: -3
          },

          corruption: -5
        }
      }
    }
  ]
}, 

{
  id: "presidential-press-conference",
  type: "press-conference",
  category: "Imprensa",

  character: {
    name: "Coletiva nacional",
    role: "Palácio presidencial"
  },

  title: "O país quer respostas",

  description:
    "Jornalistas aguardam suas respostas sobre economia, corrupção e manifestações.",

  choices: [],

  questions: [
    {
      id: "unemployment",
      journalist: "Júlia Martins",
      outlet: "Jornal Nacional Popular",

      text:
        "Presidente, o desemprego aumentou. O que seu governo fará?",

      answers: [
        {
          id: "public-investment",
          text: "Criar um programa de obras públicas",

          reaction:
            "A proposta foi bem recebida por trabalhadores, mas gerou preocupação com os gastos.",

          effects: {
            indicators: {
              people: 8,
              congress: -4,
              economy: 3,
              stability: 2
            },

            politics: {
              economicPosition: -12,
              socialPosition: -3,
              authoritarianism: 0,
              popularParticipation: 3,
              personalism: 0
            },

            factions: {
              business: -3,
              unions: 8,
              socialMovements: 5,
              press: 2
            },

            corruption: 0,
            personalWealth: 0
          }
        },

        {
          id: "business-tax-cut",
          text: "Reduzir impostos das empresas",

          reaction:
            "Empresários comemoraram. Sindicatos afirmaram que a medida não garante novos empregos.",

          effects: {
            indicators: {
              people: -3,
              congress: 5,
              economy: 8,
              stability: 2
            },

            politics: {
              economicPosition: 15,
              socialPosition: 2,
              authoritarianism: 0,
              popularParticipation: -2,
              personalism: 0
            },

            factions: {
              business: 12,
              unions: -8,
              socialMovements: -5,
              press: 2
            },

            corruption: 0,
            personalWealth: 0
          }
        },

        {
          id: "blame-previous-government",
          text: "A culpa é do governo anterior",

          reaction:
            "A resposta animou sua base, mas jornalistas lembraram que seu governo já teve tempo para agir.",

          effects: {
            indicators: {
              people: 2,
              congress: -2,
              economy: -3,
              stability: -3
            },

            politics: {
              economicPosition: 0,
              socialPosition: 0,
              authoritarianism: 3,
              popularParticipation: -2,
              personalism: 10
            },

            factions: {
              press: -8
            },

            corruption: 0,
            personalWealth: 0
          }
        }
      ]
    },

    {
      id: "corruption-allegation",
      journalist: "Ricardo Prado",
      outlet: "Correio da República",

      text:
        "Documentos indicam irregularidades em um ministério. O senhor permitirá uma investigação independente?",

      answers: [
        {
          id: "independent-investigation",
          text: "Investiguem tudo",

          reaction:
            "A autorização aumentou a confiança pública, mas deixou integrantes da base preocupados.",

          effects: {
            indicators: {
              people: 8,
              congress: -8,
              economy: -1,
              stability: 6
            },

            politics: {
              economicPosition: 0,
              socialPosition: -2,
              authoritarianism: -8,
              popularParticipation: 7,
              personalism: -8
            },

            factions: {
              business: -3,
              socialMovements: 6,
              press: 12
            },

            corruption: -10,
            personalWealth: 0
          }
        },

        {
          id: "internal-investigation",
          text: "O próprio governo investigará",

          reaction:
            "A base respirou aliviada. A imprensa questionou a independência da investigação.",

          effects: {
            indicators: {
              people: -3,
              congress: 6,
              economy: 0,
              stability: 1
            },

            politics: {
              economicPosition: 0,
              socialPosition: 0,
              authoritarianism: 5,
              popularParticipation: -4,
              personalism: 8
            },

            factions: {
              business: 3,
              press: -8
            },

            corruption: 7,
            personalWealth: 0
          }
        },

        {
          id: "attack-press",
          text: "Isso é invenção da imprensa",

          reaction:
            "Seus apoiadores atacaram os jornalistas nas redes sociais. A crise institucional aumentou.",

          effects: {
            indicators: {
              people: 3,
              congress: 2,
              economy: -2,
              stability: -8
            },

            politics: {
              economicPosition: 2,
              socialPosition: 8,
              authoritarianism: 12,
              popularParticipation: -7,
              personalism: 15
            },

            factions: {
              military: 3,
              socialMovements: -5,
              press: -18
            },

            corruption: 8,
            personalWealth: 0
          }
        }
      ]
    },

    {
      id: "demonstrations",
      journalist: "Camila Freire",
      outlet: "TV Nacional",

      text:
        "Manifestações contra o governo estão crescendo. Qual será sua resposta?",

      answers: [
        {
          id: "dialogue",
          text: "Vamos receber os movimentos",

          reaction:
            "Os movimentos aceitaram dialogar, embora aliados tenham considerado a resposta fraca.",

          effects: {
            indicators: {
              people: 7,
              congress: -4,
              economy: -1,
              stability: 6
            },

            politics: {
              economicPosition: -2,
              socialPosition: -7,
              authoritarianism: -10,
              popularParticipation: 15,
              personalism: -5
            },

            factions: {
              military: -3,
              unions: 7,
              socialMovements: 12,
              press: 5
            },

            corruption: 0,
            personalWealth: 0
          }
        },

        {
          id: "law-and-order",
          text: "A ordem será restabelecida",

          reaction:
            "A declaração recebeu apoio dos setores conservadores, mas aumentou a tensão nas ruas.",

          effects: {
            indicators: {
              people: -6,
              congress: 5,
              economy: 3,
              stability: -7
            },

            politics: {
              economicPosition: 3,
              socialPosition: 8,
              authoritarianism: 18,
              popularParticipation: -12,
              personalism: 10
            },

            factions: {
              military: 10,
              business: 5,
              unions: -10,
              socialMovements: -12,
              press: -5
            },

            corruption: 0,
            personalWealth: 0
          }
        },

        {
          id: "avoid-answer",
          text: "Próxima pergunta",

          reaction:
            "O vídeo evitando a resposta viralizou e virou meme nacional.",

          effects: {
            indicators: {
              people: -5,
              congress: 0,
              economy: 0,
              stability: -3
            },

            politics: {
              economicPosition: 0,
              socialPosition: 0,
              authoritarianism: 2,
              popularParticipation: -4,
              personalism: 5
            },

            factions: {
              press: -7
            },

            corruption: 0,
            personalWealth: 0
          }
        }
      ]
    }
  ]
}

];

const POLITICAL_EFFECTS = {
  "school-meals": {
    approve: {
      economicPosition: -15,
      socialPosition: -5,
      authoritarianism: 0,
      popularParticipation: 5,
      personalism: 0
    },

    reject: {
      economicPosition: 12,
      socialPosition: 0,
      authoritarianism: 0,
      popularParticipation: -2,
      personalism: 0
    }
  },

  "truck-drivers-strike": {
    negotiate: {
      economicPosition: -5,
      socialPosition: 0,
      authoritarianism: -2,
      popularParticipation: 10,
      personalism: 0
    },

    "use-force": {
      economicPosition: 5,
      socialPosition: 5,
      authoritarianism: 20,
      popularParticipation: -10,
      personalism: 8
    }
  },

  "congress-agreement": {
    "reject-agreement": {
      economicPosition: 0,
      socialPosition: 0,
      authoritarianism: 2,
      popularParticipation: 5,
      personalism: 8
    },

    "accept-agreement": {
      economicPosition: 5,
      socialPosition: 0,
      authoritarianism: 5,
      popularParticipation: -5,
      personalism: 12
    }
  },

  "construction-company-bribe": {
    "refuse-bribe": {
      economicPosition: 0,
      socialPosition: 0,
      authoritarianism: -3,
      popularParticipation: 5,
      personalism: -5
    },

    "accept-bribe": {
      economicPosition: 8,
      socialPosition: 0,
      authoritarianism: 5,
      popularParticipation: -5,
      personalism: 25
    }
  },

  "national-protest": {
    "open-dialogue": {
      economicPosition: -3,
      socialPosition: -8,
      authoritarianism: -10,
      popularParticipation: 20,
      personalism: -5
    },

    "repress-protest": {
      economicPosition: 5,
      socialPosition: 12,
      authoritarianism: 30,
      popularParticipation: -20,
      personalism: 15
    },

    "national-emergency-law": {
  "state-of-siege": {
    economicPosition: 0,
    socialPosition: 15,
    authoritarianism: 40,
    popularParticipation: -30,
    personalism: 25
  },

  "print-money": {
    economicPosition: -15,
    socialPosition: -2,
    authoritarianism: 5,
    popularParticipation: 0,
    personalism: 8
  },

  "transparency-law": {
    economicPosition: 0,
    socialPosition: -5,
    authoritarianism: -10,
    popularParticipation: 15,
    personalism: -10
  }
  },
  }
};

export const DECISIONS = BASE_DECISIONS.map(
  (decision) => ({
    ...decision,

    choices: decision.choices.map((choice) => ({
      ...choice,

      effects: {
        ...choice.effects,

        politics:
          POLITICAL_EFFECTS[decision.id]?.[
            choice.id
          ] ?? {
            economicPosition: 0,
            socialPosition: 0,
            authoritarianism: 0,
            popularParticipation: 0,
            personalism: 0
          }
      }
    }))
  })
);