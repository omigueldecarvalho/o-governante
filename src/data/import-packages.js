export const IMPORT_PACKAGES = [
  {
    id: "cheap-shirt",
    icon: "👚",
    product: "Blusinha internacional",
    declaredValue: 32,
    description:
      "Uma blusinha, dois adesivos e uma promessa de entrega em sete dias.",

    correctAction: "tax",

    reactions: {
      release:
        "A compradora comemorou. O varejo nacional iniciou uma nota de repúdio.",

      tax:
        "A taxa custou quase outra blusinha. O governo arrecadou e a internet pegou fogo.",

      seize:
        "A Receita apreendeu uma peça de poliéster. A operação foi considerada um enorme sucesso."
    }
  },

  {
    id: "gift-phone",
    icon: "📱",
    product: "Presente da tia",
    declaredValue: 12,
    description:
      "O pacote diz conter um chaveiro, mas possui exatamente o formato de um celular.",

    correctAction: "seize",

    reactions: {
      release:
        "O chaveiro ligou, acessou a internet e recebeu uma atualização do sistema.",

      tax:
        "O presente foi tributado pelo valor estimado. A tia desapareceu das redes sociais.",

      seize:
        "A fiscalização encontrou um celular de última geração dentro do inocente chaveiro."
    }
  },

  {
    id: "imported-medicine",
    icon: "💊",
    product: "Medicamento importado",
    declaredValue: 180,
    description:
      "Medicamento de uso pessoal acompanhado de receita e documentação.",

    correctAction: "release",

    reactions: {
      release:
        "O medicamento chegou ao paciente sem atraso.",

      tax:
        "A cobrança gerou revolta e questionamentos sobre o acesso à saúde.",

      seize:
        "A apreensão atrasou o tratamento e virou notícia nacional."
    }
  },

  {
    id: "influencer-haul",
    icon: "📸",
    product: "Recebidos da influenciadora",
    declaredValue: 1,
    description:
      "Quarenta peças, seis bolsas e a descrição: amostra sem valor comercial.",

    correctAction: "tax",

    reactions: {
      release:
        "O vídeo de recebidos alcançou três milhões de visualizações sem mencionar a fiscalização.",

      tax:
        "A influenciadora publicou dezessete stories dizendo que vai morar no Paraguai.",

      seize:
        "A apreensão virou uma transmissão ao vivo chamada Ditadura da Alfândega."
    }
  },

  {
    id: "contraband-box",
    icon: "🚬",
    product: "Caixa sem remetente",
    declaredValue: 0,
    description:
      "A declaração informa apenas: não abrir perto de policiais.",

    correctAction: "seize",

    reactions: {
      release:
        "A caixa desapareceu antes mesmo de sair do centro de distribuição.",

      tax:
        "O governo tentou cobrar imposto, mas ninguém apareceu para pagar.",

      seize:
        "A fiscalização encontrou produtos ilegais e uma agenda cheia de contatos políticos."
    }
  },

  {
    id: "national-product",
    icon: "🩴",
    product: "Produto nacional disfarçado",
    declaredValue: 70,
    description:
      "Fabricado no Brasil, enviado ao exterior e comprado novamente por um brasileiro.",

    correctAction: "release",

    reactions: {
      release:
        "O produto completou sua viagem internacional e voltou para casa.",

      tax:
        "O brasileiro pagou imposto para importar o que havia sido fabricado no próprio país.",

      seize:
        "A fiscalização apreendeu o produto por excesso de brasilidade."
    }
  },

  {
    id: "adviser-suitcase",
    icon: "💼",
    product: "Encomenda do assessor",
    declaredValue: 5,
    description:
      "Uma mala pesada identificada como material de escritório sem interesse público.",

    correctAction: "seize",

    reactions: {
      release:
        "O assessor agradeceu e prometeu lembrar do seu nome na próxima nomeação.",

      tax:
        "A taxa foi paga imediatamente em dinheiro vivo.",

      seize:
        "A mala continha dinheiro, contratos e um pen drive chamado NÃO ABRIR."
    }
  }
];

export const IMPORT_ACTIONS = {
  release: {
    icon: "📦",
    label: "Liberar",
    key: "A"
  },

  tax: {
    icon: "💸",
    label: "Taxar",
    key: "S"
  },

  seize: {
    icon: "🚨",
    label: "Apreender",
    key: "D"
  }
};