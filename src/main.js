import "./style.css";

import {
  renderLawScreen
} from "./ui/law-screen.js";

import {
  renderPressConference
} from "./ui/press-conference.js";

import { DECISIONS } from "./data/decisions.js";
import { ENDINGS } from "./data/endings.js";

import {
  createInitialGameState
} from "./game/game-state.js";

import {
  applyChoice,
  getNextDecision
} from "./game/game-engine.js";

import {
  getDueConsequence,
  applyConsequence
} from "./game/consequences.js";

import {
  checkEnding,
  finishGame
} from "./game/endings-engine.js";

import {
  saveGame,
  loadGame,
  hasSavedGame,
  clearSavedGame,
  archiveGovernment,
  getGovernmentHistory,
  clearGovernmentHistory
} from "./game/storage.js";

import {
  renderGovernmentHistory
} from "./ui/government-history.js";

import {
  renderHomeScreen,
  renderCreateLeaderScreen,
  renderGovernmentScreen
} from "./ui/screens.js";

import {
  renderDecisionScreen
} from "./ui/decision-card.js";

import {
  renderChoiceResult
} from "./ui/choice-result.js";

import {
  renderConsequenceScreen
} from "./ui/consequence-screen.js";

import {
  renderEndingScreen
} from "./ui/ending-screen.js";

let gameState = null;
let currentDecision = null;

function showHomeScreen() {
  renderHomeScreen({
    onStart: startNewElection,
    onResume: resumeGame,
    onHistory: showGovernmentHistory,
    hasSavedGame: hasSavedGame()
  });
}

function startNewElection() {
  if (hasSavedGame()) {
    const confirmed = window.confirm(
      "Iniciar uma nova eleição apagará a partida atual. Deseja continuar?"
    );

    if (!confirmed) {
      return;
    }
  }

  clearSavedGame();
  gameState = null;
  currentDecision = null;

  showCreateLeaderScreen();
}

function showCreateLeaderScreen() {
  renderCreateLeaderScreen({
    onSubmit: startGame,
    onBack: showHomeScreen
  });
}

function startGame(playerData) {
  try {
    gameState = createInitialGameState(
      playerData
    );

    saveGame(gameState);

    console.log(
      "Estado inicial:",
      gameState
    );

    showGovernmentScreen();
  } catch (error) {
    console.error(
      "Erro completo ao iniciar partida:",
      error
    );

    window.alert(
      `Não foi possível iniciar a partida: ${
        error.message ?? "erro desconhecido"
      }`
    );
  }
}

function resumeGame() {
  const savedGame = loadGame();

  if (!savedGame) {
    window.alert(
      "Não foi possível carregar a partida."
    );

    showHomeScreen();
    return;
  }

  gameState = savedGame;
  currentDecision = null;

  if (gameState.finished) {
    const ending = Object.values(ENDINGS).find(
      (item) => item.id === gameState.ending
    );

    showEnding(
      ending ?? ENDINGS.prototypeCompleted,
      false
    );

    return;
  }

  if (gameState.government.decisionsTaken === 0) {
    showGovernmentScreen();
    return;
  }

  processPendingConsequences();
}

function showGovernmentScreen() {
  renderGovernmentScreen(
    gameState,
    restartGame,
    showNextDecision
  );
}

function showNextDecision() {
  const ending = checkEnding(gameState);

  if (ending) {
    showEnding(ending);
    return;
  }

  currentDecision = getNextDecision(
    gameState,
    DECISIONS
  );

  if (!currentDecision) {
    showEnding(ENDINGS.prototypeCompleted);
    return;
  }

  if (currentDecision.type === "law") {
  renderLawScreen({
    gameState,
    decision: currentDecision,
    onChoice: handleChoice
  });

  return;
}

if (
  currentDecision.type ===
  "press-conference"
) {
  renderPressConference({
    gameState,
    decision: currentDecision,
    onComplete: handleChoice
  });

  return;
}

renderDecisionScreen({
  gameState,
  decision: currentDecision,
  onChoice: handleChoice
});
}

function handleChoice(choice) {
  const selectedDecision = currentDecision;

  gameState = applyChoice(
    gameState,
    selectedDecision,
    choice
  );

  saveGame(gameState);

  console.log("Decisão tomada:", choice);
  console.log("Estado atualizado:", gameState);

  renderChoiceResult({
    decision: selectedDecision,
    choice,

    onContinue: () => {
      currentDecision = null;
      processPendingConsequences();
    }
  });
}

function processPendingConsequences() {
  const ending = checkEnding(gameState);

  if (ending) {
    showEnding(ending);
    return;
  }

  const consequence = getDueConsequence(
    gameState
  );

  if (!consequence) {
    showNextDecision();
    return;
  }

  gameState = applyConsequence(
    gameState,
    consequence
  );

  saveGame(gameState);

  console.log(
    "Consequência aplicada:",
    consequence
  );

  renderConsequenceScreen({
    consequence,
    gameState,

    onContinue: processPendingConsequences
  });
}

function showEnding(ending, updateState = true) {
  if (updateState) {
    gameState = finishGame(
      gameState,
      ending
    );

    saveGame(gameState);
    archiveGovernment(gameState);
  }

  renderEndingScreen({
    gameState,
    ending,
    onRestart: restartGame,
    onHome: showHomeScreen
  });
}

function restartGame() {
  const confirmed = window.confirm(
    "Deseja encerrar esta partida e iniciar uma nova eleição?"
  );

  if (!confirmed) {
    return;
  }

  clearSavedGame();

  gameState = null;
  currentDecision = null;

  showCreateLeaderScreen();
}

showHomeScreen();

function showGovernmentHistory() {
  const history = getGovernmentHistory();

  console.log(
    "Histórico encontrado:",
    history
  );

  renderGovernmentHistory({
    history,
    onBack: showHomeScreen,
    onClear: handleClearHistory
  });
}

function handleClearHistory() {
  const confirmed = window.confirm(
    "Deseja apagar permanentemente todo o histórico de governos?"
  );

  if (!confirmed) {
    return;
  }

  clearGovernmentHistory();
  showGovernmentHistory();
}
