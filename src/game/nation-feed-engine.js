const FEED_INTERVAL = 1;

/*
 * Depois dos testes, altere para:
 * const FEED_INTERVAL = 3;
 */

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

function getCompletedDecisions(
  gameState
) {
  return numberOrZero(
    gameState.government
      ?.decisionsTaken ??
    gameState.government
      ?.decisions
  );
}

export function ensureNationFeedState(
  gameState
) {
  gameState.government ??= {};

  gameState.government.nationFeed ??= {
    lastShownDecision: 0,
    history: []
  };

  const feed =
    gameState.government.nationFeed;

  feed.lastShownDecision =
    numberOrZero(
      feed.lastShownDecision
    );

  if (!Array.isArray(feed.history)) {
    feed.history = [];
  }

  return feed;
}

export function shouldShowNationFeed(
  gameState
) {
  const feed =
    ensureNationFeedState(
      gameState
    );

  const completedDecisions =
    getCompletedDecisions(
      gameState
    );

  const decisionsSinceLastFeed =
    completedDecisions -
    feed.lastShownDecision;

  const shouldShow =
    completedDecisions > 0 &&
    decisionsSinceLastFeed >=
      FEED_INTERVAL;

  console.log(
    "📰 Verificação do Feed:",
    {
      completedDecisions,

      lastShownDecision:
        feed.lastShownDecision,

      decisionsSinceLastFeed,

      feedInterval:
        FEED_INTERVAL,

      shouldShow
    }
  );

  return shouldShow;
}

function calculateApproval(
  gameState
) {
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

  return clamp(
    Math.round(
      people * 0.65 +
      economy * 0.15 +
      stability * 0.2 -
      corruption * 0.1
    ),
    0,
    100
  );
}

function createHeadline(
  gameState,
  lastDecision
) {
  const corruption =
    numberOrZero(
      gameState.corruption
    );

  const economy =
    numberOrZero(
      gameState.indicators
        ?.economy
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

  if (corruption >= 75) {
    return {
      outlet:
        "Jornal da República",

      icon: "🚨",

      headline:
        "Patrimônio presidencial cresce mais rápido que a economia",

      subtitle:
        "Assessoria afirma que os números foram retirados de contexto."
    };
  }

  if (economy <= 25) {
    return {
      outlet:
        "Diário Econômico",

      icon: "📉",

      headline:
        "Governo garante que economia está excelente, exceto pelos dados",

      subtitle:
        "Ministro pediu que a população observe os indicadores com otimismo."
    };
  }

  if (stability <= 25) {
    return {
      outlet:
        "Plantão Nacional",

      icon: "🔥",

      headline:
        "Governo nega crise durante terceira reunião de emergência do dia",

      subtitle:
        "Presidente afirma que tudo permanece rigorosamente fora de controle."
    };
  }

  if (people >= 75) {
    return {
      outlet:
        "Notícias do Povo",

      icon: "🎉",

      headline:
        "Popularidade presidencial sobe e oposição culpa os eleitores",

      subtitle:
        "Aliados já discutem reeleição, estátua e nome de avenida."
    };
  }

  return {
    outlet:
      "Jornal Nacionalista",

    icon: "📰",

    headline:
      lastDecision?.choiceText
        ? `Governo decide: “${lastDecision.choiceText}”`
        : "Governo anuncia nova medida e país tenta entender",

    subtitle:
      lastDecision?.title
        ? `A decisão foi tomada durante o episódio “${lastDecision.title}”.`
        : "A medida dividiu especialistas, aliados e grupos de família."
  };
}

function createHashtag(
  gameState
) {
  const corruption =
    numberOrZero(
      gameState.corruption
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

  const ostentation =
    numberOrZero(
      gameState.player
        ?.image
        ?.ostentation
    );

  if (ostentation >= 30) {
    return "#HumildeDeHelicóptero";
  }

  if (corruption >= 60) {
    return "#AContaNãoFecha";
  }

  if (people >= 70) {
    return "#DeixaOGovernanteTrabalhar";
  }

  if (people <= 30) {
    return "#ForaGovernante";
  }

  if (economy <= 30) {
    return "#SóMais72Horas";
  }

  return "#OGovernante";
}

function createSocialReactions(
  gameState
) {
  const people =
    numberOrZero(
      gameState.indicators
        ?.people
    );

  const corruption =
    numberOrZero(
      gameState.corruption
    );

  const economy =
    numberOrZero(
      gameState.indicators
        ?.economy
    );

  const reactions = [];

  if (people >= 65) {
    reactions.push({
      avatar: "👩‍🏭",
      user:
        "@trabalhadora_real",
      text:
        "Pela primeira vez alguém lembrou que o povo existe."
    });
  } else {
    reactions.push({
      avatar: "😡",
      user:
        "@cidadao_indignado",
      text:
        "Na campanha era uma coisa. Agora virou isso aí."
    });
  }

  if (corruption >= 50) {
    reactions.push({
      avatar: "🕵️",
      user:
        "@segue_o_dinheiro",
      text:
        "O salário não paga nem metade desse relógio."
    });
  } else {
    reactions.push({
      avatar: "🧾",
      user:
        "@fiscal_da_internet",
      text:
        "Até agora a planilha fecha. Estou decepcionado."
    });
  }

  if (economy <= 35) {
    reactions.push({
      avatar: "📉",
      user:
        "@economista_de_bar",
      text:
        "Imprimir dinheiro no videogame funcionava melhor."
    });
  } else {
    reactions.push({
      avatar: "📈",
      user:
        "@mercado_nervoso",
      text:
        "O mercado reagiu bem, mas pode mudar de ideia após o almoço."
    });
  }

  return reactions;
}

export function createNationFeedEntry(
  gameState
) {
  const nationFeed =
    ensureNationFeedState(
      gameState
    );

  const completedDecisions =
    getCompletedDecisions(
      gameState
    );

  const lastDecision =
    gameState.government
      ?.lastDecisionSummary;

  const approval =
    calculateApproval(
      gameState
    );

  const previousEntry =
    nationFeed.history[
      nationFeed.history.length - 1
    ];

  const previousApproval =
    previousEntry?.approval ??
    approval;

  const approvalChange =
    approval -
    previousApproval;

  const entry = {
    id:
      `feed-${completedDecisions}-${Date.now()}`,

    decision:
      completedDecisions,

    year:
      gameState.government
        ?.year ?? 1,

    month:
      gameState.government
        ?.month ?? 1,

    approval,
    approvalChange,

    hashtag:
      createHashtag(
        gameState
      ),

    headline:
      createHeadline(
        gameState,
        lastDecision
      ),

    reactions:
      createSocialReactions(
        gameState
      )
  };

  /*
   * Impede que o mesmo número de
   * decisão gere vários feeds.
   */
  nationFeed.lastShownDecision =
    completedDecisions;

  nationFeed.history.push(
    entry
  );

  /*
   * Evita crescimento infinito
   * do save.
   */
  if (
    nationFeed.history.length > 20
  ) {
    nationFeed.history =
      nationFeed.history.slice(
        -20
      );
  }

  console.log(
    "📰 Feed criado:",
    entry
  );

  return entry;
}