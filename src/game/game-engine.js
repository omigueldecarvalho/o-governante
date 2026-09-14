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

function advanceMonth(gameState) {
  gameState.government.decisionsTaken += 1;
  gameState.government.month += 1;

  if (gameState.government.month > 12) {
    gameState.government.month = 1;
    gameState.government.year += 1;
  }
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
  const completedDecisions = Number(
    gameState.government?.decisions ?? 0
  );

  const nextDecisionNumber =
    completedDecisions + 1;

  const usedDecisionIds =
    Array.isArray(
      gameState.usedDecisionIds
    )
      ? gameState.usedDecisionIds
      : [];

  /*
   * Eventos que devem acontecer em
   * momentos específicos do governo.
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
      id: "war-of-blocs",
      showAt: 14
    }
  ];

  /*
   * Procura um evento obrigatório
   * que já tenha chegado à sua vez.
   */
  for (
    const scheduledEvent
    of scheduledEvents
  ) {
    const wasUsed =
      usedDecisionIds.includes(
        scheduledEvent.id
      );

    const reachedScheduledMoment =
      nextDecisionNumber >=
      scheduledEvent.showAt;

    if (
      reachedScheduledMoment &&
      !wasUsed
    ) {
      const scheduledDecision =
        decisions.find(
          (decision) =>
            decision.id ===
            scheduledEvent.id
        );

      if (scheduledDecision) {
        return scheduledDecision;
      }
    }
  }

  /*
   * Seleção das decisões comuns.
   */
  const availableDecisions =
    decisions.filter((decision) => {
      const scheduledEvent =
        scheduledEvents.find(
          (event) =>
            event.id === decision.id
        );

      /*
       * Impede que um evento agendado
       * apareça aleatoriamente antes
       * da decisão programada.
       */
      if (
        scheduledEvent &&
        nextDecisionNumber <
          scheduledEvent.showAt
      ) {
        return false;
      }

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
    });

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
  const gameState = structuredClone(
    currentGameState
  );

  const effects = choice.effects ?? {};

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
    typeof effects.corruption === "number"
  ) {
    gameState.corruption = clamp(
      gameState.corruption +
        effects.corruption,
      GAME_CONFIG.limits.corruptionMinimum,
      GAME_CONFIG.limits.corruptionMaximum
    );
  }

  if (
    typeof effects.personalWealth === "number"
  ) {
    gameState.player.personalWealth = Math.max(
      0,
      gameState.player.personalWealth +
        effects.personalWealth
    );
  }

  if (choice.futureEffect) {
    gameState.pendingConsequences.push({
      id: `${decision.id}-${choice.id}-${
        gameState.government.decisionsTaken
      }`,

      sourceDecisionId: decision.id,
      sourceChoiceId: choice.id,

      ...choice.futureEffect,

      triggerAtDecision:
        gameState.government.decisionsTaken +
        choice.futureEffect.afterMonths
    });
  }

if (choice.forcedEnding) {
  gameState.forcedEnding =
    choice.forcedEnding;
}


gameState.history.push({
  type: "decision",

  decisionId: decision.id,
  decisionTitle: decision.title,

  decisionNumber:
    gameState.government.decisionsTaken,

  choiceId: choice.id,
  choiceText: choice.text,

  law: choice.law
    ? {
        name: choice.law.name,
        reason: choice.law.reason
      }
    : null,

  budget: choice.budget
    ? {
        ...choice.budget
      }
    : null,

  cabinet: choice.cabinet
    ? structuredClone(choice.cabinet)
    : null,

    invasion: choice.invasion
  ? structuredClone(choice.invasion)
  : null,

  coverUp: choice.coverUp
  ? structuredClone(choice.coverUp)
  : null,

  congressVote: choice.congressVote
  ? structuredClone(
      choice.congressVote
    )
  : null,

  crisisGame: choice.crisisGame
  ? structuredClone(choice.crisisGame)
  : null,

  privatizationAuction:
  choice.privatizationAuction
    ? structuredClone(
        choice.privatizationAuction
      )
    : null,

  year: gameState.government.year,
  month: gameState.government.month
});

  gameState.usedDecisionIds.push(
    decision.id
  );

  advanceMonth(gameState);

  return gameState;
}