import { GAME_CONFIG } from "../config/game-config.js";

function clamp(value) {
  return Math.max(
    GAME_CONFIG.limits.indicatorMinimum,
    Math.min(
      GAME_CONFIG.limits.indicatorMaximum,
      value
    )
  );
}

function applyValues(target, effects = {}) {
  Object.entries(effects).forEach(([key, value]) => {
    const currentValue = target[key] ?? 0;

    target[key] = clamp(currentValue + value);
  });
}

export function getDueConsequence(gameState) {
  return gameState.pendingConsequences.find(
    (consequence) =>
      consequence.triggerAtDecision <=
      gameState.government.decisionsTaken
  );
}

export function applyConsequence(
  currentGameState,
  consequence
) {
  const consequenceIndex =
    currentGameState.pendingConsequences.findIndex(
      (pending) =>
        pending.triggerAtDecision ===
          consequence.triggerAtDecision &&
        pending.message === consequence.message
    );

  const gameState = structuredClone(
    currentGameState
  );

  const effects = consequence.effects ?? {};

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

  if (typeof effects.corruption === "number") {
    gameState.corruption = clamp(
      gameState.corruption + effects.corruption
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

  if (consequenceIndex !== -1) {
    gameState.pendingConsequences.splice(
      consequenceIndex,
      1
    );
  }

  gameState.history.push({
    type: "consequence",
    message: consequence.message,
    year: gameState.government.year,
    month: gameState.government.month
  });

  return gameState;
}