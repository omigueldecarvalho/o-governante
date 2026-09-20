const GAME_DURATION = 20000;
const LANES = 5;

const ITEMS = {
  cash: {
    icon: "💵",
    className: "cash",
    money: 250000,
    corruption: 2,
    evidence: 0
  },

  bigCash: {
    icon: "💰",
    className: "big-cash",
    money: 600000,
    corruption: 4,
    evidence: 0
  },

  receipt: {
    icon: "🧾",
    className: "receipt",
    money: 0,
    corruption: 0,
    evidence: 1
  },

  camera: {
    icon: "📸",
    className: "camera",
    money: 0,
    corruption: 0,
    evidence: 2
  },

  orange: {
    icon: "🍊",
    className: "orange",
    money: 0,
    corruption: 1,
    evidence: -1
  },

  police: {
    icon: "🚔",
    className: "police",
    money: 0,
    corruption: 0,
    evidence: 4
  }
};

function formatCurrency(value) {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    }
  ).format(value);
}

function randomBetween(
  minimum,
  maximum
) {
  return Math.floor(
    Math.random() *
      (maximum - minimum + 1)
  ) + minimum;
}

function selectRandomItem() {
  const random = Math.random() * 100;

  if (random < 43) {
    return "cash";
  }

  if (random < 58) {
    return "bigCash";
  }

  if (random < 70) {
    return "receipt";
  }

  if (random < 82) {
    return "camera";
  }

  if (random < 93) {
    return "orange";
  }

  return "police";
}

export function renderMoneySuitcaseGame({
  gameState,
  decision,
  onComplete
}) {
  const app =
    document.querySelector("#app");

  let playerLane = 2;
  let collectedMoney = 0;
  let corruptionGained = 0;
  let evidence = 0;
  let policeCaught = false;
  let finished = false;

  let fallingItems = [];
  let spawnInterval = null;
  let gameInterval = null;
  let startedAt = null;

  renderOffer();

  function renderOffer() {
    app.innerHTML = `
      <section class="screen suitcase-offer-screen">
        <header class="suitcase-offer-header">
          <p class="eyebrow">
            Entrega não registrada
          </p>

          <h1>${decision.title}</h1>

          <p>
            Um empresário deixou uma mala
            destrancada no estacionamento.
          </p>
        </header>

        <div class="suitcase-offer">
          <div class="suitcase-big-icon">
            💼
          </div>

          <div class="suitcase-question">
            <strong>
              “Presidente, ninguém precisa
              saber de onde veio.”
            </strong>
          </div>
        </div>

        <div class="suitcase-offer-actions">
          <button
            type="button"
            class="secondary-button"
            id="refuse-suitcase"
          >
            🚨 Recusar e denunciar
          </button>

          <button
            type="button"
            class="primary-button"
            id="accept-suitcase"
          >
            💼 Abrir a mala
          </button>
        </div>
      </section>
    `;

    document
      .querySelector(
        "#refuse-suitcase"
      )
      .addEventListener(
        "click",
        refuseSuitcase
      );

    document
      .querySelector(
        "#accept-suitcase"
      )
      .addEventListener(
        "click",
        startGame
      );
  }

  function refuseSuitcase() {
    onComplete({
      id: "refuse-money-suitcase",

      text: "Recusar e denunciar",

      resultText:
        "O governante recusou a mala e denunciou a tentativa de suborno. O empresário afirma que tudo não passou de um mal-entendido logístico.",

      effects: {
        indicators: {
          people: 7,
          congress: -3,
          economy: -2,
          stability: 5
        },

        factions: {
          business: -8,
          socialMovements: 5,
          press: 8
        },

        country: {},

        politics: {
          personalism: -3
        },

        corruption: -10,
        personalWealth: 0
      },

      metadata: {
        suitcase: {
          accepted: false,
          collectedMoney: 0,
          exposed: false
        }
      }
    });
  }

  function startGame() {
    playerLane = 2;
    collectedMoney = 0;
    corruptionGained = 0;
    evidence = 0;
    policeCaught = false;
    finished = false;
    fallingItems = [];

    app.innerHTML = `
      <section class="screen suitcase-game-screen">
        <header class="suitcase-game-header">
          <div>
            <p class="eyebrow">
              Operação Mala Cheia
            </p>

            <h1>Pegue e guarde</h1>
          </div>

          <div class="suitcase-timer">
            <strong id="suitcase-time">
              20
            </strong>

            <small>segundos</small>
          </div>
        </header>

        <div class="suitcase-time-bar">
          <div
            id="suitcase-time-progress"
          ></div>
        </div>

        <div class="suitcase-scoreboard">
          <span>
            💵
            <strong id="collected-money">
              ${formatCurrency(0)}
            </strong>
          </span>

          <span>
            🧾 Provas:
            <strong id="suitcase-evidence">
              0
            </strong>
          </span>

          <span>
            ⚠️ Corrupção:
            <strong id="suitcase-corruption">
              +0
            </strong>
          </span>
        </div>

        <div
          class="suitcase-playfield"
          id="suitcase-playfield"
        >
          ${Array.from(
            { length: LANES },
            (_, index) => `
              <div
                class="suitcase-lane"
                style="left: ${
                  index * 20
                }%"
              ></div>
            `
          ).join("")}

          <div
            class="player-suitcase"
            id="player-suitcase"
          >
            💼
          </div>
        </div>

        <div class="suitcase-controls">
          <button
            type="button"
            id="move-suitcase-left"
          >
            ◀
          </button>

          <button
            type="button"
            class="suitcase-run-button"
            id="finish-suitcase"
          >
            🏃 Fugir com o dinheiro
          </button>

          <button
            type="button"
            id="move-suitcase-right"
          >
            ▶
          </button>
        </div>

        <div class="suitcase-legend">
          <span>💵 Dinheiro</span>
          <span>📸 Fotógrafo</span>
          <span>🧾 Prova</span>
          <span>🍊 Laranja</span>
          <span>🚔 PF</span>
        </div>
      </section>
    `;

    updatePlayerPosition();

    document
      .querySelector(
        "#move-suitcase-left"
      )
      .addEventListener(
        "click",
        () => movePlayer(-1)
      );

    document
      .querySelector(
        "#move-suitcase-right"
      )
      .addEventListener(
        "click",
        () => movePlayer(1)
      );

    document
      .querySelector(
        "#finish-suitcase"
      )
      .addEventListener(
        "click",
        () => finishGame(false)
      );

    document.addEventListener(
      "keydown",
      handleKeyboard
    );

    startedAt = Date.now();

    spawnInterval = setInterval(
      spawnItem,
      620
    );

    gameInterval = setInterval(
      updateGame,
      50
    );
  }

  function handleKeyboard(event) {
    if (
      event.key === "ArrowLeft" ||
      event.key.toLowerCase() === "a"
    ) {
      event.preventDefault();
      movePlayer(-1);
    }

    if (
      event.key === "ArrowRight" ||
      event.key.toLowerCase() === "d"
    ) {
      event.preventDefault();
      movePlayer(1);
    }
  }

  function movePlayer(direction) {
    if (finished) {
      return;
    }

    playerLane = Math.max(
      0,
      Math.min(
        LANES - 1,
        playerLane + direction
      )
    );

    updatePlayerPosition();
  }

  function updatePlayerPosition() {
    const suitcase =
      document.querySelector(
        "#player-suitcase"
      );

    if (!suitcase) {
      return;
    }

    suitcase.style.left =
      `${playerLane * 20 + 10}%`;
  }

  function spawnItem() {
    if (finished) {
      return;
    }

    const playfield =
      document.querySelector(
        "#suitcase-playfield"
      );

    if (!playfield) {
      return;
    }

    const typeId =
      selectRandomItem();

    const type = ITEMS[typeId];

    const lane =
      randomBetween(0, LANES - 1);

    const element =
      document.createElement("div");

    element.className =
      `falling-suitcase-item ${type.className}`;

    element.textContent = type.icon;

    element.style.left =
      `${lane * 20 + 10}%`;

    element.style.top = "-10%";

    playfield.appendChild(element);

    fallingItems.push({
      id:
        `${Date.now()}-${Math.random()}`,

      typeId,
      type,
      lane,
      y: -10,
      speed:
        randomBetween(18, 28) / 10,
      element
    });
  }

  function updateGame() {
    if (finished) {
      return;
    }

    const elapsed =
      Date.now() - startedAt;

    const remaining =
      Math.max(
        0,
        GAME_DURATION - elapsed
      );

    updateTimer(remaining);

    fallingItems.forEach((item) => {
      item.y += item.speed;

      item.element.style.top =
        `${item.y}%`;

      const reachedSuitcase =
        item.y >= 76 &&
        item.y <= 92;

      if (
        reachedSuitcase &&
        item.lane === playerLane
      ) {
        collectItem(item);
      }
    });

    fallingItems =
      fallingItems.filter((item) => {
        const shouldRemove =
          item.collected ||
          item.y > 105;

        if (
          shouldRemove &&
          item.element.isConnected
        ) {
          item.element.remove();
        }

        return !shouldRemove;
      });

    if (remaining <= 0) {
      finishGame(false);
    }
  }

  function updateTimer(remaining) {
    const seconds =
      Math.ceil(remaining / 1000);

    const percentage =
      remaining /
      GAME_DURATION *
      100;

    const timeElement =
      document.querySelector(
        "#suitcase-time"
      );

    const progressElement =
      document.querySelector(
        "#suitcase-time-progress"
      );

    if (timeElement) {
      timeElement.textContent =
        seconds;
    }

    if (progressElement) {
      progressElement.style.width =
        `${percentage}%`;

      progressElement.classList.toggle(
        "danger",
        seconds <= 5
      );
    }
  }

  function collectItem(item) {
    if (item.collected) {
      return;
    }

    item.collected = true;

    item.element.classList.add(
      "collected"
    );

    if (item.typeId === "police") {
      policeCaught = true;
      evidence += 4;

      updateScoreboard();

      setTimeout(() => {
        finishGame(true);
      }, 250);

      return;
    }

    collectedMoney +=
      item.type.money;

    corruptionGained +=
      item.type.corruption;

    evidence = Math.max(
      0,
      evidence +
        item.type.evidence
    );

    updateScoreboard();
  }

  function updateScoreboard() {
    const moneyElement =
      document.querySelector(
        "#collected-money"
      );

    const evidenceElement =
      document.querySelector(
        "#suitcase-evidence"
      );

    const corruptionElement =
      document.querySelector(
        "#suitcase-corruption"
      );

    if (moneyElement) {
      moneyElement.textContent =
        formatCurrency(
          collectedMoney
        );
    }

    if (evidenceElement) {
      evidenceElement.textContent =
        evidence;
    }

    if (corruptionElement) {
      corruptionElement.textContent =
        `+${corruptionGained}`;
    }
  }

  function clearGame() {
    clearInterval(spawnInterval);
    clearInterval(gameInterval);

    document.removeEventListener(
      "keydown",
      handleKeyboard
    );
  }

  function finishGame(caughtByPolice) {
    if (finished) {
      return;
    }

    finished = true;
    policeCaught =
      policeCaught ||
      caughtByPolice;

    clearGame();

    calculateFinalResult();
  }

  function calculateFinalResult() {
    const currentCorruption =
      gameState.corruption ?? 0;

    const risk =
      Math.min(
        90,
        evidence * 14 +
        collectedMoney /
          250000 *
          1.5 +
        currentCorruption * 0.12
      );

    const exposed =
      policeCaught ||
      Math.random() * 100 < risk;

    const confiscationRate =
      policeCaught
        ? 0.8
        : exposed
          ? 0.25
          : 0;

    const confiscatedMoney =
      Math.floor(
        collectedMoney *
        confiscationRate
      );

    const finalMoney =
      Math.max(
        0,
        collectedMoney -
          confiscatedMoney
      );

    const effects = {
      indicators: {
        people: 0,
        congress: 2,
        economy: 1,
        stability: 0
      },

      factions: {
        business: 5,
        press: 0
      },

      country: {},

      politics: {
        personalism: 5
      },

      corruption:
        corruptionGained,

      personalWealth:
        finalMoney
    };

    if (exposed) {
      effects.indicators.people -= 12;
      effects.indicators.congress -= 7;
      effects.indicators.stability -= 9;

      effects.factions.press -= 14;

      effects.politics.personalism += 5;

      effects.corruption +=
        policeCaught ? 14 : 9;
    }

    showResult({
      risk: Math.round(risk),
      exposed,
      confiscatedMoney,
      finalMoney,
      effects
    });
  }

  function showResult(result) {
    let title;
    let nickname;
    let icon;

    if (policeCaught) {
      title =
        "A PF chegou primeiro";

      nickname =
        "Operação Mala Sem Alça";

      icon = "🚔";
    } else if (result.exposed) {
      title =
        "A mala apareceu no jornal";

      nickname =
        "Empresário sem empresa";

      icon = "📸";
    } else if (
      collectedMoney >= 2000000
    ) {
      title =
        "A mala voltou pesada";

      nickname =
        "Operador de sucesso";

      icon = "💰";
    } else if (
      collectedMoney > 0
    ) {
      title =
        "Caixinha garantida";

      nickname =
        "Corrupto em treinamento";

      icon = "💵";
    } else {
      title =
        "Não pegou nem uma nota";

      nickname =
        "Corrupto incompetente";

      icon = "🫥";
    }

    let resultText =
      `Você coletou ${formatCurrency(
        collectedMoney
      )}.`;

    if (
      result.confiscatedMoney > 0
    ) {
      resultText +=
        ` Foram confiscados ${formatCurrency(
          result.confiscatedMoney
        )}.`;
    }

    if (result.exposed) {
      resultText +=
        " A origem da mala virou assunto nacional.";
    } else {
      resultText +=
        " Ninguém conseguiu provar de onde veio o dinheiro.";
    }

    app.innerHTML = `
      <section class="screen suitcase-result-screen">
        <div class="suitcase-result-icon">
          ${icon}
        </div>

        <p class="eyebrow">
          Fim da coleta
        </p>

        <h1>${title}</h1>

        <strong class="suitcase-nickname">
          ${nickname}
        </strong>

        <div class="suitcase-result-values">
          <div>
            <small>Coletado</small>

            <strong>
              ${formatCurrency(
                collectedMoney
              )}
            </strong>
          </div>

          <div>
            <small>Guardado</small>

            <strong>
              ${formatCurrency(
                result.finalMoney
              )}
            </strong>
          </div>

          <div>
            <small>Risco</small>

            <strong>
              ${result.risk}%
            </strong>
          </div>
        </div>

        <p>${resultText}</p>

        <div
          class="${
            result.exposed
              ? "suitcase-exposed"
              : "suitcase-hidden"
          }"
        >
          ${
            result.exposed
              ? "📸 ESQUEMA DESCOBERTO"
              : "🥸 OPERAÇÃO ABAFADA"
          }
        </div>

        <button
          type="button"
          class="primary-button"
          id="continue-suitcase"
        >
          Continuar governo
        </button>
      </section>
    `;

    document
      .querySelector(
        "#continue-suitcase"
      )
      .addEventListener(
        "click",
        () => {
          onComplete({
            id:
              result.exposed
                ? "suitcase-exposed"
                : "suitcase-hidden",

            text:
              "Aceitar a mala",

            resultText,

            effects:
              result.effects,

            metadata: {
              suitcase: {
                accepted: true,
                collectedMoney,
                finalMoney:
                  result.finalMoney,
                confiscatedMoney:
                  result
                    .confiscatedMoney,
                corruptionGained,
                evidence,
                risk:
                  result.risk,
                exposed:
                  result.exposed,
                policeCaught
              }
            }
          });
        }
      );
  }
}