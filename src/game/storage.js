const STORAGE_KEY = "o-governante-save";
const SAVE_VERSION = 1;

export function saveGame(gameState) {
  try {
    const saveData = {
      version: SAVE_VERSION,
      savedAt: new Date().toISOString(),
      gameState
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(saveData)
    );

    return true;
  } catch (error) {
    console.error(
      "Erro ao salvar a partida:",
      error
    );

    return false;
  }
}

export function loadGame() {
  try {
    const storedData = localStorage.getItem(
      STORAGE_KEY
    );

    if (!storedData) {
      return null;
    }

    const saveData = JSON.parse(storedData);

    if (
      !saveData.gameState ||
      saveData.version !== SAVE_VERSION
    ) {
      clearSavedGame();
      return null;
    }

    return saveData.gameState;
  } catch (error) {
    console.error(
      "Erro ao carregar a partida:",
      error
    );

    clearSavedGame();

    return null;
  }
}

export function hasSavedGame() {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

export function clearSavedGame() {
  localStorage.removeItem(STORAGE_KEY);
}

const HISTORY_KEY = "o-governante-history";

export function getGovernmentHistory() {
  try {
    const storedHistory =
      localStorage.getItem(HISTORY_KEY);

    if (!storedHistory) {
      return [];
    }

    const history = JSON.parse(storedHistory);

    return Array.isArray(history)
      ? history
      : [];
  } catch (error) {
    console.error(
      "Erro ao carregar histórico:",
      error
    );

    return [];
  }
}

export function archiveGovernment(gameState) {
  try {
    const history = getGovernmentHistory();

    const governmentRecord = {
      id:
        gameState.id ??
        crypto.randomUUID(),

      player: {
        name: gameState.player.name,
        partyName: gameState.player.partyName,
        partyAcronym:
          gameState.player.partyAcronym,
        ideology:
          gameState.player.initialIdeology,
        personalWealth:
          gameState.player.personalWealth
      },

      indicators: {
        ...gameState.indicators
      },

      corruption: gameState.corruption,
      ending: gameState.ending, 
      flag: gameState.country?.flag ?? null,

      government: {
        year: gameState.government.year,
        month: gameState.government.month,
        decisionsTaken:
          gameState.government.decisionsTaken
      },

      startedAt:
        gameState.startedAt ?? null,

      endedAt:
        gameState.endedAt ??
        new Date().toISOString()
    };

    const existingIndex = history.findIndex(
      (item) => item.id === governmentRecord.id
    );

    if (existingIndex >= 0) {
      history[existingIndex] = governmentRecord;
    } else {
      history.unshift(governmentRecord);
    }

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history)
    );

    return true;
  } catch (error) {
    console.error(
      "Erro ao arquivar governo:",
      error
    );

    return false;
  }
}

export function hasGovernmentHistory() {
  return getGovernmentHistory().length > 0;
}

export function clearGovernmentHistory() {
  localStorage.removeItem(HISTORY_KEY);
}