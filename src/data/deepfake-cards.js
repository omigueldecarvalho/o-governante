export const DEEPFAKE_CARDS = [
  {
    id: "bolsonaro-vaccine-doenca",

    character: {
      name: "Jair Bolsocloro",
      realName: "Jair Bolsonaro",
      group: "right"
    },

    statement:
      "Pessoas vacinadas contra a Covid-19 estariam desenvolvendo jacareismo.",

    context:
      "A declaração foi feita durante uma transmissão ao vivo em outubro de 2021.",

    answer: "false",
    difficulty: "easy",

    explanation:
      "Não existe evidência de que vacinas contra a Covid-19 causem jacareismo. A declaração foi classificada como falsa e o vídeo foi removido por plataformas.",

    sources: [
      {
        label: "Reuters — vídeo removido por alegação falsa",
        url:
          "https://www.reuters.com/world/americas/facebook-takes-down-bolsonaro-video-over-false-vaccine-claim-2021-10-25/",
        type: "fact-check"
      }
    ],

    verifiedAt: "2026-09-19"
  },

  {
    id: "bolsonaro-ambassadors-election",

    character: {
      name: "Jair Bolsocloro",
      realName: "Jair Bolsonaro",
      group: "right"
    },

    statement:
      "O então presidente utilizou uma reunião com embaixadores para atacar, sem provas, o sistema eleitoral brasileiro.",

    context:
      "O episódio foi analisado pela Justiça Eleitoral no julgamento que declarou Bolsonaro inelegível.",

    answer: "documented",
    difficulty: "medium",

    explanation:
      "O TSE reconheceu abuso de poder político e uso indevido dos meios de comunicação no episódio da reunião com embaixadores.",

    sources: [
      {
        label: "TSE — julgamento da reunião com embaixadores",
        url:
          "https://www.tse.jus.br/comunicacao/noticias/2023/Junho/por-maioria-de-votos-tse-declara-bolsonaro-inelegivel-por-8-anos",
        type: "official"
      }
    ],

    verifiedAt: "2026-09-19"
  },

  {
    id: "fake-lula-unisex-bathrooms",

    character: {
      name: "Luiz Inácio Molusco",
      realName: "Luiz Inácio Lula da Silva",
      group: "left"
    },

    statement:
      "Lula sancionou uma lei que cria banheiros sem definição de gênero em escolas e espaços públicos.",

    context:
      "A publicação citava uma suposta lei federal e circulou nas redes sociais.",

    answer: "false",
    difficulty: "easy",

    explanation:
      "A lei citada nas publicações não existe. Não havia registro dessa norma nos arquivos oficiais do governo federal.",

    sources: [
      {
        label: "UOL Confere — a suposta lei não existe",
        url:
          "https://noticias.uol.com.br/confere/ultimas-noticias/2026/09/03/lula-nao-sancionou-lei-que-institui-banheiros-unissex.ghtm",
        type: "fact-check"
      }
    ],

    verifiedAt: "2026-09-19"
  },
  {
  id: "gayer-traffic-case",

  character: {
    name: "Gustavo Gaiato",
    realName: "Gustavo Gayer",
    group: "right"
  },

  statement:
    "Uma deputada afirmou que Gustavo Gayer dirigia alcoolizado em um acidente ocorrido em 2000 que matou duas pessoas e deixou outra paraplégica.",

  context:
    "Gayer apresentou uma queixa-crime contra a deputada que fez a publicação. O caso chegou ao Supremo Tribunal Federal.",

  answer: "judicial",
  difficulty: "hard",

  explanation:
    "O STF rejeitou a queixa-crime apresentada por Gayer. A decisão considerou a imunidade parlamentar da deputada e não deve ser apresentada como uma nova condenação criminal de Gayer pelo acidente.",

  sources: [
    {
      label:
        "CNN Brasil — STF rejeita queixa-crime apresentada por Gayer",
      url:
        "https://www.cnnbrasil.com.br/politica/stf-nega-queixa-crime-de-gayer-contra-deputada-que-o-acusou-de-homicidio/",
      type: "judicial-report"
    }
  ],

  verifiedAt: "2026-09-19"
},

{
  id: "ze-trovao-former-partner",

  character: {
    name: "Mé do Trovão",
    realName: "Zé Trovão",
    group: "right"
  },

  statement:
    "Zé Trovão foi condenado na esfera cível a indenizar sua ex-companheira em R$ 50 mil por danos morais.",

  context:
    "A sentença mencionou episódios de violência física, verbal e difamação. O processo foi divulgado em 2025.",

  answer: "judicial",
  difficulty: "medium",

  explanation:
    "A informação se refere a uma decisão cível de indenização por danos morais. Ela não deve ser apresentada como condenação criminal, e o status de eventuais recursos deve sempre ser atualizado.",

  sources: [
    {
      label:
        "G1 — decisão envolvendo Zé Trovão e sua ex-companheira",
      url:
        "https://g1.globo.com/sc/santa-catarina/noticia/2025/09/01/deputado-ze-trovao-condenado-pagar-50-mil-ex-companheira-danos-morais.ghtml",
      type: "judicial-report"
    }
  ],

  verifiedAt: "2026-09-19"
},

{
  id: "bilynskyj-pt-narcotraffic",

  character: {
    name: "Paulo Billijeans",
    realName: "Paulo Bilynskyj",
    group: "right"
  },

  statement:
    "Paulo Bilynskyj associou o Partido dos Trabalhadores ao financiamento pelo narcotráfico e foi condenado a pagar indenização à sigla.",

  context:
    "A Justiça do Distrito Federal determinou o pagamento de R$ 15 mil por danos morais.",

  answer: "judicial",
  difficulty: "medium",

  explanation:
    "Tratava-se de uma decisão de primeira instância por danos morais. A defesa afirmou que recorreria, portanto o card não deve apresentar a decisão como definitiva.",

  sources: [
    {
      label:
        "Veja — decisão sobre associação do PT ao narcotráfico",
      url:
        "https://veja.abril.com.br/politica/deputado-bolsonarista-e-condenado-a-pagar-r-15-mil-ao-pt/",
      type: "judicial-report"
    }
  ],

  verifiedAt: "2026-09-19"
},

{
  id: "nikolas-fake-federal-police-document",

  character: {
    name: "Nícolas Ferreiro",
    realName: "Nikolas Ferreira",
    group: "right"
  },

  statement:
    "Nikolas Ferreira compartilhou um documento falso atribuído à Polícia Federal que supostamente o isentava de irregularidades.",

  context:
    "O arquivo circulou como se fosse um relatório oficial, mas apresentava indícios de geração por inteligência artificial, erros e inconsistências.",

  answer: "documented",
  difficulty: "medium",

  explanation:
    "A Polícia Federal negou ter produzido o documento. A assessoria do deputado afirmou que ele desconhecia a falsidade, apenas republicou o material e o apagou após ser informado.",

  sources: [
    {
      label:
        "UOL Confere — documento falso atribuído à Polícia Federal",
      url:
        "https://noticias.uol.com.br/confere/ultimas-noticias/2026/09/04/falso-documento-pf-nikolas-ferreira.ghtm",
      type: "fact-check"
    },

    {
      label:
        "Projeto Comprova — documento foi produzido com IA",
      url:
        "https://noticias.uol.com.br/comprova/ultimas-noticias/2026/09/08/desinformacao-falso-ia-documento-pf-nikolas-ferreira-vorcaro.ghtm",
      type: "fact-check"
    }
  ],

  verifiedAt: "2026-09-19"
},

{
  id: "fake-lula-ineligible-ai-video",

  character: {
    name: "Luiz Inácio Molusco",
    realName: "Luiz Inácio Lula da Silva",
    group: "left"
  },

  statement:
    "André Mendonça declarou Lula inelegível e o Jornal Nacional anunciou a decisão.",

  context:
    "Um vídeo imitando uma reportagem televisiva circulou nas redes sociais com áudio manipulado por inteligência artificial.",

  answer: "false",
  difficulty: "easy",

  explanation:
    "A declaração e a reportagem não existiram. O vídeo reutilizou imagens reais, mas teve o áudio adulterado. O TSE também confirmou que a informação era falsa.",

  sources: [
    {
      label:
        "UOL Confere — vídeo sobre inelegibilidade foi adulterado",
      url:
        "https://noticias.uol.com.br/confere/ultimas-noticias/2026/09/16/falso-mendonca-declarou-lula-inelegivel-video-ia.ghtm",
      type: "fact-check"
    }
  ],

  verifiedAt: "2026-09-19"
}
];

export const DEEPFAKE_ANSWERS = {
  false: {
    icon: "❌",
    label: "Falso"
  },

  misleading: {
    icon: "⚠️",
    label: "Enganoso"
  },

  documented: {
    icon: "✅",
    label: "Documentado"
  },

  judicial: {
    icon: "⚖️",
    label: "Caso judicial"
  },
  
};