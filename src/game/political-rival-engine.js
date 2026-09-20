import {
  POLITICAL_RIVALS
} from "../data/political-rivals.js";

function numberOrZero(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function clamp(
  value,
  minimum = 0,
  maximum = 100
) {
  return Math.max(
    minimum,
    Math.min(maximum, value)
  );
}

function selectRandomItem(items) {
  return items[
    Math.floor(
      Math.random() * items.length
    )
  ];
}

export function ensurePoliticalRivalState(
  gameState
) {
  gameState.government ??= {};

  if (
    gameState.government
      .politicalRival
  ) {
    return gameState.government
      .politicalRival;
  }

  const initialIdeology =
    gameState.player
      ?.initialIdeology;

  /*
   * Evita, quando possível, um rival
   * com a mesma ideologia inicial.
   */
  const availableRivals =
    POLITICAL_RIVALS.filter(
      (rival) =>
        rival.ideology
          .toLowerCase() !==
        String(
          initialIdeology ?? ""
        ).toLowerCase()
    );

  const selectedRival =
    selectRandomItem(
      availableRivals.length > 0
        ? availableRivals
        : POLITICAL_RIVALS
    );

  const decisionsTaken =
    numberOrZero(
      gameState.government
        .decisionsTaken
    );

  gameState.government
    .politicalRival = {
      ...structuredClone(
        selectedRival
      ),

      popularity: 42,
      momentum: 0,
      scandals: 0,
      appearances: 0,

      defeated: false,

      lastAppearanceDecision:
        decisionsTaken,

      nextAppearanceDecision:
        decisionsTaken + 1
    };

  return gameState.government
    .politicalRival;
}

export function shouldTriggerRivalEvent(
  gameState
) {
  const rival =
    ensurePoliticalRivalState(
      gameState
    );

  if (rival.defeated) {
    return false;
  }

  const decisionsTaken =
    numberOrZero(
      gameState.government
        ?.decisionsTaken
    );

  return (
    decisionsTaken >=
    rival.nextAppearanceDecision
  );
}

export function updateRivalPopularity(
  gameState
) {
  const rival =
    ensurePoliticalRivalState(
      gameState
    );

  const people =
    numberOrZero(
      gameState.indicators
        ?.people
    );

  const economy =
    numberOrZero(
      gameState.indicators
        ?.economy
    );

  const stability =
    numberOrZero(
      gameState.indicators
        ?.stability
    );

  const corruption =
    numberOrZero(
      gameState.corruption
    );

  let change = 0;

  if (people <= 40) {
    change += 4;
  }

  if (economy <= 35) {
    change += 3;
  }

  if (stability <= 35) {
    change += 2;
  }

  if (corruption >= 60) {
    change += 4;
  }

  if (
    people >= 70 &&
    economy >= 60
  ) {
    change -= 4;
  }

  rival.popularity =
    clamp(
      rival.popularity +
        change
    );

  rival.momentum =
    clamp(
      rival.momentum +
        change,
      -100,
      100
    );

  return change;
}

export function registerRivalAppearance(
  gameState
) {
  const rival =
    ensurePoliticalRivalState(
      gameState
    );

  const decisionsTaken =
    numberOrZero(
      gameState.government
        ?.decisionsTaken
    );

  rival.appearances += 1;

  rival.lastAppearanceDecision =
    decisionsTaken;

  /*
   * Volta entre três e cinco
   * decisões depois.
   */
  rival.nextAppearanceDecision =
    decisionsTaken +
    3 +
    Math.floor(
      Math.random() * 3
    );

  return rival;
}

export function getRivalPhrase(
  gameState
) {
  const rival =
    ensurePoliticalRivalState(
      gameState
    );

  return selectRandomItem(
    rival.phrases
  );
}

function applyIndicatorChange(
  gameState,
  indicator,
  change
) {
  gameState.indicators ??= {};

  gameState.indicators[indicator] =
    clamp(
      numberOrZero(
        gameState.indicators[
          indicator
        ]
      ) + change
    );
}

export function respondToRival(
  gameState,
  responseId
) {
  const rival =
    ensurePoliticalRivalState(
      gameState
    );

  const people =
    numberOrZero(
      gameState.indicators
        ?.people
    );

  const stability =
    numberOrZero(
      gameState.indicators
        ?.stability
    );

  if (responseId === "ignore") {
    rival.popularity =
      clamp(
        rival.popularity + 4
      );

    applyIndicatorChange(
      gameState,
      "stability",
      2
    );

    applyIndicatorChange(
      gameState,
      "people",
      -1
    );

    return {
      id: "ignored",
      icon: "🙄",
      success: true,

      title:
        "O governo ignorou o ataque",

      message:
        `${rival.name} afirmou que o silêncio prova que o governo não possui argumentos.`,

      effects: {
        people: -1,
        stability: 2,
        rivalPopularity: 4
      }
    };
  }

  if (responseId === "rebut") {
    /*
     * Governo popular possui vantagem,
     * mas o rival também pode vencer.
     */
    const successChance =
      clamp(
        50 +
        (people - rival.popularity) *
          0.6 +
        (stability - 50) *
          0.2,
        20,
        80
      );

    const success =
      Math.random() * 100 <
      successChance;

    if (success) {
      rival.popularity =
        clamp(
          rival.popularity - 6
        );

      applyIndicatorChange(
        gameState,
        "people",
        4
      );

      applyIndicatorChange(
        gameState,
        "stability",
        1
      );

      return {
        id: "rebut-success",
        icon: "🔥",
        success: true,

        title:
          "Resposta na medida",

        message:
          `A resposta do governo viralizou e ${rival.nickname} virou motivo de piada nas redes.`,

        effects: {
          people: 4,
          stability: 1,
          rivalPopularity: -6
        }
      };
    }

    rival.popularity =
      clamp(
        rival.popularity + 5
      );

    applyIndicatorChange(
      gameState,
      "people",
      -4
    );

    applyIndicatorChange(
      gameState,
      "stability",
      -2
    );

    return {
      id: "rebut-failure",
      icon: "🤡",
      success: false,

      title:
        "A resposta virou meme",

      message:
        `O pronunciamento foi editado, remixado e usado pela campanha de ${rival.name}.`,

      effects: {
        people: -4,
        stability: -2,
        rivalPopularity: 5
      }
    };
  }

  if (
    responseId === "investigate"
  ) {
    const rivalInfluence =
      numberOrZero(
        rival.attributes
          ?.influence
      );

    const strategy =
      numberOrZero(
        rival.attributes
          ?.strategy
      );

    const successChance =
      clamp(
        65 -
        rivalInfluence * 0.25 -
        strategy * 0.1,
        25,
        70
      );

    const success =
      Math.random() * 100 <
      successChance;

    if (success) {
      rival.scandals =
        numberOrZero(
          rival.scandals
        ) + 1;

      rival.popularity =
        clamp(
          rival.popularity - 9
        );

      applyIndicatorChange(
        gameState,
        "congress",
        3
      );

      applyIndicatorChange(
        gameState,
        "stability",
        -1
      );

      return {
        id:
          "investigation-success",

        icon: "🕵️",
        success: true,

        title:
          "A investigação encontrou algo",

        message:
          `Auditores encontraram funcionários fantasmas, notas frias e uma empresa registrada no endereço de uma oficina.`,

        effects: {
          congress: 3,
          stability: -1,
          rivalPopularity: -9
        }
      };
    }

    rival.popularity =
      clamp(
        rival.popularity + 4
      );

    applyIndicatorChange(
      gameState,
      "people",
      -2
    );

    applyIndicatorChange(
      gameState,
      "stability",
      -4
    );

    gameState.corruption =
      clamp(
        numberOrZero(
          gameState.corruption
        ) + 1
      );

    return {
      id:
        "investigation-failure",

      icon: "⚖️",
      success: false,

      title:
        "A investigação saiu pela culatra",

      message:
        `${rival.name} se declarou vítima de perseguição e arrecadou milhões com uma vaquinha virtual.`,

      effects: {
        people: -2,
        stability: -4,
        corruption: 1,
        rivalPopularity: 4
      }
    };
  }

  return {
    id: "invalid-response",
    icon: "❓",
    success: false,

    title:
      "Resposta inválida",

    message:
      "O governo não conseguiu formular uma resposta."
  };
}