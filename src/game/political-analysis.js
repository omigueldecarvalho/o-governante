import { IDEOLOGIES } from "../config/ideologies.js";

function findIdeology(id) {
  const ideology = IDEOLOGIES.find(
    (item) => item.id === id
  );

  return {
    id: ideology?.id ?? id,
    name: ideology?.name ?? id,

    description:
      ideology?.description ??
      "O perfil político foi definido pelas decisões tomadas durante o governo."
  };
}

export function calculateFinalIdeology(
  gameState
) {
  const profile =
    gameState.politicalProfile ?? {};

  const economicPosition =
    profile.economicPosition ?? 0;

  const socialPosition =
    profile.socialPosition ?? 0;

  const authoritarianism =
    profile.authoritarianism ?? 0;

  const popularParticipation =
    profile.popularParticipation ?? 0;

  const personalism =
    profile.personalism ?? 0;

  if (authoritarianism >= 60) {
    return {
      id: "dictatorship",
      name: "Ditadura",

      description:
        "Seu governo abandonou os limites democráticos e concentrou o poder."
    };
  }

  if (
    personalism >= 55 &&
    authoritarianism >= 35 &&
    economicPosition >= 5
  ) {
    return {
      id: "bolsonarism",
      name: "Bolsonarismo",

      description:
        "Seu governo foi marcado pelo personalismo, confronto institucional e mobilização constante."
    };
  }

  if (
    popularParticipation >= 55 &&
    authoritarianism <= 20
  ) {
    return {
      id: "anarchism",
      name: "Anarquismo",

      description:
        "Seu governo descentralizou o poder e fortaleceu organizações populares."
    };
  }

  if (economicPosition <= -55) {
    return {
      id: "communism",
      name: "Comunismo",

      description:
        "Seu governo adotou forte controle coletivo e estatal da economia."
    };
  }

  if (economicPosition <= -25) {
    return findIdeology("left");
  }

  if (economicPosition <= -10) {
    return findIdeology("center-left");
  }

  if (economicPosition < 10) {
    return findIdeology("center");
  }

  if (economicPosition < 30) {
    return findIdeology("center-right");
  }

  if (
    economicPosition >= 30 ||
    socialPosition >= 30
  ) {
    return findIdeology("right");
  }

  return findIdeology("center");
}

export function calculatePoliticalCoherence(
  gameState,
  finalIdeology
) {
  const initialIdeology =
    gameState.player.initialIdeology;

  const corruption =
    gameState.corruption ?? 0;

  const profile =
    gameState.politicalProfile ?? {};

  const personalism =
    profile.personalism ?? 0;

  const authoritarianism =
    profile.authoritarianism ?? 0;

  if (
    corruption >= 50 &&
    finalIdeology.id !== initialIdeology
  ) {
    return {
      id: "corrupted",

      title: "Corrompido pelo sistema",

      description:
        "Você abandonou suas promessas enquanto acumulava poder e suspeitas."
    };
  }

  if (authoritarianism >= 60) {
    return {
      id: "power-corrupted",

      title: "Corrompido pelo poder",

      description:
        "Você começou com propostas políticas e terminou concentrando o poder."
    };
  }

  if (finalIdeology.id === initialIdeology) {
    if (corruption >= 50) {
      return {
        id: "corrupt-faithful",

        title: "Fiel à ideologia, nem tanto à ética",

        description:
          "Seu discurso político permaneceu coerente, mas seu patrimônio contou outra história."
      };
    }

    return {
      id: "faithful",

      title: "Fiel aos próprios ideais",

      description:
        "Mesmo pressionado, seu governo permaneceu próximo das propostas iniciais."
    };
  }

  if (
    corruption >= 35 ||
    personalism >= 50
  ) {
    return {
      id: "system",

      title: "Engolido pelo sistema",

      description:
        "As alianças e ambições alteraram profundamente seu projeto inicial."
    };
  }

  return {
    id: "pragmatic",

    title: "Pragmático ou vira-casaca?",

    description:
      "Seu governo terminou distante da ideologia anunciada durante a eleição."
  };
}

export function generateEpithet(
  gameState,
  finalIdeology
) {
  const name =
    gameState.player.name;

  const indicators =
    gameState.indicators;

  const wealth =
    gameState.player.personalWealth ?? 0;

  const corruption =
    gameState.corruption ?? 0;

  const profile =
    gameState.politicalProfile ?? {};

  const authoritarianism =
    profile.authoritarianism ?? 0;

  const economicPosition =
    profile.economicPosition ?? 0;

  if (
    corruption >= 70 &&
    wealth >= 1000000
  ) {
    return `${name}, o Humilde Milionário`;
  }

  if (corruption >= 70) {
    return `${name}, o Mão-Leve`;
  }

  if (authoritarianism >= 70) {
    return `${name}, o Temporariamente Eterno`;
  }

  if (finalIdeology.id === "anarchism") {
    return `${name}, o Governante sem Governo`;
  }

  if (finalIdeology.id === "communism") {
    return `${name}, o Camarada Supremo`;
  }

  if (economicPosition >= 50) {
    return `${name}, o Privatizador de Calçadas`;
  }

  if (indicators.economy >= 80) {
    return `${name}, o Mago do PIB`;
  }

  if (indicators.economy <= 20) {
    return `${name}, o Inimigo da Calculadora`;
  }

  if (indicators.people >= 80) {
    return `${name}, o Pai do Povo`;
  }

  if (indicators.people <= 20) {
    return `${name}, o Vaiado`;
  }

  if (indicators.congress >= 80) {
    return `${name}, o Rei das Emendas`;
  }

  if (indicators.congress <= 20) {
    return `${name}, o Sem Base`;
  }

  if (wealth >= 1000000) {
    return `${name}, o Empreendedor Público`;
  }

  return `${name}, o Inexplicavelmente Competente`;
}

export function getIndicatorLabel(
  indicator,
  value
) {
  const classifications = {
    corruption: [
      [0, "Incorruptível até segunda ordem"],
      [10, "Coincidências patrimoniais"],
      [29, "Sob suspeita"],
      [49, "Roubou, mas fez"],
      [69, "Profissional da política"],
      [89, "Ladrão de estimação"],
      [99, "Dono oculto do país"],
      [100, "Caso de estudo da Polícia Federal"]
    ],

    people: [
      [0, "Procurado pela população"],
      [20, "Só a família aprova"],
      [40, "Vaiado em estádio"],
      [60, "Popularidade razoável"],
      [80, "Líder das massas"],
      [100, "Culto à personalidade"]
    ],

    congress: [
      [0, "Impeachment protocolado"],
      [20, "Sem base"],
      [40, "Negociação difícil"],
      [60, "Base governista"],
      [80, "Rei das emendas"],
      [100, "Congresso decorativo"]
    ],

    economy: [
      [0, "Escambo oficializado"],
      [20, "Calculadora em chamas"],
      [40, "Sobrevivendo"],
      [60, "Crescimento moderado"],
      [80, "Mago do PIB"],
      [100, "Milagre econômico"]
    ],

    stability: [
      [0, "Ruptura institucional"],
      [20, "Crise permanente"],
      [40, "Brasília em alerta"],
      [60, "Instituições funcionando"],
      [80, "Estabilidade democrática"],
      [100, "Paz estranhamente absoluta"]
    ]
  };

  const selectedClassifications =
    classifications[indicator] ?? [];

  const result = selectedClassifications.find(
    ([maximum]) => value <= maximum
  );

  return result?.[1] ?? "Sem classificação";
}