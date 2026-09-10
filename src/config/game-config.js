export const GAME_CONFIG = {
  name: "O Governante",
  subtitle: "Um jogo de poder e consequências",

  mandate: {
    totalMonths: 48,
    monthsPerDecision: 1
  },

  limits: {
    indicatorMinimum: 0,
    indicatorMaximum: 100,
    factionMinimum: 0,
    factionMaximum: 100,
    corruptionMinimum: 0,
    corruptionMaximum: 100
  },

  initialState: {
    indicators: {
      people: 50,
      congress: 50,
      economy: 50,
      stability: 50
    },

    corruption: 0,
    personalWealth: 0,

    factions: {
      military: 50,
      business: 50,
      unions: 50,
      socialMovements: 50,
      religiousGroups: 50,
      press: 50
    }
  }
};