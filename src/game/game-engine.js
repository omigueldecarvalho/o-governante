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

export function getNextDecision(
  gameState,
  decisions
) {
  const availableDecisions = decisions.filter(
    (decision) =>
      !gameState.usedDecisionIds.includes(
        decision.id
      )
  );

  if (availableDecisions.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(
    Math.random() * availableDecisions.length
  );

  return availableDecisions[randomIndex];
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

gameState.history.push({
  type: "decision",

  decisionId: decision.id,
  decisionTitle: decision.title,

  choiceId: choice.id,
  choiceText: choice.text,

  law: choice.law
    ? {
        name: choice.law.name,
        reason: choice.law.reason
      }
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