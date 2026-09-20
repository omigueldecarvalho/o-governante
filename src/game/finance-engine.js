const DEFAULT_SALARY = 50000;

function numberOrZero(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function clampValue(
  value,
  minimum,
  maximum
) {
  return Math.max(
    minimum,
    Math.min(maximum, value)
  );
}

export function ensureFinancialState(
  gameState
) {
  gameState.player ??= {};

  gameState.player.personalWealth =
    numberOrZero(
      gameState.player.personalWealth
    );

  gameState.player.finances ??= {};

  const finances =
    gameState.player.finances;

  /*
   * Patrimônio que o jogador já tinha
   * antes do sistema financeiro existir.
   */
  if (
    finances.initialDeclaredWealth ===
    undefined
  ) {
    finances.initialDeclaredWealth =
      gameState.player.personalWealth;
  }

  finances.initialDeclaredWealth =
    numberOrZero(
      finances.initialDeclaredWealth
    );

  finances.salaryPerDecision =
    numberOrZero(
      finances.salaryPerDecision
    ) || DEFAULT_SALARY;

  finances.lawfulIncome =
    numberOrZero(
      finances.lawfulIncome
    );

  finances.declaredOtherIncome =
    numberOrZero(
      finances.declaredOtherIncome
    );

  finances.illicitIncome =
    numberOrZero(
      finances.illicitIncome
    );

  finances.totalSpent =
    numberOrZero(
      finances.totalSpent
    );

  finances.unexplainedWealth =
    numberOrZero(
      finances.unexplainedWealth
    );

  finances.salaryPayments =
    numberOrZero(
      finances.salaryPayments
    );

  if (
    !Array.isArray(
      finances.assets
    )
  ) {
    finances.assets = [];
  }

  gameState.player.image ??= {};

  const image =
    gameState.player.image;

  image.humility =
    numberOrZero(
      image.humility
    );

  image.ostentation =
    numberOrZero(
      image.ostentation
    );

  image.scrutiny =
    numberOrZero(
      image.scrutiny
    );

  updateUnexplainedWealth(
    gameState
  );

  return gameState;
}

export function updateUnexplainedWealth(
  gameState
) {
  ensureBasicFinancialObjects(
    gameState
  );

  const finances =
    gameState.player.finances;

  /*
   * Saldo atual + gastos realizados
   * representa todo o dinheiro que
   * passou pelas mãos do presidente.
   */
  const totalFinancialMovement =
    numberOrZero(
      gameState.player.personalWealth
    ) +
    numberOrZero(
      finances.totalSpent
    );

  const declaredResources =
    numberOrZero(
      finances.initialDeclaredWealth
    ) +
    numberOrZero(
      finances.lawfulIncome
    ) +
    numberOrZero(
      finances.declaredOtherIncome
    );

  finances.unexplainedWealth =
    Math.max(
      0,
      totalFinancialMovement -
        declaredResources
    );

  return finances.unexplainedWealth;
}

/*
 * Evita recursão entre
 * ensureFinancialState() e
 * updateUnexplainedWealth().
 */
function ensureBasicFinancialObjects(
  gameState
) {
  gameState.player ??= {};

  gameState.player.personalWealth =
    numberOrZero(
      gameState.player.personalWealth
    );

  gameState.player.finances ??= {};

  const finances =
    gameState.player.finances;

  finances.initialDeclaredWealth =
    numberOrZero(
      finances.initialDeclaredWealth
    );

  finances.lawfulIncome =
    numberOrZero(
      finances.lawfulIncome
    );

  finances.declaredOtherIncome =
    numberOrZero(
      finances.declaredOtherIncome
    );

  finances.illicitIncome =
    numberOrZero(
      finances.illicitIncome
    );

  finances.totalSpent =
    numberOrZero(
      finances.totalSpent
    );

  finances.unexplainedWealth =
    numberOrZero(
      finances.unexplainedWealth
    );
}

export function payPresidentialSalary(
  gameState
) {
  ensureFinancialState(gameState);

  const finances =
    gameState.player.finances;

  const salary =
    finances.salaryPerDecision;

  gameState.player.personalWealth +=
    salary;

  finances.lawfulIncome += salary;
  finances.salaryPayments += 1;

  updateUnexplainedWealth(
    gameState
  );

  return salary;
}

/*
 * Use quando o dinheiro ainda não foi
 * aplicado por applyChoice().
 */
export function registerIllicitIncome(
  gameState,
  amount
) {
  ensureFinancialState(gameState);

  const normalizedAmount =
    Math.max(
      0,
      numberOrZero(amount)
    );

  gameState.player.personalWealth +=
    normalizedAmount;

  gameState.player.finances
    .illicitIncome +=
    normalizedAmount;

  updateUnexplainedWealth(
    gameState
  );

  return normalizedAmount;
}

/*
 * Registra a origem de valores que já
 * foram aplicados por applyChoice().
 *
 * Não adiciona o dinheiro novamente.
 */
export function registerChoiceFinancialEffects(
  gameState,
  choice
) {
  ensureFinancialState(gameState);

  const finances =
    gameState.player.finances;

  const wealthChange =
    numberOrZero(
      choice?.effects
        ?.personalWealth
    );

  if (wealthChange === 0) {
    return;
  }

  if (wealthChange < 0) {
    finances.totalSpent +=
      Math.abs(wealthChange);

    updateUnexplainedWealth(
      gameState
    );

    return;
  }

  /*
   * A escolha pode declarar explicitamente
   * a origem do dinheiro:
   *
   * illicit  = propina ou desvio
   * declared = prêmio, aposta, herança
   * legal    = remuneração legítima
   */
  const wealthSource =
    choice.wealthSource ??
    (
      numberOrZero(
        choice.effects?.corruption
      ) > 0
        ? "illicit"
        : "declared"
    );

  if (wealthSource === "illicit") {
    finances.illicitIncome +=
      wealthChange;
  } else if (
    wealthSource === "legal"
  ) {
    finances.lawfulIncome +=
      wealthChange;
  } else {
    finances.declaredOtherIncome +=
      wealthChange;
  }

  updateUnexplainedWealth(
    gameState
  );
}

function applyEffectGroup(
  target,
  effects = {},
  minimum = 0,
  maximum = 100
) {
  Object.entries(effects).forEach(
    ([key, value]) => {
      target[key] =
        clampValue(
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

function applyPurchaseEffects(
  gameState,
  effects = {}
) {
  gameState.indicators ??= {};
  gameState.factions ??= {};
  gameState.country ??= {};
  gameState.politics ??= {};

  applyEffectGroup(
    gameState.indicators,
    effects.indicators
  );

  applyEffectGroup(
    gameState.factions,
    effects.factions
  );

  applyEffectGroup(
    gameState.country,
    effects.country
  );

  applyEffectGroup(
    gameState.politics,
    effects.politics,
    -100,
    100
  );

  gameState.corruption =
    clampValue(
      numberOrZero(
        gameState.corruption
      ) +
      numberOrZero(
        effects.corruption
      ),
      0,
      100
    );
}

function applyImageEffects(
  gameState,
  effects = {}
) {
  const image =
    gameState.player.image;

  image.humility =
    clampValue(
      image.humility +
        numberOrZero(
          effects.humility
        ),
      -100,
      100
    );

  image.ostentation =
    clampValue(
      image.ostentation +
        numberOrZero(
          effects.ostentation
        ),
      -100,
      100
    );

  image.scrutiny =
    clampValue(
      image.scrutiny +
        numberOrZero(
          effects.scrutiny
        ),
      0,
      100
    );
}

export function registerPurchase(
  gameState,
  item
) {
  ensureFinancialState(gameState);

  const price =
    Math.max(
      0,
      numberOrZero(item.price)
    );

  if (
    gameState.player.personalWealth <
    price
  ) {
    return {
      success: false,
      reason: "insufficient-funds"
    };
  }

  const alreadyPurchased =
    gameState.player.finances
      .assets.some(
        (asset) =>
          asset.id === item.id
      );

  if (
    alreadyPurchased &&
    !item.repeatable
  ) {
    return {
      success: false,
      reason: "already-purchased"
    };
  }

  gameState.player.personalWealth -=
    price;

  gameState.player.finances
    .totalSpent += price;

  gameState.player.finances
    .assets.push({
      id: item.id,
      name: item.name,
      icon: item.icon,
      category: item.category,
      description: item.description,
      purchaseMessage:
        item.purchaseMessage,
      price,

      purchasedAt: {
        decision:
          gameState.government
            ?.decisions ?? 0,

        year:
          gameState.government
            ?.year ?? 1,

        month:
          gameState.government
            ?.month ?? 1
      }
    });

  applyImageEffects(
    gameState,
    item.image
  );

  applyPurchaseEffects(
    gameState,
    item.effects
  );

  updateUnexplainedWealth(
    gameState
  );

  return {
    success: true,
    price,
    item
  };
}

export function getFinancialSummary(
  gameState
) {
  ensureFinancialState(gameState);

  const player =
    gameState.player;

  const finances =
    player.finances;

  return {
    balance:
      player.personalWealth,

    initialDeclaredWealth:
      finances.initialDeclaredWealth,

    lawfulIncome:
      finances.lawfulIncome,

    declaredOtherIncome:
      finances.declaredOtherIncome,

    illicitIncome:
      finances.illicitIncome,

    totalSpent:
      finances.totalSpent,

    unexplainedWealth:
      finances.unexplainedWealth,

    assets:
      [...finances.assets],

    assetsCount:
      finances.assets.length
  };
}