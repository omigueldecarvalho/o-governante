import {
  GAME_CONFIG
} from "../config/game-config.js";

import {
  IDEOLOGIES
} from "../config/ideologies.js";

function createGameId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }

  return `government-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

function createGameSettings(
  playerData
) {
  const gameMode =
    playerData.gameMode ===
    "simulation"
      ? "simulation"
      : "classic";

  if (
    gameMode === "simulation"
  ) {
    return {
      gameMode:
        "simulation",

      monthsPerDecision:
        12,

      maximumDecisions:
        5,

      annualReportInterval:
        0,

      intermediateElectionAt:
        null,

      skipInitialElection:
        true,

      skipFootballTeam:
        true
    };
  }

  return {
    gameMode:
      "classic",

    monthsPerDecision:
      1,

    maximumDecisions:
      GAME_CONFIG.mandate
        ?.totalMonths ?? 48,

    annualReportInterval:
      12,

    intermediateElectionAt:
      24,

    skipInitialElection:
      false,

    skipFootballTeam:
      false
  };
}

export function createInitialGameState(
  playerData
) {
  const ideology =
    IDEOLOGIES.find(
      (item) =>
        item.id ===
        playerData.ideology
    );

  if (!ideology) {
    throw new Error(
      "Ideologia não encontrada."
    );
  }

  const base =
    GAME_CONFIG.initialState;

  const settings =
    createGameSettings(
      playerData
    );

  const initialWealth =
    Number(
      base.personalWealth ?? 0
    );

  const gameState = {
    id:
      createGameId(),

    startedAt:
      new Date().toISOString(),

    endedAt:
      null,

    settings,

    player: {
      name:
        playerData.name,

      partyName:
        playerData.partyName,

      partyAcronym:
        playerData.partyAcronym,

      candidateNumber:
        playerData.candidateNumber,

      initialIdeology:
        ideology.id,

      footballTeam:
        null,

      religion:
        null,

      personalWealth:
        initialWealth,

      finances: {
        salaryPerDecision:
          settings.gameMode ===
          "simulation"
            ? 600000
            : 50000,

        initialDeclaredWealth:
          initialWealth,

        lawfulIncome: 0,

        declaredOtherIncome:
          0,

        illicitIncome: 0,
        totalSpent: 0,

        unexplainedWealth:
          0,

        salaryPayments: 0,
        assets: []
      },

      image: {
        humility: 0,
        ostentation: 0,
        scrutiny: 0
      }
    },

    indicators: {
      people:
        base.indicators.people +
        ideology.initialEffects
          .people,

      congress:
        base.indicators.congress +
        ideology.initialEffects
          .congress,

      economy:
        base.indicators.economy +
        ideology.initialEffects
          .economy,

      stability:
        base.indicators.stability +
        ideology.initialEffects
          .stability
    },

    corruption:
      ideology.initialEffects
        .corruption,

    factions: {
      military:
        base.factions.military +
        ideology.factionSupport
          .military,

      business:
        base.factions.business +
        ideology.factionSupport
          .business,

      unions:
        base.factions.unions +
        ideology.factionSupport
          .unions,

      socialMovements:
        base.factions
          .socialMovements +
        ideology.factionSupport
          .socialMovements,

      religiousGroups:
        base.factions
          .religiousGroups +
        ideology.factionSupport
          .religiousGroups,

      press:
        base.factions.press +
        ideology.factionSupport
          .press
    },

    politicalProfile: {
      economicPosition: 0,
      socialPosition: 0,
      authoritarianism: 0,
      popularParticipation: 0,
      personalism: 0
    },

    country: {
      inequality: 50,
      publicServices: 50,
      environment: 50,
      flag: null,

      supremeCourtAppointments:
        []
    },

    government: {
      month: 1,
      year: 1,

      decisionsTaken: 0,
      decisions: 0,
      elapsedMonths: 0,

      patrimonialInvestigation: {
        total: 0,

        lastDecision:
          null,

        lastResult:
          null,

        history: []
      },

      nationFeed: {
        lastShownDecision: 0,
        history: []
      }
    },

    simulationProfile:
      playerData.simulationProfile ??
      null,

    achievements: {
      unlocked: [],
      history: []
    },

    history: [],

    pendingConsequences:
      [],

    usedDecisionIds: [],

    shownAnnualReports:
      [],

    electionsCompleted:
      [],

    campaignHistory: [],

    flags: {},

    finished: false,

    forcedEnding:
      null,

    ending: null,

    finalReport: null
  };

  return gameState;
}