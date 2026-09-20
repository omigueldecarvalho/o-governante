const INVESTIGATION_THRESHOLD = 35;
const INVESTIGATION_COOLDOWN = 7;
const MAX_INVESTIGATIONS = 2;

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

export function ensureInvestigationState(
  gameState
) {
  gameState.government ??= {};

  gameState.government
    .patrimonialInvestigation ??= {
      total: 0,
      lastDecision: null,
      lastResult: null,
      history: []
    };

  const investigation =
    gameState.government
      .patrimonialInvestigation;

  investigation.total =
    numberOrZero(
      investigation.total
    );

  if (
    !Array.isArray(
      investigation.history
    )
  ) {
    investigation.history = [];
  }

  return investigation;
}

export function calculatePatrimonialRisk(
  gameState
) {
  const finances =
    gameState.player
      ?.finances ?? {};

  const image =
    gameState.player
      ?.image ?? {};

  const assets =
    Array.isArray(finances.assets)
      ? finances.assets
      : [];

  const unexplainedWealth =
    numberOrZero(
      finances.unexplainedWealth
    );

  const scrutiny =
    numberOrZero(
      image.scrutiny
    );

  const ostentation =
    numberOrZero(
      image.ostentation
    );

  const corruption =
    numberOrZero(
      gameState.corruption
    );

  const suspiciousAssets =
    assets.filter(
      (asset) =>
        asset.category ===
          "suspicious" ||
        asset.price === 0
    );

  /*
   * Patrimônio sem explicação pode
   * representar até 50 pontos.
   */
  const unexplainedScore =
    clamp(
      Math.floor(
        unexplainedWealth / 50000
      ) * 5,
      0,
      50
    );

  /*
   * Atenção da imprensa pesa bastante,
   * mesmo que o dinheiro seja legal.
   */
  const scrutinyScore =
    clamp(
      Math.round(
        scrutiny * 0.7
      ),
      0,
      25
    );

  const corruptionScore =
    clamp(
      Math.round(
        corruption * 0.35
      ),
      0,
      20
    );

  const ostentationScore =
    clamp(
      Math.round(
        Math.max(
          0,
          ostentation
        ) * 0.25
      ),
      0,
      15
    );

  const suspiciousAssetsScore =
    clamp(
      suspiciousAssets.length * 12,
      0,
      24
    );

  const score =
    clamp(
      unexplainedScore +
        scrutinyScore +
        corruptionScore +
        ostentationScore +
        suspiciousAssetsScore,
      0,
      100
    );

  let level = "low";

  if (score >= 75) {
    level = "critical";
  } else if (score >= 55) {
    level = "high";
  } else if (score >= 35) {
    level = "moderate";
  }

  const reasons = [];

  if (unexplainedWealth > 0) {
    reasons.push(
      "Patrimônio incompatível com a renda declarada"
    );
  }

  if (scrutiny >= 20) {
    reasons.push(
      "A imprensa está investigando as compras presidenciais"
    );
  }

  if (ostentation >= 20) {
    reasons.push(
      "O estilo de vida presidencial chamou atenção"
    );
  }

  if (corruption >= 30) {
    reasons.push(
      "O governo já possui histórico de corrupção"
    );
  }

  if (suspiciousAssets.length > 0) {
    reasons.push(
      "Existem presentes ou bens de origem suspeita"
    );
  }

  return {
    score,
    level,
    reasons,

    unexplainedWealth,
    scrutiny,
    ostentation,
    corruption,

    suspiciousAssets,
    suspiciousAssetsCount:
      suspiciousAssets.length
  };
}

export function shouldTriggerInvestigation(
  gameState
) {
  const investigation =
    ensureInvestigationState(
      gameState
    );

  const completedDecisions =
    numberOrZero(
      gameState.government
        ?.decisions
    );

  if (completedDecisions < 6) {
    return false;
  }

  if (
    investigation.total >=
    MAX_INVESTIGATIONS
  ) {
    return false;
  }

  if (
    investigation.lastDecision !==
    null
  ) {
    const decisionsSinceLast =
      completedDecisions -
      investigation.lastDecision;

    if (
      decisionsSinceLast <
      INVESTIGATION_COOLDOWN
    ) {
      return false;
    }
  }

  const risk =
    calculatePatrimonialRisk(
      gameState
    );

  return (
    risk.score >=
    INVESTIGATION_THRESHOLD
  );
}

export function registerInvestigation(
  gameState,
  result
) {
  const investigation =
    ensureInvestigationState(
      gameState
    );

  const completedDecisions =
    numberOrZero(
      gameState.government
        ?.decisions
    );

  const risk =
    calculatePatrimonialRisk(
      gameState
    );

  investigation.total += 1;

  investigation.lastDecision =
    completedDecisions;

  investigation.lastResult =
    result?.id ?? "unknown";

  investigation.history.push({
    result:
      result?.id ?? "unknown",

    decision:
      completedDecisions,

    year:
      gameState.government
        ?.year ?? 1,

    month:
      gameState.government
        ?.month ?? 1,

    riskScore:
      risk.score,

    unexplainedWealth:
      risk.unexplainedWealth,

    suspiciousAssets:
      risk.suspiciousAssets.map(
        (asset) => ({
          id: asset.id,
          name: asset.name,
          price: asset.price
        })
      )
  });

  return investigation;
}

export function getInvestigationLabel(
  level
) {
  const labels = {
    low: {
      icon: "🟢",
      label: "Baixo"
    },

    moderate: {
      icon: "🟡",
      label: "Moderado"
    },

    high: {
      icon: "🟠",
      label: "Alto"
    },

    critical: {
      icon: "🔴",
      label: "Crítico"
    }
  };

  return (
    labels[level] ??
    labels.low
  );
}