import { GAME_CONFIG } from "../config/game-config.js";
import { IDEOLOGIES } from "../config/ideologies.js";

function createGameId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `government-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}


export function createInitialGameState(playerData) {
  const ideology = IDEOLOGIES.find(
    (item) => item.id === playerData.ideology
  );

  if (!ideology) {
    throw new Error("Ideologia não encontrada.");
  }

  const base = GAME_CONFIG.initialState;

  return {
  id: createGameId(),
  startedAt: new Date().toISOString(),
  endedAt: null,

  player: {
    name: playerData.name,
    partyName: playerData.partyName,
    partyAcronym: playerData.partyAcronym,
    initialIdeology: ideology.id,
    personalWealth: base.personalWealth
  },

    indicators: {
      people: base.indicators.people + ideology.initialEffects.people,
      congress: base.indicators.congress + ideology.initialEffects.congress,
      economy: base.indicators.economy + ideology.initialEffects.economy,
      stability:
        base.indicators.stability + ideology.initialEffects.stability
    },

    corruption: ideology.initialEffects.corruption,

    factions: {
      military:
        base.factions.military + ideology.factionSupport.military,

      business:
        base.factions.business + ideology.factionSupport.business,

      unions:
        base.factions.unions + ideology.factionSupport.unions,

      socialMovements:
        base.factions.socialMovements +
        ideology.factionSupport.socialMovements,

      religiousGroups:
        base.factions.religiousGroups +
        ideology.factionSupport.religiousGroups,

      press:
        base.factions.press + ideology.factionSupport.press
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
      environment: 50
    },

    government: {
      month: 1,
      year: 1,
      decisionsTaken: 0
    },

    history: [],
    pendingConsequences: [],
    usedDecisionIds: [],
    finished: false,
    ending: null
  };
}