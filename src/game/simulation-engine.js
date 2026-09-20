function numberOrZero(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function clamp(
  value,
  minimum,
  maximum
) {
  return Math.max(
    minimum,
    Math.min(maximum, value)
  );
}

function applyGroup(
  target,
  effects = {},
  minimum = 0,
  maximum = 100
) {
  Object.entries(effects).forEach(
    ([key, value]) => {
      target[key] =
        clamp(
          numberOrZero(
            target[key]
          ) +
          numberOrZero(value),
          minimum,
          maximum
        );
    }
  );
}

export function applySimulationProfile(
  currentGameState,
  simulationProfile
) {
  if (
    !simulationProfile?.effects
  ) {
    return currentGameState;
  }

  const gameState =
    structuredClone(
      currentGameState
    );

  const effects =
    simulationProfile.effects;

  gameState.indicators ??= {};
  gameState.factions ??= {};
  gameState.country ??= {};
  gameState.politicalProfile ??= {};

  gameState.player ??= {};
  gameState.player.image ??= {};
  gameState.player.finances ??= {};

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
    -100,
    100
  );

  applyGroup(
    gameState.player.image,
    effects.image,
    -100,
    100
  );

  gameState.corruption =
    clamp(
      numberOrZero(
        gameState.corruption
      ) +
      numberOrZero(
        effects.corruption
      ),
      0,
      100
    );

  const wealthBonus =
    numberOrZero(
      effects.personalWealth
    );

  gameState.player
    .personalWealth =
    Math.max(
      0,
      numberOrZero(
        gameState.player
          .personalWealth
      ) + wealthBonus
    );

  /*
   * O dinheiro inicial do formulário
   * entra como patrimônio declarado.
   */
  gameState.player.finances
    .initialDeclaredWealth =
    numberOrZero(
      gameState.player.finances
        .initialDeclaredWealth
    ) + wealthBonus;

  gameState.simulationProfile = {
    answers:
      structuredClone(
        simulationProfile.answers
      ),

    appliedEffects:
      structuredClone(
        simulationProfile.effects
      )
  };

  return gameState;
}