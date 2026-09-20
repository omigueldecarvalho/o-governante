import {
  GAME_CONFIG
} from "../config/game-config.js";

import {
  IDEOLOGIES
} from "../config/ideologies.js";

import {
  ENDINGS
} from "../data/endings.js";

import {
  calculateFinalIdeology,
  calculatePoliticalCoherence,
  generateEpithet
} from "./political-analysis.js";

function numberOrZero(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function getDecisionsTaken(
  gameState
) {
  return numberOrZero(
    gameState.government
      ?.decisionsTaken ??
    gameState.government
      ?.decisions
  );
}

function getMonthsPerDecision(
  gameState
) {
  return Math.max(
    1,
    numberOrZero(
      gameState.settings
        ?.monthsPerDecision ?? 1
    )
  );
}

function getMandateLimit(
  gameState
) {
  const customLimit =
    numberOrZero(
      gameState.settings
        ?.maximumDecisions
    );

  if (customLimit > 0) {
    return customLimit;
  }

  const configuredLimit =
    numberOrZero(
      GAME_CONFIG.mandate
        ?.totalMonths
    );

  /*
   * Evita que uma configuração ausente
   * encerre o governo imediatamente.
   */
  return configuredLimit > 0
    ? configuredLimit
    : 48;
}

function getElapsedMonths(
  gameState
) {
  const savedElapsedMonths =
    numberOrZero(
      gameState.government
        ?.elapsedMonths
    );

  if (savedElapsedMonths > 0) {
    return savedElapsedMonths;
  }

  return (
    getDecisionsTaken(
      gameState
    ) *
    getMonthsPerDecision(
      gameState
    )
  );
}

function createDurationLabel(
  elapsedMonths
) {
  const years =
    Math.floor(
      elapsedMonths / 12
    );

  const months =
    elapsedMonths % 12;

  if (years <= 0) {
    return `${months} ${
      months === 1
        ? "mês"
        : "meses"
    }`;
  }

  if (months <= 0) {
    return `${years} ${
      years === 1
        ? "ano"
        : "anos"
    }`;
  }

  return `${years} ${
    years === 1
      ? "ano"
      : "anos"
  } e ${months} ${
    months === 1
      ? "mês"
      : "meses"
  }`;
}

function findEndingById(
  endingId
) {
  return Object.values(
    ENDINGS
  ).find(
    (ending) =>
      ending.id === endingId
  );
}

function resolveCompletedMandateEnding(
  gameState
) {
  const indicators =
    gameState.indicators ?? {};

  const politics =
    gameState.politicalProfile ?? {};

  const people =
    numberOrZero(
      indicators.people
    );

  const congress =
    numberOrZero(
      indicators.congress
    );

  const economy =
    numberOrZero(
      indicators.economy
    );

  const stability =
    numberOrZero(
      indicators.stability
    );

  const corruption =
    numberOrZero(
      gameState.corruption
    );

  const personalWealth =
    numberOrZero(
      gameState.player
        ?.personalWealth
    );

  const authoritarianism =
    numberOrZero(
      politics.authoritarianism
    );

  const economicPosition =
    numberOrZero(
      politics.economicPosition
    );

  const popularParticipation =
    numberOrZero(
      politics.popularParticipation
    );

  /*
   * A ordem importa.
   * Finais mais específicos são
   * verificados primeiro.
   */

  if (
    corruption >= 70 &&
    personalWealth >= 1500000
  ) {
    return (
      ENDINGS.kleptocracy ??
      ENDINGS.mandateCompleted
    );
  }

  if (
    authoritarianism >= 65 &&
    stability >= 55
  ) {
    return (
      ENDINGS.dictatorship ??
      ENDINGS.mandateCompleted
    );
  }

  if (
    authoritarianism <= -50 &&
    popularParticipation >= 75
  ) {
    return (
      ENDINGS.anarchistCommune ??
      ENDINGS.mandateCompleted
    );
  }

  if (
    economicPosition <= -55 &&
    popularParticipation >= 60 &&
    people >= 55
  ) {
    return (
      ENDINGS.socialistRevolution ??
      ENDINGS.mandateCompleted
    );
  }

  if (
    economy >= 85 &&
    stability >= 55
  ) {
    return (
      ENDINGS.economicMiracle ??
      ENDINGS.mandateCompleted
    );
  }

  if (people >= 85) {
    return (
      ENDINGS.popularLegacy ??
      ENDINGS.mandateCompleted
    );
  }

  if (
    people >= 60 &&
    congress >= 55 &&
    stability >= 60 &&
    corruption <= 35
  ) {
    return (
      ENDINGS.democraticLegacy ??
      ENDINGS.mandateCompleted
    );
  }

  return ENDINGS.mandateCompleted;
}

export function checkEnding(
  gameState
) {
  if (!gameState) {
    return null;
  }

  /*
   * Evita calcular outro final para
   * uma partida já encerrada.
   */
  if (
    gameState.finished &&
    gameState.ending
  ) {
    return (
      findEndingById(
        gameState.ending
      ) ?? null
    );
  }

  /*
   * Finais definidos diretamente
   * por decisões e minigames.
   */
  if (gameState.forcedEnding) {
    const forcedEnding =
      findEndingById(
        gameState.forcedEnding
      );

    if (forcedEnding) {
      return forcedEnding;
    }
  }

  /*
   * Acidente suspeito.
   */
  if (
    gameState.flags
      ?.suspiciousAccident
  ) {
    return (
      ENDINGS.suspiciousAccident ??
      ENDINGS.institutionalRupture
    );
  }

  /*
   * Ocupação estrangeira.
   */
  if (
    gameState.flags
      ?.foreignOccupation
  ) {
    return (
      ENDINGS.foreignOccupation ??
      ENDINGS.institutionalRupture
    );
  }

  const indicators =
    gameState.indicators ?? {};

  /*
   * Colapso dos indicadores.
   */
  if (
    numberOrZero(
      indicators.people
    ) <= 0
  ) {
    return ENDINGS.popularRevolt;
  }

  if (
    numberOrZero(
      indicators.congress
    ) <= 0
  ) {
    /*
     * Mantém compatibilidade caso
     * o endings.js esteja usando
     * a chave escrita como impement.
     */
    return (
      ENDINGS.impeachment ??
      ENDINGS.impement ??
      ENDINGS.institutionalRupture
    );
  }

  if (
    numberOrZero(
      indicators.economy
    ) <= 0
  ) {
    return ENDINGS.economicCollapse;
  }

  if (
    numberOrZero(
      indicators.stability
    ) <= 0
  ) {
    return ENDINGS.institutionalRupture;
  }

  if (
    numberOrZero(
      gameState.corruption
    ) >= 100
  ) {
    return ENDINGS.corruptionPrison;
  }

  /*
   * Final normal do mandato.
   *
   * No modo clássico, o limite vem
   * do GAME_CONFIG.
   *
   * Na Simulação Expressa poderá ser
   * definido como oito decisões.
   */
  if (
    getDecisionsTaken(
      gameState
    ) >=
    getMandateLimit(
      gameState
    )
  ) {
    return resolveCompletedMandateEnding(
      gameState
    );
  }

  return null;
}

export function createFinalReport(
  gameState,
  ending
) {
  const isInitialDefeat =
    ending.id ===
    "initial-election-defeat";

  const historyDecisionCount =
    Array.isArray(
      gameState.history
    )
      ? gameState.history.filter(
          (item) =>
            item.type ===
            "decision"
        ).length
      : 0;

  const decisionsTaken =
    Math.max(
      historyDecisionCount,
      getDecisionsTaken(
        gameState
      )
    );

  const elapsedMonths =
    getElapsedMonths(
      gameState
    );

  if (isInitialDefeat) {
    return {
      version: 1,

      ending: {
        id: ending.id,
        icon: ending.icon,
        title: ending.title,
        description:
          ending.description,

        sharePhrase:
          ending.sharePhrase ??
          ending.description,

        tone:
          ending.tone ??
          "defeat"
      },

      elected: false,

      player: {
        name:
          gameState.player
            ?.name ?? "Candidato",

        partyName:
          gameState.player
            ?.partyName ?? "",

        partyAcronym:
          gameState.player
            ?.partyAcronym ?? ""
      },

      decisionsTaken: 0,
      elapsedMonths: 0,
      durationLabel:
        "Não tomou posse",

      government: {
        decisionsTaken: 0,
        elapsedMonths: 0,
        durationLabel:
          "Não tomou posse",
        gameMode:
          gameState.settings
            ?.gameMode ??
          "classic"
      },

      generatedAt:
        new Date().toISOString()
    };
  }

  const finalIdeology =
    calculateFinalIdeology(
      gameState
    );

  const coherence =
    calculatePoliticalCoherence(
      gameState,
      finalIdeology
    );

  const epithet =
    generateEpithet(
      gameState,
      finalIdeology
    );

  const initialIdeology =
    IDEOLOGIES.find(
      (ideology) =>
        ideology.id ===
        gameState.player
          ?.initialIdeology
    );

  const achievements =
    gameState.achievements
      ?.history ?? [];

  const rival =
    gameState.government
      ?.politicalRival;

  return {
    version: 1,

    ending: {
      id: ending.id,
      icon: ending.icon,
      title: ending.title,
      description:
        ending.description,

      sharePhrase:
        ending.sharePhrase ??
        ending.description,

      tone:
        ending.tone ??
        "neutral"
    },

    elected: true,

    player: {
      name:
        gameState.player
          ?.name ?? "Governante",

      partyName:
        gameState.player
          ?.partyName ?? "",

      partyAcronym:
        gameState.player
          ?.partyAcronym ?? "",

      epithet,

      personalWealth:
        numberOrZero(
          gameState.player
            ?.personalWealth
        )
    },

    ideology: {
      initialId:
        initialIdeology?.id ??
        null,

      initialName:
        initialIdeology?.name ??
        "Indefinida",

      finalId:
        finalIdeology.id,

      finalName:
        finalIdeology.name,

      finalDescription:
        finalIdeology.description,

      coherence: {
        title:
          coherence.title,

        description:
          coherence.description
      }
    },

    indicators: {
      people:
        numberOrZero(
          gameState.indicators
            ?.people
        ),

      congress:
        numberOrZero(
          gameState.indicators
            ?.congress
        ),

      economy:
        numberOrZero(
          gameState.indicators
            ?.economy
        ),

      stability:
        numberOrZero(
          gameState.indicators
            ?.stability
        ),

      corruption:
        numberOrZero(
          gameState.corruption
        )
    },

    government: {
      decisionsTaken,
      elapsedMonths,

      durationLabel:
        createDurationLabel(
          elapsedMonths
        ),

      gameMode:
        gameState.settings
          ?.gameMode ??
        "classic"
    },

    achievements: {
      total:
        achievements.length,

      unlocked:
        achievements.map(
          (achievement) => ({
            id:
              achievement.id,

            icon:
              achievement.icon,

            name:
              achievement.name
          })
        )
    },

    rival:
      rival
        ? {
            id:
              rival.id,

            name:
              rival.name,

            nickname:
              rival.nickname,

            popularity:
              numberOrZero(
                rival.popularity
              ),

            scandals:
              numberOrZero(
                rival.scandals
              )
          }
        : null,

    flag:
      gameState.country
        ?.flag ?? null,

    generatedAt:
      new Date().toISOString()
  };
}

export function finishGame(
  currentGameState,
  ending
) {
  const gameState =
    structuredClone(
      currentGameState
    );

  gameState.finished = true;
  gameState.ending = ending.id;

  gameState.endedAt =
    new Date().toISOString();

  /*
   * Snapshot utilizado pelo histórico,
   * tela final e compartilhamento.
   */
  gameState.finalReport =
    createFinalReport(
      gameState,
      ending
    );

  return gameState;
}
