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

function applyGroup(
  target,
  effects = {},
  minimum = 0
) {
  Object.entries(effects).forEach(
    ([key, value]) => {
      target[key] = clamp(
        (target[key] ?? 0) + value,
        minimum,
        100
      );
    }
  );
}

export function applyCampaignChoice({
  currentGameState,
  choice,
  type
}) {
  const gameState = structuredClone(
    currentGameState
  );

  const effects = choice.effects ?? {};

  applyGroup(
    gameState.indicators,
    effects.indicators
  );

  applyGroup(
    gameState.factions,
    effects.factions
  );

  applyGroup(
    gameState.country,
    effects.country
  );

  applyGroup(
    gameState.politicalProfile,
    effects.politics,
    -100
  );

  gameState.corruption = clamp(
    gameState.corruption +
      (effects.corruption ?? 0)
  );

  gameState.player.personalWealth =
    Math.max(
      0,
      gameState.player.personalWealth +
        (effects.personalWealth ?? 0)
    );

  if (type === "football-team") {
    gameState.player.footballTeam = {
      id: choice.id,
      name: choice.name,
      nickname: choice.nickname,
      icon: choice.icon
    };
  }

  if (!Array.isArray(
    gameState.campaignHistory
  )) {
    gameState.campaignHistory = [];
  }

  gameState.campaignHistory.push({
    type,
    choiceId: choice.id,
    choiceName: choice.name
  });

  return gameState;
}