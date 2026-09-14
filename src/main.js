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

import {
  renderBudgetScreen
} from "./ui/budget-screen.js";

import {
  renderCabinetScreen
} from "./ui/cabinet-screen.js";

import {
  renderInvasionGame
} from "./ui/invasion-game.js";

import {
  renderAnnualReport
} from "./ui/annual-report.js";

import {
  renderElectionFlow
} from "./ui/election-flow.js";

import {
  applyCampaignChoice
} from "./game/campaign-engine.js";

import {
  renderFootballTeamScreen
} from "./ui/football-team-screen.js";

import {
  renderCoverUpGame
} from "./ui/cover-up-game.js";

import {
  renderCongressVoteGame
} from "./ui/congress-vote-game.js";

import {
  renderCrisisFirefighterGame
} from "./ui/crisis-firefighter-game.js";

import {
  renderPrivatizationAuction
} from "./ui/privatization-auction-game.js";

import {
  renderClandestinePrintShop
} from "./ui/clandestine-print-shop.js";

import {
  renderFlagDesigner
} from "./ui/flag-designer.js";

import {
  renderReligionQuiz
} from "./ui/religion-quiz.js";

import {
  renderTigrinhoGame
} from "./ui/tigrinho-game.js";

import {
  renderWarGame
} from "./ui/war-game.js";

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

    showFootballTeamSelection();
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

  if (!gameState.player.footballTeam) {
  showFootballTeamSelection();
  return;
}

  const initialElectionCompleted =
  gameState.electionsCompleted?.some(
    (election) =>
      election.type === "initial"
  );

if (!initialElectionCompleted) {
  startElection("initial");
  return;
}

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
  const ending = checkEnding(
    gameState
  );

  if (ending) {
    showEnding(ending);
    return;
  }

  currentDecision = getNextDecision(
    gameState,
    DECISIONS
  );

  if (!currentDecision) {
    showEnding(
      ENDINGS.prototypeCompleted
    );

    return;
  }

  /*
   * Sabatina religiosa
   */
  if (
    currentDecision.type ===
    "religion-quiz"
  ) {
    renderReligionQuiz({
      gameState,
      decision: currentDecision,

      onComplete: ({
        choice,
        religion
      }) => {
        gameState.player.religion =
          religion;

        saveGame(gameState);
        handleChoice(choice);
      }
    });

    return;
  }

  /*
   * Criação de leis
   */
  if (
    currentDecision.type === "law"
  ) {
    renderLawScreen({
      gameState,
      decision: currentDecision,
      onChoice: handleChoice
    });

    return;
  }

  /*
   * Entrevista coletiva
   */
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

  /*
   * Orçamento nacional
   */
  if (
    currentDecision.type === "budget"
  ) {
    renderBudgetScreen({
      gameState,
      decision: currentDecision,
      onComplete: handleChoice
    });

    return;
  }

  /*
   * Escolha de ministros
   */
  if (
    currentDecision.type === "cabinet"
  ) {
    renderCabinetScreen({
      gameState,
      decision: currentDecision,
      onComplete: handleChoice
    });

    return;
  }

  /*
   * Invasão estrangeira
   */
  if (
    currentDecision.type === "invasion"
  ) {
    renderInvasionGame({
      gameState,
      decision: currentDecision,
      onComplete: handleChoice
    });

    return;
  }

  /*
   * Operação Abafa
   */
  if (
    currentDecision.type === "cover-up"
  ) {
    renderCoverUpGame({
      gameState,
      decision: currentDecision,
      onComplete: handleChoice
    });

    return;
  }

  /*
   * Compra de votos
   */
  if (
    currentDecision.type ===
    "congress-vote"
  ) {
    renderCongressVoteGame({
      gameState,
      decision: currentDecision,
      onComplete: handleChoice
    });

    return;
  }

  /*
   * Apaga-incêndio
   */
  if (
    currentDecision.type ===
    "crisis-firefighter"
  ) {
    renderCrisisFirefighterGame({
      gameState,
      decision: currentDecision,
      onComplete: handleChoice
    });

    return;
  }

  /*
   * Leilão das privatizações
   */
  if (
    currentDecision.type ===
    "privatization-auction"
  ) {
    renderPrivatizationAuction({
      gameState,
      decision: currentDecision,
      onComplete: handleChoice
    });

    return;
  }

  /*
   * Criação da bandeira
   */
  if (
    currentDecision.type ===
    "flag-designer"
  ) {
    renderFlagDesigner({
      gameState,
      decision: currentDecision,

      onComplete: ({
        choice,
        flag
      }) => {
        gameState.country ??= {};

        if (flag !== undefined) {
          gameState.country.flag =
            flag;
        }

        saveGame(gameState);
        handleChoice(choice);
      }
    });

    return;
  }

  /*
   * Tigrinho do Planalto
   */
  if (
    currentDecision.type ===
    "tigrinho"
  ) {
    renderTigrinhoGame({
      gameState,
      decision: currentDecision,
      onComplete: handleChoice
    });

    return;
  }

  if (
  currentDecision.type ===
  "war-game"
) {
  renderWarGame({
    gameState,
    decision: currentDecision,

    onComplete: (choice) => {
      gameState.flags ??= {};

      if (
        choice.metadata
          ?.war?.occupied
      ) {
        gameState.flags
          .foreignOccupation = true;
      }

      saveGame(gameState);
      handleChoice(choice);
    }
  });

  return;
}

  /*
   * Decisão comum
   */
  renderDecisionScreen({
    gameState,
    decision: currentDecision,
    onChoice: handleChoice
  });
}


function handleChoice(choice) {
  const selectedDecision =
    currentDecision;

  gameState = applyChoice(
    gameState,
    selectedDecision,
    choice
  );

  saveGame(gameState);

  console.log(
    "Decisão tomada:",
    choice
  );

  console.log(
    "Estado atualizado:",
    gameState
  );

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

  const consequence =
    getDueConsequence(gameState);

  if (!consequence) {
    processAnnualReport();
    return;
  }

  gameState = applyConsequence(
    gameState,
    consequence
  );

  saveGame(gameState);

  renderConsequenceScreen({
    consequence,
    gameState,

    onContinue: () => {
      processPendingConsequences();
    }
  });
}

function showEnding(
  ending,
  updateState = true
) {
  if (updateState) {
    gameState = finishGame(
      gameState,
      ending
    );

    if (
      ending.id ===
      "initial-election-defeat"
    ) {
      clearSavedGame();
    } else {
      saveGame(gameState);
      archiveGovernment(gameState);
    }
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

function processAnnualReport() {
  if (
    !Array.isArray(
      gameState.shownAnnualReports
    )
  ) {
    gameState.shownAnnualReports = [];
  }

  const decisionsTaken =
    gameState.government.decisionsTaken;

  const completedYear =
    decisionsTaken / 12;

  const mustShowReport =
    decisionsTaken > 0 &&
    decisionsTaken % 12 === 0 &&
    !gameState.shownAnnualReports.includes(
      completedYear
    );

  if (!mustShowReport) {
    processIntermediateElection();
    return;
  }

  gameState.shownAnnualReports.push(
    completedYear
  );

  saveGame(gameState);

  renderAnnualReport({
    gameState,
    year: completedYear,

    onContinue: () => {
      processIntermediateElection();
    }
  });
}

function startElection(electionType) {
  renderClandestinePrintShop({
    electionType,

    onComplete: (campaignResult) => {
      gameState = applyCampaignChoice({
        currentGameState: gameState,

        choice: {
          id: campaignResult.id,
          name: campaignResult.name,
          effects: campaignResult.effects
        },

        type:
          `print-shop-${electionType}`
      });

      saveGame(gameState);

      renderElectionFlow({
        gameState,
        electionType,

        campaignBonus:
          campaignResult.voteBonus,

        onComplete: (result) => {
          if (
            !Array.isArray(
              gameState.electionsCompleted
            )
          ) {
            gameState.electionsCompleted = [];
          }

          gameState.electionsCompleted.push({
            ...result,

            printShop:
              campaignResult.printShop,

            decisionNumber:
              gameState.government
                .decisionsTaken
          });

          saveGame(gameState);

          if (!result.won) {
            const ending =
              electionType === "initial"
                ? ENDINGS.initialElectionDefeat
                : ENDINGS.midtermElectionDefeat;

            showEnding(ending);
            return;
          }

          if (electionType === "initial") {
            showGovernmentScreen();
            return;
          }

          processPendingConsequences();
        }
      });
    }
  });
}

function processIntermediateElection() {
  if (
    !Array.isArray(
      gameState.electionsCompleted
    )
  ) {
    gameState.electionsCompleted = [];
  }

  const alreadyCompleted =
    gameState.electionsCompleted.some(
      (election) =>
        election.type ===
        "intermediate"
    );

  const mustHoldElection =
    gameState.government
      .decisionsTaken >= 24 &&
    !alreadyCompleted;

  if (mustHoldElection) {
    startElection("intermediate");
    return;
  }

  showNextDecision();
}

function showFootballTeamSelection() {
  renderFootballTeamScreen({
    onComplete: (team) => {
      gameState = applyCampaignChoice({
        currentGameState: gameState,
        choice: team,
        type: "football-team"
      });

      saveGame(gameState);

      console.log(
        "Time escolhido:",
        gameState.player.footballTeam
      );

      startElection("initial");
    }
  });
}