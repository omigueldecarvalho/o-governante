export const COMMON_DECISIONS = [
  {
    id: "minimum-wage-adjustment",
    type: "common",
    category: "economy",
    weight: 3,
    character: {
      name: "Célia Martins",
      role: "Ministra do Trabalho"
    },
    title: "O salário que cabe no bolso",
    description:
      "A inflação apertou as famílias, e o governo precisa definir o reajuste do salário mínimo. Empresários pedem cautela; sindicatos querem ganho real.",
    choices: [
      {
        id: "real-increase",
        text: "Dar aumento acima da inflação",
        resultText:
          "O aumento animou trabalhadores e aqueceu o consumo, mas empresas reclamaram dos novos custos.",
        effects: {
          indicators: { people: 9, congress: -3, economy: -4, stability: 3 },
          factions: { business: -8, unions: 12, socialMovements: 6 },
          country: { inequality: -5, publicServices: 0 },
          politics: { economicPosition: -8, popularParticipation: 3 },
          corruption: 0,
          personalWealth: 0
        },
        futureEffect: {
          afterMonths: 6,
          message:
            "O consumo cresceu após o reajuste, embora pequenos empresários ainda reclamem dos custos.",
          effects: {
            indicators: { people: 3, economy: 4 },
            factions: { business: -2, unions: 3 }
          }
        }
      },
      {
        id: "inflation-only",
        text: "Repor somente a inflação",
        resultText:
          "O governo escolheu a prudência. Ninguém comemorou muito, mas também não houve pânico.",
        effects: {
          indicators: { people: 1, congress: 3, economy: 3, stability: 4 },
          factions: { business: 4, unions: -3 },
          country: { inequality: 1 },
          politics: { economicPosition: 2 },
          corruption: 0,
          personalWealth: 0
        }
      },
      {
        id: "freeze-wage",
        text: "Congelar para proteger a economia",
        resultText:
          "O mercado respirou aliviado. O trabalhador respirou fundo porque o preço do almoço continuou subindo.",
        effects: {
          indicators: { people: -10, congress: 5, economy: 7, stability: -4 },
          factions: { business: 10, unions: -12, socialMovements: -7 },
          country: { inequality: 6 },
          politics: { economicPosition: 9 },
          corruption: 0,
          personalWealth: 0
        }
      }
    ]
  },

  {
    id: "public-health-collapse",
    type: "common",
    category: "health",
    weight: 3,
    character: {
      name: "Dra. Lúcia Seringa",
      role: "Ministra da Saúde"
    },
    title: "A fila dobrou a esquina",
    description:
      "Hospitais estão lotados e cirurgias foram adiadas. A ministra apresenta três soluções, todas caras de algum jeito.",
    choices: [
      {
        id: "emergency-investment",
        text: "Abrir crédito emergencial ao sistema público",
        resultText:
          "Leitos foram reabertos e mutirões começaram. A equipe econômica pediu um leito para se recuperar do susto.",
        effects: {
          indicators: { people: 11, congress: -4, economy: -8, stability: 6 },
          factions: { unions: 7, socialMovements: 8, business: -3 },
          country: { publicServices: 10, inequality: -3 },
          politics: { economicPosition: -7 },
          corruption: 0,
          personalWealth: 0
        }
      },
      {
        id: "private-partnership",
        text: "Contratar hospitais privados",
        resultText:
          "A fila caiu rapidamente, junto com um contrato que ninguém conseguiu explicar em menos de 200 páginas.",
        effects: {
          indicators: { people: 5, congress: 5, economy: -4, stability: 5 },
          factions: { business: 9, unions: -4 },
          country: { publicServices: 4, inequality: 2 },
          politics: { economicPosition: 7 },
          corruption: 5,
          personalWealth: 0
        },
        futureEffect: {
          afterMonths: 5,
          message:
            "Auditores encontraram preços diferentes para o mesmo curativo nos contratos emergenciais.",
          effects: {
            indicators: { people: -4, congress: -3 },
            corruption: 5
          }
        }
      },
      {
        id: "deny-health-crisis",
        text: "Dizer que a fila é questão de perspectiva",
        resultText:
          "O pronunciamento garantiu que não existe crise. Os pacientes assistiram pela televisão da recepção lotada.",
        effects: {
          indicators: { people: -12, congress: 2, economy: 2, stability: -9 },
          factions: { press: -10, socialMovements: -9 },
          country: { publicServices: -9 },
          politics: { authoritarianism: 4, personalism: 5 },
          corruption: 0,
          personalWealth: 0
        }
      }
    ]
  },

  {
    id: "social-media-regulation",
    type: "common",
    category: "technology",
    weight: 3,
    character: {
      name: "Caio Algoritmo",
      role: "Secretário de Comunicação Digital"
    },
    title: "Quem manda no algoritmo?",
    description:
      "Uma onda de golpes, robôs e campanhas coordenadas domina as redes. O Congresso exige uma resposta do governo.",
    choices: [
      {
        id: "transparent-regulation",
        text: "Exigir transparência e direito de recurso",
        resultText:
          "As plataformas terão de explicar moderação e anúncios políticos. A internet respondeu com 40 mil opiniões por segundo.",
        effects: {
          indicators: { people: 5, congress: -2, economy: -2, stability: 7 },
          factions: { press: 7, business: -5, socialMovements: 5 },
          country: { publicServices: 2 },
          politics: { popularParticipation: 7, authoritarianism: -5 },
          corruption: 0,
          personalWealth: 0
        }
      },
      {
        id: "government-control",
        text: "Criar uma agência controlada pelo governo",
        resultText:
          "A nova agência prometeu proteger a verdade. Curiosamente, a verdade passou a concordar bastante com o Palácio.",
        effects: {
          indicators: { people: -5, congress: 5, economy: -1, stability: 5 },
          factions: { press: -12, military: 4 },
          politics: { authoritarianism: 12, personalism: 8 },
          corruption: 4,
          personalWealth: 0
        }
      },
      {
        id: "leave-platforms-alone",
        text: "Deixar as plataformas se autorregularem",
        resultText:
          "As empresas publicaram um compromisso voluntário, curtido por milhares de contas criadas naquela manhã.",
        effects: {
          indicators: { people: -3, congress: -4, economy: 6, stability: -5 },
          factions: { business: 10, press: -3 },
          politics: { economicPosition: 8 },
          corruption: 0,
          personalWealth: 0
        }
      }
    ]
  },

  {
    id: "national-teachers-strike",
    type: "common",
    category: "education",
    weight: 3,
    character: {
      name: "Professor Gizberto",
      role: "Representante nacional dos professores"
    },
    title: "Sem aula, com razão?",
    description:
      "Professores entraram em greve por salário, estrutura e segurança. Pais pressionam o governo por uma solução rápida.",
    choices: [
      {
        id: "negotiate-teachers",
        text: "Negociar reajuste e melhorias",
        resultText:
          "O acordo encerrou a greve. Professores voltaram às salas com promessas, planilhas e um pouco de esperança.",
        effects: {
          indicators: { people: 8, congress: -5, economy: -6, stability: 8 },
          factions: { unions: 12, socialMovements: 6, business: -3 },
          country: { publicServices: 9, inequality: -2 },
          politics: { economicPosition: -6, popularParticipation: 6 },
          corruption: 0,
          personalWealth: 0
        }
      },
      {
        id: "temporary-teachers",
        text: "Contratar temporários e manter as escolas abertas",
        resultText:
          "As escolas reabriram, mas ninguém sabia por quanto tempo os novos professores permaneceriam.",
        effects: {
          indicators: { people: -2, congress: 4, economy: 2, stability: 3 },
          factions: { unions: -10, business: 5 },
          country: { publicServices: -3 },
          politics: { economicPosition: 5 },
          corruption: 2,
          personalWealth: 0
        }
      },
      {
        id: "repress-teachers",
        text: "Declarar a greve ilegal e dispersar os atos",
        resultText:
          "A greve saiu das escolas e foi para as ruas. O governo conseguiu transformar uma pauta salarial em crise nacional.",
        effects: {
          indicators: { people: -13, congress: 5, economy: 1, stability: -11 },
          factions: { military: 7, unions: -15, socialMovements: -12, press: -6 },
          country: { publicServices: -6 },
          politics: { authoritarianism: 14, popularParticipation: -8 },
          corruption: 0,
          personalWealth: 0
        }
      }
    ]
  },

  {
    id: "oil-environmental-reserve",
    type: "common",
    category: "environment",
    weight: 3,
    character: {
      name: "Petrolino Barril",
      role: "Ministro de Minas e Energia"
    },
    title: "Petróleo sob o paraíso",
    description:
      "Uma enorme reserva de petróleo foi encontrada perto de uma área ambiental sensível. A promessa de riqueza divide o governo.",
    choices: [
      {
        id: "authorize-oil",
        text: "Autorizar a exploração imediatamente",
        resultText:
          "As ações do setor dispararam. Ambientalistas lembraram que peixe não acompanha a bolsa de valores.",
        effects: {
          indicators: { people: 1, congress: 8, economy: 12, stability: 3 },
          factions: { business: 13, unions: 3, socialMovements: -13 },
          country: { environment: -14, inequality: 2 },
          politics: { economicPosition: 9 },
          corruption: 3,
          personalWealth: 0
        },
        futureEffect: {
          afterMonths: 8,
          message:
            "Um vazamento atingiu parte da costa, e imagens de praias manchadas dominaram os jornais.",
          effects: {
            indicators: { people: -9, economy: -4, stability: -5 },
            country: { environment: -10 }
          }
        }
      },
      {
        id: "environmental-study",
        text: "Exigir estudos e proteção reforçada",
        resultText:
          "A exploração foi adiada até a conclusão dos estudos. O petróleo permaneceu parado e o debate pegou fogo.",
        effects: {
          indicators: { people: 4, congress: -3, economy: -3, stability: 4 },
          factions: { business: -5, socialMovements: 8, press: 4 },
          country: { environment: 7 },
          politics: { popularParticipation: 4 },
          corruption: 0,
          personalWealth: 0
        }
      },
      {
        id: "protect-reserve",
        text: "Proibir a exploração na região",
        resultText:
          "A área foi protegida. O setor financeiro chamou a decisão de desperdício; pesquisadores chamaram de futuro.",
        effects: {
          indicators: { people: 6, congress: -8, economy: -7, stability: 1 },
          factions: { business: -13, socialMovements: 14 },
          country: { environment: 15, inequality: -1 },
          politics: { economicPosition: -4 },
          corruption: 0,
          personalWealth: 0
        }
      }
    ]
  },

  {
    id: "national-housing-program",
    type: "common",
    category: "housing",
    weight: 3,
    character: {
      name: "Márcia Tijolo",
      role: "Ministra das Cidades"
    },
    title: "Um teto para chamar de seu",
    description:
      "Milhões de famílias aguardam moradia. A ministra apresenta um programa ambicioso, mas construtoras e prefeitos já disputam os contratos.",
    choices: [
      {
        id: "public-housing",
        text: "Construir moradias com controle público",
        resultText:
          "O programa começou nas regiões mais carentes. O cadastro ficou maior que a fila do banco em dia de pagamento.",
        effects: {
          indicators: { people: 12, congress: -4, economy: -7, stability: 6 },
          factions: { unions: 7, socialMovements: 11, business: -4 },
          country: { inequality: -10, publicServices: 7 },
          politics: { economicPosition: -10 },
          corruption: 1,
          personalWealth: 0
        }
      },
      {
        id: "housing-vouchers",
        text: "Oferecer subsídios e deixar o mercado construir",
        resultText:
          "Construtoras anunciaram novos empreendimentos. Os apartamentos ficaram menores, mas a publicidade ganhou varanda gourmet.",
        effects: {
          indicators: { people: 6, congress: 5, economy: 5, stability: 4 },
          factions: { business: 11, socialMovements: -2 },
          country: { inequality: -3, publicServices: 2 },
          politics: { economicPosition: 8 },
          corruption: 3,
          personalWealth: 0
        }
      },
      {
        id: "friendly-contractors",
        text: "Entregar os contratos aos aliados",
        resultText:
          "As obras foram distribuídas em tempo recorde. Coincidentemente, os maiores contratos ficaram com doadores de campanha.",
        effects: {
          indicators: { people: 2, congress: 12, economy: 4, stability: 3 },
          factions: { business: 13, press: -8, socialMovements: -6 },
          country: { inequality: 3, publicServices: 1 },
          politics: { personalism: 10 },
          corruption: 14,
          personalWealth: 900000
        }
      }
    ]
  },

  {
    id: "family-ministry-appointment",
    type: "common",
    category: "politics",
    weight: 3,
    character: {
      name: "Juninho de Sobrenome",
      role: "Parente muito qualificado do presidente"
    },
    title: "Talento vem de família",
    description:
      "Um parente próximo deseja comandar um ministério. Ele garante possuir experiência porque administra três grupos da família no aplicativo de mensagens.",
    choices: [
      {
        id: "reject-relative",
        text: "Recusar a indicação",
        resultText:
          "A nomeação foi recusada. O país aprovou; o almoço de domingo ficou insuportável.",
        effects: {
          indicators: { people: 8, congress: -2, economy: 1, stability: 5 },
          factions: { press: 10, business: -2 },
          politics: { personalism: -10 },
          corruption: -6,
          personalWealth: 0
        }
      },
      {
        id: "appoint-relative",
        text: "Nomear: confiança é tudo",
        resultText:
          "O novo ministro prometeu separar família e governo, começando por trocar o nome do grupo para “Assuntos Institucionais”.",
        effects: {
          indicators: { people: -8, congress: 5, economy: -2, stability: -3 },
          factions: { press: -12, business: 4 },
          politics: { personalism: 15 },
          corruption: 12,
          personalWealth: 250000
        }
      },
      {
        id: "invent-advisory-role",
        text: "Criar um cargo sem poder, mas com salário",
        resultText:
          "O parente ganhou gabinete, motorista e nenhuma atribuição que pudesse ser explicada.",
        effects: {
          indicators: { people: -5, congress: 3, economy: -3, stability: 0 },
          factions: { press: -7 },
          politics: { personalism: 9 },
          corruption: 9,
          personalWealth: 100000
        }
      }
    ]
  },

  {
    id: "wealth-tax-proposal",
    type: "common",
    category: "economy",
    weight: 3,
    character: {
      name: "Rico de Almeida",
      role: "Presidente da Associação dos Bilionários Preocupados"
    },
    title: "Taxar quem tem quase tudo",
    description:
      "O governo discute um imposto sobre grandes fortunas. Movimentos sociais apoiam; investidores ameaçam fugir até o aeroporto mais próximo.",
    choices: [
      {
        id: "approve-wealth-tax",
        text: "Criar imposto progressivo sobre grandes fortunas",
        resultText:
          "O imposto foi aprovado. Bilionários declararam que agora terão de escolher entre o quarto e o quinto iate.",
        effects: {
          indicators: { people: 11, congress: -9, economy: -3, stability: 2 },
          factions: { business: -15, unions: 10, socialMovements: 13 },
          country: { inequality: -12, publicServices: 5 },
          politics: { economicPosition: -15 },
          corruption: -1,
          personalWealth: 0
        },
        futureEffect: {
          afterMonths: 7,
          message:
            "A nova arrecadação financiou serviços públicos, embora parte dos contribuintes tenha descoberto endereços em ilhas tropicais.",
          effects: {
            indicators: { people: 4, economy: 3 },
            country: { publicServices: 5, inequality: -3 }
          }
        }
      },
      {
        id: "reject-wealth-tax",
        text: "Arquivar para não assustar investidores",
        resultText:
          "O mercado celebrou a segurança jurídica. O povo perguntou quando chegaria a segurança financeira.",
        effects: {
          indicators: { people: -8, congress: 8, economy: 7, stability: 3 },
          factions: { business: 15, unions: -9, socialMovements: -11 },
          country: { inequality: 9 },
          politics: { economicPosition: 14 },
          corruption: 1,
          personalWealth: 0
        }
      },
      {
        id: "symbolic-wealth-tax",
        text: "Criar um imposto cheio de exceções",
        resultText:
          "O imposto nasceu com tantas exceções que conseguiu arrecadar principalmente aplausos.",
        effects: {
          indicators: { people: -2, congress: 7, economy: 2, stability: 2 },
          factions: { business: 7, unions: -4 },
          country: { inequality: 1 },
          politics: { personalism: 4 },
          corruption: 5,
          personalWealth: 0
        }
      }
    ]
  },

  {
    id: "influencer-bet-campaign",
    type: "common",
    category: "culture",
    weight: 3,
    character: {
      name: "Varginha Fonseca",
      role: "Influenciadora e empresária digital fictícia"
    },
    title: "A publi que paga o governo",
    description:
      "Varginha oferece divulgar uma campanha oficial para milhões de seguidores. Em troca, quer participar do lançamento de uma plataforma de apostas chamada Tigrão da Sorte.",
    choices: [
      {
        id: "accept-influencer-bet",
        text: "Aceitar a parceria completa",
        resultText:
          "A campanha viralizou, a plataforma bateu recordes e metade do país começou a acreditar que o próximo giro pagaria as contas.",
        effects: {
          indicators: { people: 7, congress: 3, economy: 7, stability: -4 },
          factions: { business: 11, press: -5, religiousGroups: -2 },
          country: { inequality: 5 },
          politics: { personalism: 9 },
          corruption: 10,
          personalWealth: 700000
        },
        futureEffect: {
          afterMonths: 4,
          message:
            "Famílias endividadas organizaram protestos após perder dinheiro na plataforma promovida durante a campanha oficial.",
          effects: {
            indicators: { people: -12, congress: -4, stability: -6 },
            corruption: 5
          }
        }
      },
      {
        id: "public-campaign-only",
        text: "Aceitar apenas a campanha de utilidade pública",
        resultText:
          "Varginha gravou a campanha sem citar apostas. O vídeo teve dança, filtro brilhante e, surpreendentemente, informação útil.",
        effects: {
          indicators: { people: 8, congress: 1, economy: 1, stability: 4 },
          factions: { press: 3, business: 2 },
          politics: { popularParticipation: 3, personalism: 2 },
          corruption: 1,
          personalWealth: 0
        }
      },
      {
        id: "regulate-bet-advertising",
        text: "Recusar e restringir publicidade de apostas",
        resultText:
          "A parceria foi cancelada e novas regras foram anunciadas. Influenciadores publicaram vídeos chorando pela liberdade comercial.",
        effects: {
          indicators: { people: 4, congress: -5, economy: -5, stability: 5 },
          factions: { business: -10, press: 7, socialMovements: 7 },
          country: { inequality: -3 },
          politics: { economicPosition: -5 },
          corruption: -3,
          personalWealth: 0
        }
      }
    ]
  },

  {
    id: "felipe-grandpa-support",
    type: "common",
    category: "communication",
    weight: 3,
    character: {
      name: "Felipe Avô",
      role: "Comunicador veterano da internet"
    },
    title: "O apoio do Felipe Avô",
    description:
      "Felipe Avô oferece apoio público ao governo e promete uma transmissão para explicar suas propostas ao público jovem — usando uma quantidade preocupante de cortes rápidos.",
    choices: [
      {
        id: "accept-public-support",
        text: "Aceitar o apoio sem combinar conteúdo",
        resultText:
          "A transmissão mobilizou apoiadores, críticos e pessoas que entraram apenas para discutir nos comentários.",
        effects: {
          indicators: { people: 8, congress: -2, economy: 0, stability: 2 },
          factions: { socialMovements: 6, press: 4, business: -2 },
          politics: { popularParticipation: 7, personalism: 2 },
          corruption: 0,
          personalWealth: 0
        }
      },
      {
        id: "send-government-script",
        text: "Enviar um roteiro oficial para ele repetir",
        resultText:
          "O vídeo parecia espontâneo, exceto pelas três vezes em que Felipe Avô disse “conforme o parágrafo seguinte”.",
        effects: {
          indicators: { people: 3, congress: 3, economy: 0, stability: 1 },
          factions: { press: -7, socialMovements: -2 },
          politics: { personalism: 8, authoritarianism: 3 },
          corruption: 4,
          personalWealth: 0
        },
        futureEffect: {
          afterMonths: 2,
          message:
            "O roteiro oficial vazou, levantando dúvidas sobre propaganda disfarçada de opinião independente.",
          effects: {
            indicators: { people: -7, stability: -3 },
            factions: { press: -5 },
            corruption: 3
          }
        }
      },
      {
        id: "decline-celebrity-support",
        text: "Agradecer e manter distância institucional",
        resultText:
          "O governo recusou transformar apoio pessoal em campanha oficial. A internet chamou a atitude de madura e sem graça.",
        effects: {
          indicators: { people: 2, congress: 2, economy: 0, stability: 5 },
          factions: { press: 6 },
          politics: { personalism: -7 },
          corruption: -2,
          personalWealth: 0
        }
      }
    ]
  },

  {
    id: "personal-donation-noble-cause",
    type: "common",
    category: "personal",
    weight: 3,
    character: {
      name: "Irmã Esperança",
      role: "Coordenadora de uma campanha solidária"
    },
    title: "E do próprio bolso?",
    description:
      "Uma enchente destruiu centenas de casas. A campanha solidária pede que o presidente faça uma doação pessoal e dê exemplo ao país.",
    choices: [
      {
        id: "large-personal-donation",
        text: "Doar R$ 200 mil do patrimônio pessoal",
        resultText:
          "A doação financiou abrigos e inspirou uma onda de contribuições. Pela primeira vez, o patrimônio presidencial caiu de forma explicável.",
        effects: {
          indicators: { people: 13, congress: 1, economy: 0, stability: 7 },
          factions: { socialMovements: 12, press: 10, religiousGroups: 5 },
          country: { inequality: -3, publicServices: 3 },
          politics: { popularParticipation: 7, personalism: -4 },
          corruption: -7,
          personalWealth: -200000
        }
      },
      {
        id: "small-personal-donation",
        text: "Doar R$ 20 mil e mobilizar empresas",
        resultText:
          "A contribuição foi modesta, mas a campanha empresarial multiplicou o valor arrecadado.",
        effects: {
          indicators: { people: 7, congress: 2, economy: 1, stability: 5 },
          factions: { business: 5, socialMovements: 5, press: 4 },
          country: { publicServices: 2 },
          politics: { popularParticipation: 4 },
          corruption: -2,
          personalWealth: -20000
        }
      },
      {
        id: "donate-public-money",
        text: "Fazer cerimônia e doar apenas verba pública",
        resultText:
          "O presidente entregou um cheque gigante com dinheiro do orçamento e recebeu agradecimentos como se tivesse vendido o próprio carro.",
        effects: {
          indicators: { people: -2, congress: 3, economy: -3, stability: 2 },
          factions: { press: -5, socialMovements: 1 },
          country: { publicServices: 2 },
          politics: { personalism: 9 },
          corruption: 4,
          personalWealth: 0
        }
      }
    ]
  },

  {
    id: "pastel-at-the-fair",
    type: "common",
    category: "popular-agenda",
    weight: 4,
    character: {
      name: "Dona Cida",
      role: "Feirante e especialista em caldo de cana"
    },
    title: "Pastel com o povo",
    description:
      "A assessoria sugere uma visita à feira para aproximar o presidente da população. Dona Cida já separou o pastel e a imprensa separou as câmeras.",
    choices: [
      {
        id: "eat-pastel-naturally",
        text: "Comer o pastel e conversar sem roteiro",
        resultText:
          "O presidente queimou a língua, ouviu reclamações e saiu com cheiro de fritura e alguns pontos de popularidade.",
        effects: {
          indicators: { people: 9, congress: 0, economy: 1, stability: 3 },
          factions: { press: 4, unions: 3, business: 1 },
          politics: { popularParticipation: 7, personalism: 1 },
          corruption: 0,
          personalWealth: -30
        }
      },
      {
        id: "stage-pastel-event",
        text: "Montar uma superprodução com figurantes",
        resultText:
          "O evento teve feira cenográfica, feirantes selecionados e um pastel que chegou em embalagem de luxo.",
        effects: {
          indicators: { people: 2, congress: 2, economy: -2, stability: 1 },
          factions: { press: -6 },
          politics: { personalism: 10 },
          corruption: 5,
          personalWealth: 0
        },
        futureEffect: {
          afterMonths: 2,
          message:
            "Uma produtora revelou quanto o governo gastou para encenar a visita espontânea à feira.",
          effects: {
            indicators: { people: -8, congress: -2 },
            corruption: 4
          }
        }
      },
      {
        id: "refuse-street-food",
        text: "Recusar: a segurança não aprovou o óleo",
        resultText:
          "O presidente passou reto. Dona Cida declarou que o pastel enfrentou coisa pior e continuou vivo.",
        effects: {
          indicators: { people: -6, congress: 1, economy: 0, stability: 2 },
          factions: { press: -2 },
          politics: { popularParticipation: -6 },
          corruption: 0,
          personalWealth: 0
        }
      },
    ]
  }
];
