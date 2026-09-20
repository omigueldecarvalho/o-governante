import {
  IDEOLOGIES
} from "../config/ideologies.js";

function clamp(
  value,
  minimum = 0,
  maximum = 100
) {
  return Math.max(
    minimum,
    Math.min(
      maximum,
      Number(value ?? 0)
    )
  );
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function convertScoreToPercentage(
  score
) {
  /*
   * Pontuação 0 fica no centro: 50%.
   * Cada ponto movimenta 4%.
   */
  return clamp(
    Math.round(
      50 +
      Number(score ?? 0) * 4
    )
  );
}

export function createPoliticalCompassState() {
  return {
    economicPosition: 0,
    socialPosition: 0,
    authoritarianism: 0,
    popularParticipation: 0,
    personalism: 0
  };
}

export function applyPoliticalCompassAnswer(
  currentState,
  question,
  answer
) {
  const state = {
    ...createPoliticalCompassState(),
    ...currentState
  };

  const effects =
    answer?.effects ?? {};

  Object.entries(effects).forEach(
    ([key, value]) => {
      state[key] =
        Number(state[key] ?? 0) +
        Number(value ?? 0);
    }
  );

  return state;
}

function findGameIdeology(
  possibleNames
) {
  const normalizedNames =
    possibleNames.map(
      normalizeText
    );

  return IDEOLOGIES.find(
    (ideology) => {
      const normalizedId =
        normalizeText(
          ideology.id
        );

      const normalizedName =
        normalizeText(
          ideology.name
        );

      return normalizedNames.some(
        (name) =>
          normalizedId === name ||
          normalizedName === name
      );
    }
  );
}

function createIdeologyResult({
  id,
  names,
  name,
  description,
  epithet
}) {
  const gameIdeology =
    findGameIdeology(names);

  return {
    ideologyId:
      gameIdeology?.id ?? id,

    ideology: {
      id:
        gameIdeology?.id ?? id,

      name:
        gameIdeology?.name ??
        name,

      description:
        gameIdeology?.description ??
        description
    },

    ideologyName:
      gameIdeology?.name ??
      name,

    description:
      gameIdeology?.description ??
      description,

    epithet
  };
}

function determineIdeology(
  percentages
) {
  const {
    economicPosition,
    socialPosition,
    authoritarianism,
    popularParticipation,
    personalism
  } = percentages;

  /*
   * Autoritarismo personalista e
   * conservador.
   */
  if (
    authoritarianism >= 72 &&
    personalism >= 68 &&
    socialPosition >= 58
  ) {
    return createIdeologyResult({
      id: "bolsonarism",

      names: [
        "bolsonarismo",
        "bolsonarism"
      ],

      name: "Bolsonarismo",

      description:
        "Você prefere um líder forte, valores conservadores e soluções diretas, especialmente quando as instituições começam a atrapalhar seus planos.",

      epithet:
        "O Patriota com senha do Wi-Fi americano"
    });
  }

  /*
   * Autoritarismo muito elevado sem
   * posição econômica determinante.
   */
  if (
    authoritarianism >= 82 &&
    personalism >= 72
  ) {
    return {
      ideologyId:
        "dictatorship",

      ideology: {
        id: "dictatorship",
        name: "Ditadura",
        description:
          "Você começou respondendo um teste político e terminou planejando fechar o Congresso. Democracia claramente não era uma prioridade."
      },

      ideologyName:
        "Ditadura",

      description:
        "Você começou respondendo um teste político e terminou planejando fechar o Congresso. Democracia claramente não era uma prioridade.",

      epithet:
        "O Democrata até ser contrariado"
    };
  }

  /*
   * Anarquismo
   */
  if (
    authoritarianism <= 30 &&
    personalism <= 35 &&
    popularParticipation >= 68
  ) {
    return createIdeologyResult({
      id: "anarchism",

      names: [
        "anarquismo",
        "anarchism"
      ],

      name: "Anarquismo",

      description:
        "Você desconfia de governos, líderes e instituições centralizadas. Para você, o poder deveria estar diretamente nas mãos das pessoas.",

      epithet:
        "O Inimigo Natural do Formulário"
    });
  }

  /*
   * Comunismo
   */
  if (
    economicPosition <= 22 &&
    popularParticipation >= 58
  ) {
    return createIdeologyResult({
      id: "communism",

      names: [
        "comunismo",
        "communism"
      ],

      name: "Comunismo",

      description:
        "Você defende uma transformação profunda da economia, maior controle coletivo dos recursos e forte participação dos trabalhadores.",

      epithet:
        "O Camarada do Grupo da Família"
    });
  }

  /*
   * Socialismo
   */
  if (
    economicPosition <= 33
  ) {
    return createIdeologyResult({
      id: "socialism",

      names: [
        "socialismo",
        "socialism"
      ],

      name: "Socialismo",

      description:
        "Você acredita que o Estado e a sociedade devem reduzir desigualdades, proteger trabalhadores e limitar a concentração econômica.",

      epithet:
        "O Taxador de Bilionário Imaginário"
    });
  }

  /*
   * Social-democracia
   */
  if (
    economicPosition <= 43 &&
    authoritarianism <= 62
  ) {
    return createIdeologyResult({
      id: "social-democracy",

      names: [
        "social-democracia",
        "social democracia",
        "socialdemocracy"
      ],

      name: "Social-democracia",

      description:
        "Você quer reduzir desigualdades e fortalecer serviços públicos, mas sem derrubar completamente o capitalismo.",

      epithet:
        "O Revolucionário depois do Expediente"
    });
  }

  /*
   * Liberalismo social
   */
  if (
    economicPosition >= 66 &&
    socialPosition <= 43 &&
    authoritarianism <= 45
  ) {
    return createIdeologyResult({
      id: "liberalism",

      names: [
        "liberalismo",
        "liberalism",
        "liberal"
      ],

      name: "Liberalismo",

      description:
        "Você defende maior liberdade econômica e individual, preferindo que o Estado interfira menos na economia e na vida privada.",

      epithet:
        "O Livre Mercado com Cupom de Desconto"
    });
  }

  /*
   * Conservadorismo
   */
  if (
    socialPosition >= 65 &&
    authoritarianism >= 52
  ) {
    return createIdeologyResult({
      id: "conservatism",

      names: [
        "conservadorismo",
        "conservatism",
        "conservador"
      ],

      name: "Conservadorismo",

      description:
        "Você valoriza tradição, ordem e estabilidade, ainda que algumas mudanças sociais precisem esperar mais um século ou dois.",

      epithet:
        "O Fiscal de Costume Alheio"
    });
  }

  /*
   * Direita liberal
   */
  if (
    economicPosition >= 66
  ) {
    return createIdeologyResult({
      id: "right",

      names: [
        "direita",
        "right",
        "centro-direita",
        "centro direita"
      ],

      name: "Direita liberal",

      description:
        "Você acredita na iniciativa privada, responsabilidade individual e menor intervenção econômica do Estado.",

      epithet:
        "O Empreendedor sem CNPJ"
    });
  }

  /*
   * Centro-esquerda
   */
  if (
    economicPosition < 48
  ) {
    return createIdeologyResult({
      id: "center-left",

      names: [
        "centro-esquerda",
        "centro esquerda",
        "centerleft"
      ],

      name: "Centro-esquerda",

      description:
        "Você prefere reformas sociais e redução das desigualdades, mas sem transformar completamente o sistema.",

      epithet:
        "O Radical que Leu o Regulamento"
    });
  }

  /*
   * Centro-direita
   */
  if (
    economicPosition > 57
  ) {
    return createIdeologyResult({
      id: "center-right",

      names: [
        "centro-direita",
        "centro direita",
        "centerright"
      ],

      name: "Centro-direita",

      description:
        "Você valoriza o mercado e a responsabilidade fiscal, mas ainda aceita alguma atuação social do Estado.",

      epithet:
        "O Liberal que Aceita um Benefício"
    });
  }

  /*
   * Centro
   */
  return createIdeologyResult({
    id: "center",

    names: [
      "centro",
      "center",
      "centrismo"
    ],

    name: "Centro",

    description:
      "Você prefere conciliar posições diferentes e costuma encontrar argumentos razoáveis nos dois lados — ou apenas não quer arrumar confusão.",

    epithet:
      "O Em Cima do Muro com Vista Panorâmica"
  });
}

export function getPoliticalCompassEpithet(
  result
) {
  return (
    result?.epithet ??
    "O Eleitor Misterioso"
  );
}

export function calculatePoliticalCompassResult(
  state
) {
  const safeState = {
    ...createPoliticalCompassState(),
    ...(state ?? {})
  };

  const percentages = {
    economicPosition:
      convertScoreToPercentage(
        safeState.economicPosition
      ),

    socialPosition:
      convertScoreToPercentage(
        safeState.socialPosition
      ),

    authoritarianism:
      convertScoreToPercentage(
        safeState.authoritarianism
      ),

    popularParticipation:
      convertScoreToPercentage(
        safeState.popularParticipation
      ),

    personalism:
      convertScoreToPercentage(
        safeState.personalism
      )
  };

  const ideologicalResult =
    determineIdeology(
      percentages
    );

  return {
    ...ideologicalResult,

    profile:
      structuredClone(safeState),

    percentages,

    completedAt:
      new Date().toISOString()
  };
}