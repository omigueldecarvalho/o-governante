import { GAME_CONFIG } from "../config/game-config.js";

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

function applyValues(
  target,
  effects = {}
) {
  Object.entries(effects).forEach(
    ([key, value]) => {
      const currentValue = target[key] ?? 0;

      target[key] = clamp(
        currentValue + value,
        GAME_CONFIG.limits.indicatorMinimum,
        GAME_CONFIG.limits.indicatorMaximum
      );
    }
  );
}

function applyPoliticalValues(
  politicalProfile,
  politicalEffects = {}
) {
  Object.entries(politicalEffects).forEach(
    ([key, value]) => {
      const currentValue =
        politicalProfile[key] ?? 0;

      const allowsNegative = [
        "economicPosition",
        "socialPosition"
      ].includes(key);

      const minimumValue = allowsNegative
        ? -100
        : 0;

      politicalProfile[key] = clamp(
        currentValue + value,
        minimumValue,
        100
      );
    }
  );
}

function advanceMonth(
  gameState
) {
  gameState.government ??= {};

  gameState.settings ??= {
    gameMode: "classic",
    monthsPerDecision: 1,
    maximumDecisions: 48,
    annualReportInterval: 12,
    intermediateElectionAt: 24
  };

  const monthsPerDecision =
    Math.max(
      1,
      Number(
        gameState.settings
          .monthsPerDecision ?? 1
      )
    );

  const previousDecisions =
    Number(
      gameState.government
        .decisionsTaken ?? 0
    );

  const completedDecisions =
    previousDecisions + 1;

  const elapsedMonths =
    Number(
      gameState.government
        .elapsedMonths ?? 0
    ) + monthsPerDecision;

  gameState.government
    .decisionsTaken =
    completedDecisions;

  /*
   * Compatibilidade com códigos
   * antigos que usam decisions.
   */
  gameState.government.decisions =
    completedDecisions;

  gameState.government
    .elapsedMonths =
    elapsedMonths;

  gameState.government.year =
    Math.floor(
      elapsedMonths / 12
    ) + 1;

  gameState.government.month =
    elapsedMonths % 12 + 1;
}


function getDecisionHistory(
  gameState,
  decisionId
) {
  return gameState.history.filter(
    (item) =>
      item.type === "decision" &&
      item.decisionId === decisionId
  );
}

function meetsRange(value, rule) {
  if (!rule) {
    return true;
  }

  if (
    typeof rule.minimum === "number" &&
    value < rule.minimum
  ) {
    return false;
  }

  if (
    typeof rule.maximum === "number" &&
    value > rule.maximum
  ) {
    return false;
  }

  return true;
}

function meetsGroupRequirements(
  currentValues,
  requirements = {}
) {
  return Object.entries(requirements).every(
    ([key, rule]) => {
      const currentValue =
        currentValues[key] ?? 0;

      return meetsRange(currentValue, rule);
    }
  );
}

function meetsRequirements(
  gameState,
  decision
) {
  const requirements =
    decision.requirements ?? {};

  const decisionsTaken =
    gameState.government.decisionsTaken;

  if (
    typeof requirements.exactDecision ===
      "number" &&
    decisionsTaken !==
      requirements.exactDecision
  ) {
    return false;
  }

  if (
    typeof requirements.minimumDecisions ===
      "number" &&
    decisionsTaken <
      requirements.minimumDecisions
  ) {
    return false;
  }

  if (
    typeof requirements.maximumDecisions ===
      "number" &&
    decisionsTaken >
      requirements.maximumDecisions
  ) {
    return false;
  }

  if (
    !meetsGroupRequirements(
      gameState.indicators,
      requirements.indicators
    )
  ) {
    return false;
  }

  if (
    !meetsGroupRequirements(
      gameState.factions,
      requirements.factions
    )
  ) {
    return false;
  }

  if (
    !meetsGroupRequirements(
      gameState.politicalProfile,
      requirements.politics
    )
  ) {
    return false;
  }

  if (
    requirements.corruption &&
    !meetsRange(
      gameState.corruption,
      requirements.corruption
    )
  ) {
    return false;
  }

  const personalWealth =
  gameState.player
    ?.personalWealth ?? 0;

if (
  requirements.minimumPersonalWealth !==
    undefined &&
  personalWealth <
    requirements.minimumPersonalWealth
) {
  return false;
}

if (
  requirements.maximumPersonalWealth !==
    undefined &&
  personalWealth >
    requirements.maximumPersonalWealth
) {
  return false;
}

  return true;
}

function canUseDecision(
  gameState,
  decision
) {
  const uses = getDecisionHistory(
    gameState,
    decision.id
  );

  if (!decision.repeatable) {
    return uses.length === 0;
  }

  if (
    typeof decision.maximumOccurrences ===
      "number" &&
    uses.length >= decision.maximumOccurrences
  ) {
    return false;
  }

  if (
    uses.length > 0 &&
    typeof decision.cooldown === "number"
  ) {
    const lastUse = uses[uses.length - 1];

    const decisionsSinceLastUse =
      gameState.government.decisionsTaken -
      lastUse.decisionNumber;

    if (
      decisionsSinceLastUse <
      decision.cooldown
    ) {
      return false;
    }
  }

  return true;
}

function selectWeightedDecision(decisions) {
  const totalWeight = decisions.reduce(
    (total, decision) =>
      total + (decision.weight ?? 1),
    0
  );

  let randomValue =
    Math.random() * totalWeight;

  for (const decision of decisions) {
    randomValue -= decision.weight ?? 1;

    if (randomValue <= 0) {
      return decision;
    }
  }

  return decisions[decisions.length - 1];
}



export function getNextDecision(
  gameState,
  decisions
) {
  const completedDecisions =
    Math.max(
      Number(
        gameState.government
          ?.decisionsTaken ?? 0
      ),

      Number(
        gameState.government
          ?.decisions ?? 0
      )
    );

  const nextDecisionNumber =
    completedDecisions + 1;

  const usedDecisionIds =
    Array.isArray(
      gameState.usedDecisionIds
    )
      ? gameState.usedDecisionIds
      : [];

  const gameMode =
    gameState.settings
      ?.gameMode ??
    "classic";

  const isSimulation =
    gameMode ===
    "simulation";

  /*
   * Eventos agendados são utilizados
   * apenas no modo completo.
   *
   * showAt:
   * evento obrigatório.
   *
   * minimumDecision:
   * evento liberado para sorteio.
   */
  const scheduledEvents = [
    {
      id: "faith-interview",
      showAt: 3
    },

    {
      id: "new-national-flag",
      showAt: 5
    },

    {
      id: "operation-peixe-vivo",
      showAt: 10
    },

    {
      id: "money-suitcase",
      showAt: 13
    },

    {
      id: "war-of-blocs",
      showAt: 14
    },

    {
      id: "supreme-court-appointment",
      showAt: 17
    },

    {
      id: "rushed-inauguration",
      showAt: 36
    },

    {
      id:
        "deepfake-monitoring-center",

      minimumDecision: 9
    },

    {
      id: "little-shirt-tax",
      minimumDecision: 1
    }
  ];

  /*
   * Verifica se uma decisão pode ser
   * utilizada normalmente.
   */
  function isAvailable(
    decision
  ) {
    return (
      canUseDecision(
        gameState,
        decision
      ) &&
      meetsRequirements(
        gameState,
        decision
      )
    );
  }

  /*
   * MODO EXPRESSO
   *
   * Rodadas 1, 2, 4 e 5:
   * decisões comuns.
   *
   * Rodada 3:
   * um minigame curto.
   */
  if (isSimulation) {
    const expressMinigameIds =
      new Set([
        "money-suitcase",

        "deepfake-monitoring-center",

        "little-shirt-tax"
      ]);

    const expressMinigameTypes =
      new Set([
        "law",
        "press-conference",
        "money-suitcase",
        "deepfake-center",
        "import-tax"
      ]);

    function isExpressMinigame(
      decision
    ) {
      return (
        expressMinigameIds.has(
          decision.id
        ) ||
        expressMinigameTypes.has(
          decision.type
        )
      );
    }

    function isCommonDecision(
      decision
    ) {
      return (
        !decision.type ||
        decision.type ===
          "common" ||
        decision.type ===
          "decision"
      );
    }

    const eligibleDecisions =
      decisions.filter(
        (decision) => {
          if (
            usedDecisionIds.includes(
              decision.id
            )
          ) {
            return false;
          }

          return isAvailable(
            decision
          );
        }
      );

    /*
     * Terceira rodada:
     * tenta apresentar um minigame.
     */
    if (
      nextDecisionNumber === 3
    ) {
      const minigames =
        eligibleDecisions.filter(
          isExpressMinigame
        );

      if (minigames.length > 0) {
        return selectWeightedDecision(
          minigames
        );
      }
    }

    /*
     * Demais rodadas:
     * somente decisões comuns.
     */
    const commonDecisions =
      eligibleDecisions.filter(
        isCommonDecision
      );

    if (
      commonDecisions.length > 0
    ) {
      return selectWeightedDecision(
        commonDecisions
      );
    }

    /*
     * Segurança caso não existam mais
     * decisões comuns disponíveis.
     */
    const safeFallback =
      eligibleDecisions.filter(
        (decision) =>
          isExpressMinigame(
            decision
          )
      );

    if (
      safeFallback.length > 0
    ) {
      return selectWeightedDecision(
        safeFallback
      );
    }

    return null;
  }

  /*
   * MODO COMPLETO
   *
   * Procura eventos obrigatórios
   * definidos com showAt.
   */
  for (
    const scheduledEvent
    of scheduledEvents
  ) {
    if (
      typeof scheduledEvent.showAt !==
      "number"
    ) {
      continue;
    }

    const wasUsed =
      usedDecisionIds.includes(
        scheduledEvent.id
      );

    const reachedMoment =
      nextDecisionNumber >=
      scheduledEvent.showAt;

    if (
      !wasUsed &&
      reachedMoment
    ) {
      const scheduledDecision =
        decisions.find(
          (decision) =>
            decision.id ===
            scheduledEvent.id
        );

      if (
        scheduledDecision &&
        isAvailable(
          scheduledDecision
        )
      ) {
        return scheduledDecision;
      }
    }
  }

  /*
   * Seleção normal do modo completo.
   */
  const availableDecisions =
    decisions.filter(
      (decision) => {
        const scheduledEvent =
          scheduledEvents.find(
            (event) =>
              event.id ===
              decision.id
          );

        if (scheduledEvent) {
          const activationDecision =
            scheduledEvent.showAt ??
            scheduledEvent
              .minimumDecision;

          if (
            typeof activationDecision ===
              "number" &&
            nextDecisionNumber <
              activationDecision
          ) {
            return false;
          }

          /*
           * Eventos com showAt são
           * retornados pelo bloco
           * obrigatório acima.
           */
          if (
            typeof scheduledEvent
              .showAt === "number" &&
            !usedDecisionIds.includes(
              decision.id
            )
          ) {
            return false;
          }
        }

        return isAvailable(
          decision
        );
      }
    );

  if (
    availableDecisions.length === 0
  ) {
    return null;
  }

  return selectWeightedDecision(
    availableDecisions
  );
}

export function applyChoice(
  currentGameState,
  decision,
  choice
) {
  const gameState =
    structuredClone(
      currentGameState
    );

  gameState.player ??= {};
  gameState.indicators ??= {};
  gameState.factions ??= {};
  gameState.country ??= {};
  gameState.politicalProfile ??= {};
  gameState.government ??= {};

  gameState.history ??= [];
  gameState.usedDecisionIds ??= [];
  gameState.pendingConsequences ??= [];

  gameState.corruption =
    Number(
      gameState.corruption ?? 0
    );

  gameState.player.personalWealth =
    Number(
      gameState.player
        .personalWealth ?? 0
    );

  const completedBefore =
    Math.max(
      Number(
        gameState.government
          .decisionsTaken ?? 0
      ),

      Number(
        gameState.government
          .decisions ?? 0
      )
    );

  const currentDecisionNumber =
    completedBefore + 1;

  const effects =
    choice.effects ?? {};

  applyValues(
    gameState.indicators,
    effects.indicators
  );

  applyValues(
    gameState.factions,
    effects.factions
  );

  applyValues(
    gameState.country,
    effects.country
  );

  applyPoliticalValues(
    gameState.politicalProfile,
    effects.politics
  );

  if (
    typeof effects.corruption ===
    "number"
  ) {
    gameState.corruption =
      clamp(
        gameState.corruption +
          effects.corruption,

        GAME_CONFIG.limits
          .corruptionMinimum,

        GAME_CONFIG.limits
          .corruptionMaximum
      );
  }

  if (
    typeof effects.personalWealth ===
    "number"
  ) {
    gameState.player
      .personalWealth =
      Math.max(
        0,

        gameState.player
          .personalWealth +
          effects.personalWealth
      );
  }

  if (choice.futureEffect) {
    const afterMonths =
      Math.max(
        1,
        Number(
          choice.futureEffect
            .afterMonths ?? 1
        )
      );

    const monthsPerDecision =
      Math.max(
        1,
        Number(
          gameState.settings
            ?.monthsPerDecision ?? 1
        )
      );

    const decisionsUntilEffect =
      Math.max(
        1,
        Math.ceil(
          afterMonths /
          monthsPerDecision
        )
      );

    gameState.pendingConsequences.push({
      id:
        `${decision.id}-${choice.id}-${currentDecisionNumber}`,

      sourceDecisionId:
        decision.id,

      sourceChoiceId:
        choice.id,

      ...structuredClone(
        choice.futureEffect
      ),

      triggerAtDecision:
        currentDecisionNumber +
        decisionsUntilEffect
    });
  }

  if (choice.forcedEnding) {
    gameState.forcedEnding =
      choice.forcedEnding;
  }

  gameState.history.push({
    type: "decision",

    decisionType:
      decision.type ?? "common",

    decisionId:
      decision.id,

    decisionTitle:
      decision.title,

    decisionNumber:
      currentDecisionNumber,

    choiceId:
      choice.id,

    choiceText:
      choice.text,

    resultText:
      choice.resultText ?? null,

    law:
      choice.law
        ? structuredClone(
            choice.law
          )
        : null,

    budget:
      choice.budget
        ? structuredClone(
            choice.budget
          )
        : null,

    cabinet:
      choice.cabinet
        ? structuredClone(
            choice.cabinet
          )
        : null,

    invasion:
      choice.invasion
        ? structuredClone(
            choice.invasion
          )
        : null,

    coverUp:
      choice.coverUp
        ? structuredClone(
            choice.coverUp
          )
        : null,

    congressVote:
      choice.congressVote
        ? structuredClone(
            choice.congressVote
          )
        : null,

    crisisGame:
      choice.crisisGame
        ? structuredClone(
            choice.crisisGame
          )
        : null,

    privatizationAuction:
      choice.privatizationAuction
        ? structuredClone(
            choice
              .privatizationAuction
          )
        : null,

    metadata:
      choice.metadata
        ? structuredClone(
            choice.metadata
          )
        : null,

    year:
      gameState.government
        .year ?? 1,

    month:
      gameState.government
        .month ?? 1
  });

  gameState.government
    .lastDecisionSummary = {
      decisionId:
        decision.id,

      decisionType:
        decision.type ?? "common",

      choiceId:
        choice.id,

      title:
        decision.title,

      choiceText:
        choice.text,

      resultText:
        choice.resultText ?? null,

      decisionNumber:
        currentDecisionNumber
    };

  if (
    !gameState.usedDecisionIds
      .includes(decision.id)
  ) {
    gameState.usedDecisionIds.push(
      decision.id
    );
  }

  advanceMonth(gameState);

  console.log(
    "📊 Decisão contabilizada:",
    {
      decisionsTaken:
        gameState.government
          .decisionsTaken,

      decisions:
        gameState.government
          .decisions,

      elapsedMonths:
        gameState.government
          .elapsedMonths,

      gameMode:
        gameState.settings
          ?.gameMode
    }
  );

  return gameState;
}
