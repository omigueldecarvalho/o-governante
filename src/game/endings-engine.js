import { GAME_CONFIG } from "../config/game-config.js";
import { ENDINGS } from "../data/endings.js";

export function checkEnding(gameState) {

  if (gameState.forcedEnding) {
  const forcedEnding = Object.values(
    ENDINGS
  ).find(
    (ending) =>
      ending.id === gameState.forcedEnding
  );

  if (forcedEnding) {
    return forcedEnding;
  }
}
  
  if (gameState.indicators.people <= 0) {
    return ENDINGS.popularRevolt;
  }

  if (gameState.indicators.congress <= 0) {
    return ENDINGS.impement;
  }

  if (gameState.indicators.economy <= 0) {
    return ENDINGS.economicCollapse;
  }

  if (gameState.indicators.stability <= 0) {
    return ENDINGS.institutionalRupture;
  }

  if (gameState.corruption >= 100) {
    return ENDINGS.corruptionPrison;
  }

  if (
    gameState.government.decisionsTaken >=
    GAME_CONFIG.mandate.totalMonths
  ) {
    return ENDINGS.mandateCompleted;
  }

  return null;
}

export function finishGame(
  currentGameState,
  ending
) {
  const gameState = structuredClone(
    currentGameState
  );

  gameState.finished = true;
  gameState.ending = ending.id;
  gameState.endedAt = new Date().toISOString();

  return gameState;
}