const GAME_DURATION = 25000;
const LANES = 3;
const MAX_LIVES = 3;

const ROAD_ITEMS = {
  suspectCar: {
    icon: "🚙",
    className: "obstacle",
    damage: 1
  },

  truck: {
    icon: "🚛",
    className: "obstacle truck",
    damage: 2
  },

  roadblock: {
    icon: "🚧",
    className: "obstacle",
    damage: 1
  },

  pothole: {
    icon: "🕳️",
    className: "obstacle pothole",
    damage: 1
  },

  evidence: {
    icon: "📁",
    className: "bonus evidence",
    damage: 0
  },

  shield: {
    icon: "🛡️",
    className: "bonus shield",
    damage: 0
  },

  repair: {
    icon: "🔧",
    className: "bonus repair",
    damage: 0
  }
};

function randomBetween(
  minimum,
  maximum
) {
  return Math.floor(
    Math.random() *
      (maximum - minimum + 1)
  ) + minimum;
}

function selectRoadItem() {
  const random = Math.random() * 100;

  if (random < 25) {
    return "suspectCar";
  }

  if (random < 39) {
    return "truck";
  }

  if (random < 56) {
    return "roadblock";
  }

  if (random < 70) {
    return "pothole";
  }

  if (random < 83) {
    return "evidence";
  }

  if (random < 93) {
    return "shield";
  }

  return "repair";
}

export function renderJKRoadGame({
  gameState,
  decision,
  onComplete
}) {
  const app =
    document.querySelector("#app");

  let playerLane = 1;
  let lives = MAX_LIVES;
  let shields = 0;
  let evidence = 0;
  let distance = 0;
  let finished = false;

  let roadItems = [];
  let startedAt = 0;
  let spawnInterval = null;
  let gameInterval = null;

  renderIntroduction();

  function renderIntroduction() {
    app.innerHTML = `
      <section class="screen jk-introduction-screen">
        <header class="jk-introduction-header">
          <p class="eyebrow">
            Segurança presidencial
          </p>

          <h1>${decision.title}</h1>

          <p>
            Um veículo desconhecido foi
            visto acompanhando o comboio.
          </p>
        </header>

        <div class="jk-warning-card">
          <div class="jk-warning-icon">
            🚗
          </div>

          <div>
            <strong>
              A viagem pode ser uma armadilha
            </strong>

            <p>
              A segurança recomenda cancelar.
              A agenda pública recomenda ir.
            </p>
          </div>
        </div>

        <div class="jk-introduction-actions">
          <button
            type="button"
            class="secondary-button"
            id="cancel-jk-trip"
          >
            🏛️ Cancelar a viagem
          </button>

          <button
            type="button"
            class="primary-button"
            id="start-jk-trip"
          >
            🚗 Manter a agenda
          </button>
        </div>

        <small class="jk-disclaimer">
          Evento satírico inspirado em
          teorias históricas. Não representa
          uma afirmação de sabotagem real.
        </small>
      </section>
    `;

    document
      .querySelector(
        "#cancel-jk-trip"
      )
      .addEventListener(
        "click",
        cancelTrip
      );

    document
      .querySelector(
        "#start-jk-trip"
      )
      .addEventListener(
        "click",
        startGame
      );
  }

  function cancelTrip() {
    onComplete({
      id: "cancel-jk-trip",

      text: "Cancelar a viagem",

      resultText:
        "O governante cancelou a viagem após receber alertas de segurança. A oposição chamou a decisão de covardia, mas o comboio permaneceu intacto.",

      effects: {
        indicators: {
          people: -5,
          congress: -2,
          economy: -1,
          stability: 4
        },

        factions: {
          military: 4,
          press: -2
        },

        country: {},

        politics: {
          personalism: 2
        },

        corruption: 0,
        personalWealth: 0
      },

      metadata: {
        jkRoad: {
          accepted: false,
          crashed: false
        }
      }
    });
  }

  function startGame() {
    playerLane = 1;
    lives = MAX_LIVES;
    shields = 0;
    evidence = 0;
    distance = 0;
    finished = false;
    roadItems = [];

    app.innerHTML = `
      <section class="screen jk-road-screen">
        <header class="jk-road-header">
          <div>
            <p class="eyebrow">
              Operação Peixe-Vivo
            </p>

            <h1>Proteja o comboio</h1>
          </div>

          <div class="jk-time">
            <strong id="jk-time">
              25
            </strong>

            <small>segundos</small>
          </div>
        </header>

        <div class="jk-time-bar">
          <div id="jk-time-progress"></div>
        </div>

        <div class="jk-scoreboard">
          <span>
            ❤️
            <strong id="jk-lives">
              ${lives}
            </strong>
          </span>

          <span>
            🛡️
            <strong id="jk-shields">
              ${shields}
            </strong>
          </span>

          <span>
            📁 Provas:
            <strong id="jk-evidence">
              ${evidence}
            </strong>
          </span>

          <span>
            🛣️
            <strong id="jk-distance">
              0 km
            </strong>
          </span>
        </div>

        <div
          class="jk-road"
          id="jk-road"
        >
          <div class="jk-road-shoulder left"></div>
          <div class="jk-road-shoulder right"></div>

          ${Array.from(
            { length: LANES - 1 },
            (_, index) => `
              <div
                class="jk-lane-divider"
                style="left: ${
                  (index + 1) *
                  (100 / LANES)
                }%"
              ></div>
            `
          ).join("")}

          <div
            class="jk-presidential-car"
            id="jk-presidential-car"
          >
            🚘
          </div>
        </div>

        <div class="jk-controls">
          <button
            type="button"
            id="jk-move-left"
          >
            ◀
          </button>

          <div>
            A / D ou ← / →
          </div>

          <button
            type="button"
            id="jk-move-right"
          >
            ▶
          </button>
        </div>

        <div class="jk-legend">
          <span>📁 Prova</span>
          <span>🛡️ Escolta</span>
          <span>🔧 Reparo</span>
          <span>🚧 Obstáculo</span>
        </div>
      </section>
    `;

    updatePlayerPosition();

    document
      .querySelector("#jk-move-left")
      .addEventListener(
        "click",
        () => movePlayer(-1)
      );

    document
      .querySelector("#jk-move-right")
      .addEventListener(
        "click",
        () => movePlayer(1)
      );

    document.addEventListener(
      "keydown",
      handleKeyboard
    );

    startedAt = Date.now();

    spawnInterval = setInterval(
      spawnRoadItem,
      760
    );

    gameInterval = setInterval(
      updateGame,
      50
    );
  }

  function handleKeyboard(event) {
    const key = event.key.toLowerCase();

    if (
      event.key === "ArrowLeft" ||
      key === "a"
    ) {
      event.preventDefault();
      movePlayer(-1);
    }

    if (
      event.key === "ArrowRight" ||
      key === "d"
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
    const car =
      document.querySelector(
        "#jk-presidential-car"
      );

    if (!car) {
      return;
    }

    car.style.left =
      `${
        playerLane *
          (100 / LANES) +
        100 / LANES / 2
      }%`;
  }

  function spawnRoadItem() {
    if (finished) {
      return;
    }

    const road =
      document.querySelector("#jk-road");

    if (!road) {
      return;
    }

    const typeId = selectRoadItem();
    const type = ROAD_ITEMS[typeId];

    const lane = randomBetween(
      0,
      LANES - 1
    );

    const element =
      document.createElement("div");

    element.className =
      `jk-road-item ${type.className}`;

    element.textContent = type.icon;

    element.style.left =
      `${
        lane *
          (100 / LANES) +
        100 / LANES / 2
      }%`;

    element.style.top = "-15%";

    road.appendChild(element);

    roadItems.push({
      typeId,
      type,
      lane,
      y: -15,
      baseSpeed:
        randomBetween(17, 23) / 10,
      element,
      collected: false
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

    distance = Math.floor(
      elapsed / 250
    );

    updateInformation(remaining);

    const speedIncrease =
      elapsed / 18000;

    roadItems.forEach((item) => {
      item.y +=
        item.baseSpeed +
        speedIncrease;

      item.element.style.top =
        `${item.y}%`;

      const reachedPlayer =
        item.y >= 73 &&
        item.y <= 91;

      if (
        reachedPlayer &&
        item.lane === playerLane &&
        !item.collected
      ) {
        collectRoadItem(item);
      }
    });

    roadItems = roadItems.filter(
      (item) => {
        const remove =
          item.collected ||
          item.y > 110;

        if (
          remove &&
          item.element.isConnected
        ) {
          item.element.remove();
        }

        return !remove;
      }
    );

    if (remaining <= 0) {
      finishGame(false);
    }
  }

  function collectRoadItem(item) {
    item.collected = true;

    item.element.classList.add(
      "collected"
    );

    if (item.typeId === "evidence") {
      evidence += 1;
      updateInformation();
      return;
    }

    if (item.typeId === "shield") {
      shields += 1;
      updateInformation();
      return;
    }

    if (item.typeId === "repair") {
      lives = Math.min(
        MAX_LIVES,
        lives + 1
      );

      updateInformation();
      return;
    }

    if (item.type.damage > 0) {
      applyDamage(item.type.damage);
    }
  }

  function applyDamage(damage) {
    const car =
      document.querySelector(
        "#jk-presidential-car"
      );

    if (shields > 0) {
      shields -= 1;

      car?.classList.add(
        "protected"
      );
    } else {
      lives -= damage;

      car?.classList.add(
        "damaged"
      );
    }

    updateInformation();

    setTimeout(() => {
      car?.classList.remove(
        "protected",
        "damaged"
      );
    }, 350);

    if (lives <= 0) {
      lives = 0;

      setTimeout(() => {
        finishGame(true);
      }, 300);
    }
  }

  function updateInformation(
    remaining = null
  ) {
    if (remaining !== null) {
      const seconds =
        Math.ceil(remaining / 1000);

      const percentage =
        remaining /
        GAME_DURATION *
        100;

      const timeElement =
        document.querySelector(
          "#jk-time"
        );

      const progressElement =
        document.querySelector(
          "#jk-time-progress"
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

    const livesElement =
      document.querySelector(
        "#jk-lives"
      );

    const shieldsElement =
      document.querySelector(
        "#jk-shields"
      );

    const evidenceElement =
      document.querySelector(
        "#jk-evidence"
      );

    const distanceElement =
      document.querySelector(
        "#jk-distance"
      );

    if (livesElement) {
      livesElement.textContent =
        Math.max(0, lives);
    }

    if (shieldsElement) {
      shieldsElement.textContent =
        shields;
    }

    if (evidenceElement) {
      evidenceElement.textContent =
        evidence;
    }

    if (distanceElement) {
      distanceElement.textContent =
        `${distance} km`;
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

  function finishGame(crashed) {
    if (finished) {
      return;
    }

    finished = true;
    clearGame();

    showResult(crashed);
  }

  function showResult(crashed) {
    const foundSabotage =
      evidence >= 2;

    const effects = {
      indicators: {
        people: 0,
        congress: 0,
        economy: 0,
        stability: 0
      },

      factions: {
        military: 0,
        press: 0
      },

      country: {},

      politics: {
        personalism: 0
      },

      corruption: 0,
      personalWealth: 0
    };

    let title;
    let resultText;
    let icon;
    let resultClass;

    if (crashed) {
      title =
        "Acidente na estrada";

      resultText =
        "O comboio presidencial foi atingido após uma sequência de incidentes. O governo terminou sob suspeitas e versões contraditórias.";

      icon = "💥";
      resultClass = "crashed";

      effects.indicators.people = -25;
      effects.indicators.congress = -20;
      effects.indicators.economy = -15;
      effects.indicators.stability = -100;

      effects.factions.military = -15;
      effects.factions.press = -8;
    } else if (foundSabotage) {
      title =
        "Sabotagem descoberta";

      resultText =
        "O comboio chegou ao destino e reuniu provas suficientes para revelar uma tentativa de sabotagem.";

      icon = "📁";
      resultClass = "evidence";

      effects.indicators.people = 11;
      effects.indicators.congress = 5;
      effects.indicators.economy = -2;
      effects.indicators.stability = 10;

      effects.factions.military = 8;
      effects.factions.press = 9;

      effects.politics.personalism = 3;
    } else {
      title =
        "Viagem concluída";

      resultText =
        "O comboio chegou ao destino. Os veículos suspeitos desapareceram antes que qualquer prova fosse encontrada.";

      icon = "🏁";
      resultClass = "survived";

      effects.indicators.people = 7;
      effects.indicators.congress = 2;
      effects.indicators.economy = -2;
      effects.indicators.stability = 6;

      effects.factions.military = 5;
      effects.factions.press = 2;

      effects.politics.personalism = 2;
    }

    app.innerHTML = `
      <section class="screen jk-result-screen">
        <div
          class="jk-result-icon ${
            resultClass
          }"
        >
          ${icon}
        </div>

        <p class="eyebrow">
          Fim da viagem
        </p>

        <h1>${title}</h1>

        <div class="jk-result-stats">
          <div>
            <small>Distância</small>

            <strong>
              ${distance} km
            </strong>
          </div>

          <div>
            <small>Provas</small>

            <strong>
              ${evidence}
            </strong>
          </div>

          <div>
            <small>Veículo</small>

            <strong>
              ${
                crashed
                  ? "Destruído"
                  : `${lives}/3`
              }
            </strong>
          </div>
        </div>

        <p class="jk-result-description">
          ${resultText}
        </p>

        <button
          type="button"
          class="primary-button"
          id="finish-jk-event"
        >
          ${
            crashed
              ? "Encerrar governo"
              : "Continuar governo"
          }
        </button>
      </section>
    `;

    document
      .querySelector(
        "#finish-jk-event"
      )
      .addEventListener(
        "click",
        () => {
          onComplete({
            id:
              crashed
                ? "jk-road-crash"
                : foundSabotage
                  ? "jk-sabotage-found"
                  : "jk-road-survived",

            text:
              "Manter a agenda",

            resultText,

            effects,

            metadata: {
              jkRoad: {
                accepted: true,
                crashed,
                evidence,
                distance,
                remainingLives:
                  Math.max(0, lives)
              }
            }
          });
        }
      );
  }
}