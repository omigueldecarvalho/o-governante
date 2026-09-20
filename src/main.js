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

import {
  renderMoneySuitcaseGame
} from "./ui/money-suitcase-game.js";

import {
  renderJKRoadGame
} from "./ui/jk-road-game.js";

import {
  renderRushedInaugurationGame
} from "./ui/rushed-inauguration-game.js";

import {
  renderSTFAppointmentGame
} from "./ui/stf-appointment-game.js";

import {
  renderDeepfakeCenterGame
} from "./ui/deepfake-center-game.js";

import {
  renderImportTaxGame
} from "./ui/import-tax-game.js";

import {
  renderPresidentialShop
} from "./ui/presidential-shop.js";

import {
  ensureFinancialState,
  payPresidentialSalary,
  registerChoiceFinancialEffects
} from "./game/finance-engine.js";

import {
  calculatePatrimonialRisk,
  ensureInvestigationState,
  shouldTriggerInvestigation
} from "./game/patrimonial-investigation.js";


import {
  ensureNationFeedState,
  shouldShowNationFeed,
  createNationFeedEntry
} from "./game/nation-feed-engine.js";

import {
  renderNationFeedSidebar,
  removeNationFeedSidebar
} from "./ui/nation-feed-sidebar.js";

import {
  renderPatrimonialInvestigation
} from "./ui/patrimonial-investigation-screen.js";

import {
  ensurePoliticalRivalState,
  shouldTriggerRivalEvent,
  updateRivalPopularity,
  registerRivalAppearance,
  getRivalPhrase,
  respondToRival
} from "./game/political-rival-engine.js";

import {
  ensureAchievementState,
  checkAchievements
} from "./game/achievement-engine.js";

import {
  showAchievementToasts
} from "./ui/achievement-toast.js";

import {
  GAME_CONFIG
} from "./config/game-config.js";

import {
  renderGameModeScreen,
  renderSimulationProfileScreen
} from "./ui/simulation-mode-screen.js";

import {
  applySimulationProfile
} from "./game/simulation-engine.js";

import {
  renderAboutScreen
} from "./ui/about-screen.js";

import "./ui/about-screen.css";

import {
  installDebugPanel
} from "./ui/debug-panel.js";

import "./ui/debug-panel.css";

import {
  POLITICAL_COMPASS_QUESTIONS
} from "./data/political-compass-questions.js";

import {
  calculatePoliticalCompassResult
} from "./game/political-compass-engine.js";

import {
  renderPoliticalCompassScreen
} from "./ui/political-compass-screen.js";

import {
  renderPoliticalCompassResult
} from "./ui/political-compass-result.js";

import {
  downloadPoliticalCompassResult,
  sharePoliticalCompassResult
} from "./ui/political-compass-share.js";

let debugForcedDecisionId = null;


let gameState = null;
let currentDecision = null;

let pendingPlayerData = null;

function showHomeScreen() {
  removeNationFeedSidebar();

  renderHomeScreen({
    onStart:
      startNewElection,

    onResume:
      resumeGame,

    onHistory:
      showGovernmentHistory,

    onAbout:
      showAboutScreen,

    onPoliticalCompass:
      showPoliticalCompass,

    hasSavedGame:
      hasSavedGame()
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

function showPoliticalCompassResult(
  result
) {
  renderPoliticalCompassResult({
    result,

    onUseInGame: () => {
      sessionStorage.setItem(
        "political-compass-result",
        result.ideologyId
      );

      showCreateLeaderScreen();
    },

    onRestart:
      showPoliticalCompass,

    onHome:
      showHomeScreen,

    onShare: async () => {
      await sharePoliticalCompassResult(
        result
      );
    },

    onDownload: async () => {
      await downloadPoliticalCompassResult(
        result
      );
    }
  });
}

function showCreateLeaderScreen() {
  renderCreateLeaderScreen({
    onSubmit: (
      playerData
    ) => {
      pendingPlayerData = {
        ...playerData
      };

      showGameModeSelection();
    },

    onBack:
      showHomeScreen
  });
}

function showGameModeSelection() {
  renderGameModeScreen({
    onSelect: (
      gameMode
    ) => {
      if (
        gameMode ===
        "simulation"
      ) {
        showSimulationProfile();
        return;
      }

      startGame({
        ...pendingPlayerData,
        gameMode: "classic",
        simulationProfile: null
      });
    },

    onBack: () => {
      showCreateLeaderScreen();
    }
  });
}

function showSimulationProfile() {
  renderSimulationProfileScreen({
    onComplete: (
      simulationProfile
    ) => {
      startGame({
        ...pendingPlayerData,
        gameMode: "simulation",
        simulationProfile
      });
    },

    onBack: () => {
      showGameModeSelection();
    }
  });
}

function startGame(playerData) {
  try {
    gameState =
      createInitialGameState(
        playerData
      );

    if (
      playerData.gameMode ===
        "simulation" &&
      playerData.simulationProfile
    ) {
      gameState =
        applySimulationProfile(
          gameState,
          playerData
            .simulationProfile
        );
    }

    pendingPlayerData = null;

    saveGame(gameState);

    console.log(
      "Estado inicial:",
      gameState
    );

    const isSimulation =
      gameState.settings
        ?.gameMode ===
      "simulation";

    if (isSimulation) {
      showGovernmentScreen();
      return;
    }

    showFootballTeamSelection();
  } catch (error) {
    console.error(
      "Erro completo ao iniciar partida:",
      error
    );

    window.alert(
      `Não foi possível iniciar a partida: ${
        error.message ??
        "erro desconhecido"
      }`
    );
  }
}

function resumeGame() {
  const savedGame =
    loadGame();

  if (!savedGame) {
    window.alert(
      "Não foi possível carregar a partida."
    );

    showHomeScreen();
    return;
  }

  gameState = savedGame;
  currentDecision = null;

  const isSimulation =
  gameState.settings
    ?.gameMode ===
  "simulation";

  /*
   * Migração de partidas antigas.
   */
  gameState.settings ??= {
    gameMode: "classic",
    monthsPerDecision: 1,
    maximumDecisions:
      GAME_CONFIG.mandate
        ?.totalMonths ?? 48,
    annualReportInterval: 12,
    intermediateElectionAt: 24
  };

  gameState.government
    .elapsedMonths ??=
    Number(
      gameState.government
        .decisionsTaken ?? 0
    );

  if (
  !isSimulation &&
  !gameState.player.footballTeam
) {
  showFootballTeamSelection();
  return;
}

  const initialElectionCompleted =
  gameState.electionsCompleted
    ?.some(
      (election) =>
        election.type ===
        "initial"
    );

if (
  !isSimulation &&
  !initialElectionCompleted
) {
  startElection("initial");
  return;
}

  if (gameState.finished) {
    const ending =
      Object.values(
        ENDINGS
      ).find(
        (item) =>
          item.id ===
          gameState.ending
      );

    showEnding(
      ending ??
      ENDINGS.prototypeCompleted
    );

    return;
  }

  if (
    gameState.government
      .decisionsTaken === 0
  ) {
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
  /*
   * Garante os estados dos sistemas,
   * inclusive em partidas antigas.
   */
  ensureFinancialState(
    gameState,
    handleRivalResponse
  );

  ensureInvestigationState(
    gameState
  );

  ensureNationFeedState(
    gameState
  );

  ensurePoliticalRivalState(
    gameState
  );

  const ending =
    checkEnding(gameState);

  if (ending) {
    removeNationFeedSidebar();
    showEnding(ending);
    return;
  };


  

  renderNationFeedSidebar(
    gameState,
    handleRivalResponse
  );

  // restante da função...

  /*
   * 2. A investigação patrimonial
   * possui prioridade sobre eventos
   * e decisões aleatórias.
   */
  const debugDecision =
  debugForcedDecisionId
    ? DECISIONS.find(
        (decision) =>
          decision.id ===
          debugForcedDecisionId
      )
    : null;

/*
 * O ID é limpo imediatamente para
 * não repetir o evento na próxima rodada.
 */
debugForcedDecisionId = null;

const investigationIsPending =
  shouldTriggerInvestigation(
    gameState
  );

if (debugDecision) {
  /*
   * O painel de testes possui
   * prioridade sobre o sorteio normal.
   */
  currentDecision =
    debugDecision;
} else if (
  investigationIsPending
) {
  currentDecision =
    DECISIONS.find(
      (decision) =>
        decision.id ===
        "patrimonial-investigation"
    );
} else {
  currentDecision =
    getNextDecision(
      gameState,
      DECISIONS
    );
}
  /*
   * Sempre valide antes de acessar
   * currentDecision.type.
   */
  if (!currentDecision) {
    showEnding(
      ENDINGS.prototypeCompleted
    );

    return;
  }

  /*
   * Investigação patrimonial
   */
  if (
    currentDecision.type ===
    "patrimonial-investigation"
  ) {
    renderPatrimonialInvestigation({
      gameState,
      decision: currentDecision,
      onComplete: handleChoice
    });

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
    currentDecision.type ===
    "law"
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
    currentDecision.type ===
    "budget"
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
    currentDecision.type ===
    "cabinet"
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
    currentDecision.type ===
    "invasion"
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
    currentDecision.type ===
    "cover-up"
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

  /*
   * Jogo de guerra
   */
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
   * Mala de dinheiro
   */
  if (
    currentDecision.type ===
    "money-suitcase"
  ) {
    renderMoneySuitcaseGame({
      gameState,
      decision: currentDecision,
      onComplete: handleChoice
    });

    return;
  }

  /*
   * Corrida JK
   */
  if (
    currentDecision.type ===
    "jk-road-game"
  ) {
    renderJKRoadGame({
      gameState,
      decision: currentDecision,

      onComplete: (choice) => {
        gameState.flags ??= {};

        if (
          choice.metadata
            ?.jkRoad?.crashed
        ) {
          gameState.flags
            .suspiciousAccident = true;
        }

        saveGame(gameState);
        handleChoice(choice);
      }
    });

    return;
  }

  /*
   * Inauguração às pressas
   */
  if (
    currentDecision.type ===
    "rushed-inauguration"
  ) {
    renderRushedInaugurationGame({
      gameState,
      decision: currentDecision,
      onComplete: handleChoice
    });

    return;
  }

  /*
   * Escolha do STF
   */
  if (
    currentDecision.type ===
    "stf-appointment"
  ) {
    renderSTFAppointmentGame({
      gameState,
      decision: currentDecision,

      onComplete: ({
        choice,
        appointment
      }) => {
        gameState.country ??= {};

        gameState.country
          .supremeCourtAppointments ??=
          [];

        gameState.country
          .supremeCourtAppointments
          .push(appointment);

        saveGame(gameState);
        handleChoice(choice);
      }
    });

    return;
  }

  /*
   * Central do Deepfake
   */
  if (
    currentDecision.type ===
    "deepfake-center"
  ) {
    renderDeepfakeCenterGame({
      gameState,
      decision: currentDecision,
      onComplete: handleChoice
    });

    return;
  }

  /*
   * Taxa das Blusinhas
   */
  if (
    currentDecision.type ===
    "import-tax"
  ) {
    renderImportTaxGame({
      gameState,
      decision: currentDecision,
      onComplete: handleChoice
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

function handleRivalResponse(
  responseId,
  feedEntry
) {
  console.log(
    "Processando resposta:",
    {
      responseId,
      feedEntry
    }
  );

  if (!feedEntry?.rival) {
    console.error(
      "O Feed não possui ataque de rival.",
      feedEntry
    );

    return;
  }

  if (
    feedEntry.rival.responded
  ) {
    console.warn(
      "Esse ataque já foi respondido."
    );

    return;
  }

  const result =
    respondToRival(
      gameState,
      responseId
    );

  feedEntry.rival.responded =
    true;

  feedEntry.rival.responseId =
    responseId;

  feedEntry.rival.result =
    result;

  feedEntry.rival.popularity =
    gameState.government
      .politicalRival
      .popularity;

  saveGame(gameState);

  renderNationFeedSidebar(
    gameState,
    handleRivalResponse
  );
}


function updateNationFeed() {
  ensureNationFeedState(
    gameState,
    handleRivalResponse
  );

  ensurePoliticalRivalState(
    gameState
  );

  if (
    shouldShowNationFeed(
      gameState
    )
  ) {
    /*
     * Rival cresce quando o governo
     * apresenta índices ruins.
     */
    const popularityChange =
      updateRivalPopularity(
        gameState
      );

    const rivalWillAppear =
      shouldTriggerRivalEvent(
        gameState
      );

    let rivalAppearance = null;

    if (rivalWillAppear) {
      const phrase =
        getRivalPhrase(
          gameState
        );

      const rival =
        registerRivalAppearance(
          gameState
        );

      rivalAppearance = {
        id: rival.id,
        icon: rival.icon,
        name: rival.name,
        nickname: rival.nickname,
        ideology: rival.ideology,
        phrase,

        popularity:
          rival.popularity,

        popularityChange
      };
    }

    const feedEntry =
      createNationFeedEntry(
        gameState
      );

    /*
     * Anexa o ataque político
     * ao Feed criado nessa rodada.
     */
    feedEntry.rival =
      rivalAppearance;

    saveGame(gameState);
  }

  renderNationFeedSidebar(
    gameState,
    handleRivalResponse
  );
}


function handleChoice(choice) {
  if (!choice) {
    console.error(
      "Nenhuma escolha foi recebida."
    );

    return;
  }

  

  if (!currentDecision) {
    console.error(
      "Nenhuma decisão atual foi encontrada."
    );

    return;
  }

  const selectedDecision =
    currentDecision;

  /*
   * Aplica indicadores, corrupção,
   * patrimônio e demais efeitos.
   */
  gameState = applyChoice(
    gameState,
    selectedDecision,
    choice
  );

  /*
   * Registra a origem do dinheiro que
   * applyChoice já adicionou.
   *
   * Essa função não adiciona o valor
   * novamente ao patrimônio.
   */
  registerChoiceFinancialEffects(
    gameState,
    choice
  );

  /*
   * Paga o salário legítimo referente
   * ao período da decisão.
   */
  const receivedSalary =
  payPresidentialSalary(
    gameState
  );

gameState.government
  .lastSalaryPayment =
  receivedSalary;

const unlockedAchievements =
  checkAchievements(
    gameState
  );

saveGame(gameState);

renderChoiceResult({
  decision:
    selectedDecision,

  choice,
  gameState,

  onContinue: () => {
    currentDecision = null;
    processPendingConsequences();
  },

  onOpenShop:
    openPresidentialShop
});

updateNationFeed();

showAchievementToasts(
  unlockedAchievements
);

  gameState.government ??= {};

  gameState.government
    .lastSalaryPayment =
    receivedSalary;

    gameState.government
  .lastDecisionSummary = {
    decisionId:
      selectedDecision.id,

    choiceId:
      choice.id,

    title:
      selectedDecision.title,

    choiceText:
      choice.text,

    resultText:
      choice.resultText
  };

  saveGame(gameState);

  console.log(
    "Decisão tomada:",
    {
      decision:
        selectedDecision.id,

      choice:
        choice.id,

      salary:
        receivedSalary
    }
  );

  console.log(
    "Estado financeiro:",
    gameState.player.finances
  );

  renderChoiceResult({
    decision:
      selectedDecision,

    choice,
    gameState,

    onContinue: () => {
      currentDecision = null;

      processPendingConsequences();
    },

    onOpenShop:
      openPresidentialShop
  });
  updateNationFeed();
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

function showEnding(ending) {
  removeNationFeedSidebar();

  gameState = finishGame(
    gameState,
    ending
  );

  saveGame(gameState);

  renderEndingScreen({
    gameState,
    ending,

    onRestart:
      restartGame,

    onHome:
      showHomeScreen
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

function showPoliticalCompass() {
  console.log(
    "🧭 Abrindo Bússola do Governante"
  );

  removeNationFeedSidebar();

  renderPoliticalCompassScreen({
    questions:
      POLITICAL_COMPASS_QUESTIONS,

    onComplete: ({
      state
    }) => {
      const result =
        calculatePoliticalCompassResult(
          state
        );

      showPoliticalCompassResult(
        result
      );
    },

    onCancel:
      showHomeScreen
  });
}

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
  const isSimulation =
    gameState.settings
      ?.gameMode ===
    "simulation";

  if (isSimulation) {
    processIntermediateElection();
    return;
  }


  const decisionsTaken =
    Number(
      gameState.government
        ?.decisionsTaken ?? 0
    );

  const elapsedMonths =
    Number(
      gameState.government
        ?.elapsedMonths ??
      decisionsTaken
    );

  const reportInterval =
    Number(
      gameState.settings
        ?.annualReportInterval ??
      12
    );

  const completedYear =
    Math.max(
      1,
      Math.floor(
        elapsedMonths / 12
      )
    );

  const reportId =
    `year-${completedYear}`;

  const mustShowReport =
    decisionsTaken > 0 &&
    decisionsTaken %
      reportInterval ===
      0 &&
    !gameState.shownAnnualReports
      .includes(reportId);

  if (!mustShowReport) {
    processIntermediateElection();
    return;
  }

  gameState.shownAnnualReports.push(
    reportId
  );

  saveGame(gameState);

  renderAnnualReport({
    gameState,
    year:
      completedYear,

    onContinue: () => {
      processIntermediateElection();
    }
  });
}

function openPresidentialShop() {
  renderPresidentialShop({
    gameState,

    onPurchase: () => {
      saveGame(gameState);
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
  const isSimulation =
    gameState.settings
      ?.gameMode ===
    "simulation";

  if (isSimulation) {
    showNextDecision();
    return;
  }

  

  const alreadyCompleted =
    gameState.electionsCompleted.some(
      (election) =>
        election.type ===
        "intermediate"
    );

  const electionDecision =
    Number(
      gameState.settings
        ?.intermediateElectionAt ??
      24
    );

  const decisionsTaken =
    Number(
      gameState.government
        ?.decisionsTaken ?? 0
    );

  const mustHoldElection =
    decisionsTaken >=
      electionDecision &&
    !alreadyCompleted;

  if (mustHoldElection) {
    startElection(
      "intermediate"
    );

    return;
  }

  showNextDecision();
}

function showAboutScreen() {
  removeNationFeedSidebar();

  renderAboutScreen({
    onBack: showHomeScreen
  });
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

function openDebugDecision(
  decisionId
) {
  if (!gameState) {
    window.alert(
      "Inicie uma partida antes de abrir um evento."
    );

    return;
  }

  const decision = DECISIONS.find(
    (item) =>
      item.id === decisionId
  );

  if (!decision) {
    window.alert(
      `Evento não encontrado: ${decisionId}`
    );

    return;
  }

  debugForcedDecisionId =
    decisionId;

  showNextDecision();
}

installDebugPanel({
  getGameState: () => gameState,
  decisions: DECISIONS,
  endings: ENDINGS,

  onOpenDecision: openDebugDecision,

  onApplyState: applyDebugState,

  onResetUsedDecisions: () => {
    if (!gameState) return;

    gameState.usedDecisionIds = [];
    saveGame(gameState);
  },

  onForceEnding: (endingId) => {
    const ending = Object.values(
      ENDINGS
    ).find(
      (item) => item.id === endingId
    );

    if (ending) {
      showEnding(ending);
    }
  },

  onClearSave: () => {
    clearSavedGame();
    gameState = null;
    currentDecision = null;
    showHomeScreen();
  },

  onGoHome: showHomeScreen
});

function applyDebugState(values) {
  if (!gameState) {
    window.alert(
      "Inicie uma partida antes de alterar o estado."
    );
    return;
  }

  gameState.indicators = {
    ...gameState.indicators,
    ...values.indicators
  };

  gameState.corruption =
    values.corruption;

  gameState.player.personalWealth =
    values.personalWealth;

  gameState.government.decisionsTaken =
    values.government.decisionsTaken;

  gameState.government.decisions =
    values.government.decisionsTaken;

  gameState.government.year =
    values.government.year;

  gameState.government.month =
    values.government.month;

  saveGame(gameState);
}