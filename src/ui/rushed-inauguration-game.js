const BOARD_SIZE = 4;
const GAME_DURATION = 35000;

const DIRECTIONS = {
  N: {
    row: -1,
    column: 0,
    opposite: "S"
  },

  E: {
    row: 0,
    column: 1,
    opposite: "W"
  },

  S: {
    row: 1,
    column: 0,
    opposite: "N"
  },

  W: {
    row: 0,
    column: -1,
    opposite: "E"
  }
};

const PATH_TILE_IDS = new Set([
  1, 2, 4, 5, 6, 7
]);

function createTiles() {
  const configurations = [
    "curve",
    "curve",
    "curve",
    "straight",

    "straight",
    "curve",
    "curve",
    "straight",

    "curve",
    "straight",
    "curve",
    "curve",

    "straight",
    "curve",
    "straight",
    "curve"
  ];

  return configurations.map(
    (type, id) => ({
      id,
      type,
      rotation:
        Math.floor(Math.random() * 4)
    })
  );
}

function getTileConnectors(tile) {
  const rotation =
    tile.rotation % 4;

  if (tile.type === "straight") {
    return rotation % 2 === 0
      ? ["W", "E"]
      : ["N", "S"];
  }

  const curveConnectors = [
    ["N", "E"],
    ["E", "S"],
    ["S", "W"],
    ["W", "N"]
  ];

  return curveConnectors[rotation];
}

function getTilePosition(tileId) {
  return {
    row:
      Math.floor(
        tileId / BOARD_SIZE
      ),

    column:
      tileId % BOARD_SIZE
  };
}

function getTileId(
  row,
  column
) {
  if (
    row < 0 ||
    column < 0 ||
    row >= BOARD_SIZE ||
    column >= BOARD_SIZE
  ) {
    return null;
  }

  return (
    row * BOARD_SIZE +
    column
  );
}

function inspectRoad(tiles) {
  const startTile = tiles[4];
  const startConnectors =
    getTileConnectors(startTile);

  const visited = new Set();

  if (
    !startConnectors.includes("W")
  ) {
    return {
      success: false,
      visited,
      completion: 0
    };
  }

  const queue = [4];
  visited.add(4);

  while (queue.length > 0) {
    const currentId = queue.shift();

    const currentTile =
      tiles[currentId];

    const currentPosition =
      getTilePosition(currentId);

    const connectors =
      getTileConnectors(
        currentTile
      );

    connectors.forEach(
      (directionId) => {
        const direction =
          DIRECTIONS[directionId];

        const neighborId =
          getTileId(
            currentPosition.row +
              direction.row,

            currentPosition.column +
              direction.column
          );

        if (neighborId === null) {
          return;
        }

        const neighborTile =
          tiles[neighborId];

        const neighborConnectors =
          getTileConnectors(
            neighborTile
          );

        if (
          neighborConnectors.includes(
            direction.opposite
          ) &&
          !visited.has(neighborId)
        ) {
          visited.add(neighborId);
          queue.push(neighborId);
        }
      }
    );
  }

  const destinationTile =
    tiles[7];

  const reachedDestination =
    visited.has(7) &&
    getTileConnectors(
      destinationTile
    ).includes("E");

  const connectedPathTiles =
    [...PATH_TILE_IDS].filter(
      (tileId) =>
        visited.has(tileId)
    ).length;

  const completion =
    connectedPathTiles /
    PATH_TILE_IDS.size;

  return {
    success: reachedDestination,
    visited,
    completion
  };
}

function renderTileRoad(
  connectors
) {
  return `
    <span class="road-center"></span>

    ${connectors
      .map(
        (direction) => `
          <span
            class="
              road-arm
              road-arm--${direction}
            "
          ></span>
        `
      )
      .join("")}
  `;
}

export function renderRushedInaugurationGame({
  gameState,
  decision,
  onComplete
}) {
  const app =
    document.querySelector("#app");

  let tiles = [];
  let startedAt = 0;
  let timerId = null;
  let finished = false;
  let lastInspection = null;

  renderIntroduction();

  function renderIntroduction() {
    app.innerHTML = `
      <section class="screen inauguration-introduction">
        <header>
          <p class="eyebrow">
            Promessa de campanha
          </p>

          <h1>${decision.title}</h1>

          <p>
            A eleição se aproxima e a
            estrada até o novo hospital
            continua incompleta.
          </p>
        </header>

        <div class="inauguration-project">
          <span>🏙️</span>

          <div class="unfinished-road">
            <i></i>
            <i></i>
            <i></i>
          </div>

          <span>🏥</span>
        </div>

        <div class="inauguration-actions">
          <button
            type="button"
            class="secondary-button"
            id="postpone-inauguration"
          >
            📋 Adiar a inauguração
          </button>

          <button
            type="button"
            class="primary-button"
            id="start-construction"
          >
            🚧 Terminar às pressas
          </button>
        </div>
      </section>
    `;

    document
      .querySelector(
        "#postpone-inauguration"
      )
      .addEventListener(
        "click",
        postponeProject
      );

    document
      .querySelector(
        "#start-construction"
      )
      .addEventListener(
        "click",
        startConstruction
      );
  }

  function postponeProject() {
    onComplete({
      id: "postpone-inauguration",

      text: "Adiar a inauguração",

      resultText:
        "O governo recusou inaugurar uma estrada incompleta. A decisão foi responsável, embora péssima para as fotografias da campanha.",

      effects: {
        indicators: {
          people: -6,
          congress: -2,
          economy: -2,
          stability: 5
        },

        factions: {
          business: -4,
          press: 5,
          socialMovements: 2
        },

        country: {
          publicServices: 1
        },

        politics: {
          personalism: -4
        },

        corruption: -5,
        personalWealth: 0
      },

      metadata: {
        inauguration: {
          attempted: false,
          completed: false
        }
      }
    });
  }

  function startConstruction() {
    tiles = createTiles();

    /*
     * Impede que o tabuleiro comece
     * resolvido por sorte.
     */
    if (inspectRoad(tiles).success) {
      tiles[4].rotation += 1;
    }

    finished = false;
    startedAt = Date.now();

    app.innerHTML = `
      <section class="screen inauguration-game-screen">
        <header class="inauguration-game-header">
          <div>
            <p class="eyebrow">
              Mutirão eleitoral
            </p>

            <h1>Conecte a estrada</h1>
          </div>

          <div class="inauguration-timer">
            <strong id="inauguration-time">
              35
            </strong>

            <small>segundos</small>
          </div>
        </header>

        <div class="inauguration-time-bar">
          <div
            id="inauguration-time-progress"
          ></div>
        </div>

        <div class="inauguration-route-labels">
          <span>🏙️ Cidade</span>
          <span>🏥 Hospital</span>
        </div>

        <div class="road-puzzle-wrapper">
          <div class="road-city-marker">
            🏙️
          </div>

          <div
            class="road-puzzle"
            id="road-puzzle"
          ></div>

          <div class="road-hospital-marker">
            🏥
          </div>
        </div>

        <div class="inauguration-information">
          <span>
            🛣️ Conclusão:
            <strong id="road-completion">
              0%
            </strong>
          </span>

          <span id="road-status">
            Trechos desconectados
          </span>
        </div>

        <button
          type="button"
          class="primary-button"
          id="inaugurate-road"
        >
          ✂️ Inaugurar assim mesmo
        </button>

        <small class="inauguration-help">
          Clique nas peças para girá-las.
          Conecte a cidade ao hospital.
        </small>
      </section>
    `;

    updateBoard();

    document
      .querySelector(
        "#inaugurate-road"
      )
      .addEventListener(
        "click",
        finishConstruction
      );

    timerId = setInterval(
      updateTimer,
      100
    );
  }

  function updateBoard() {
    const board =
      document.querySelector(
        "#road-puzzle"
      );

    if (!board) {
      return;
    }

    lastInspection =
      inspectRoad(tiles);

    board.innerHTML = tiles
      .map((tile) => {
        const connectors =
          getTileConnectors(tile);

        const connected =
          lastInspection.visited.has(
            tile.id
          );

        return `
          <button
            type="button"
            class="
              road-tile
              ${
                connected
                  ? "connected"
                  : ""
              }
            "
            data-tile-id="${tile.id}"
          >
            ${renderTileRoad(
              connectors
            )}
          </button>
        `;
      })
      .join("");

    board
      .querySelectorAll(
        ".road-tile"
      )
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            if (finished) {
              return;
            }

            const tileId =
              Number(
                button.dataset.tileId
              );

            tiles[tileId].rotation =
              (
                tiles[tileId]
                  .rotation + 1
              ) % 4;

            updateBoard();
          }
        );
      });

    updateRoadInformation();
  }

  function updateRoadInformation() {
    const completion =
      Math.round(
        lastInspection.completion *
        100
      );

    const completionElement =
      document.querySelector(
        "#road-completion"
      );

    const statusElement =
      document.querySelector(
        "#road-status"
      );

    const button =
      document.querySelector(
        "#inaugurate-road"
      );

    if (completionElement) {
      completionElement.textContent =
        `${completion}%`;
    }

    if (statusElement) {
      statusElement.textContent =
        lastInspection.success
          ? "✅ Estrada conectada"
          : "🚧 Trechos desconectados";

      statusElement.classList.toggle(
        "completed",
        lastInspection.success
      );
    }

    if (button) {
      button.textContent =
        lastInspection.success
          ? "🎉 Inaugurar obra completa"
          : "✂️ Inaugurar assim mesmo";

      button.classList.toggle(
        "completed",
        lastInspection.success
      );
    }
  }

  function updateTimer() {
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

    const seconds =
      Math.ceil(remaining / 1000);

    const percentage =
      remaining /
      GAME_DURATION *
      100;

    const timeElement =
      document.querySelector(
        "#inauguration-time"
      );

    const progressElement =
      document.querySelector(
        "#inauguration-time-progress"
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
        seconds <= 8
      );
    }

    if (remaining <= 0) {
      finishConstruction();
    }
  }

  function finishConstruction() {
    if (finished) {
      return;
    }

    finished = true;
    clearInterval(timerId);

    lastInspection =
      inspectRoad(tiles);

    showResult(
      lastInspection.success,
      lastInspection.completion
    );
  }

  function showResult(
    completed,
    completion
  ) {
    const percentage =
      Math.round(completion * 100);

    const elapsed =
      Math.min(
        GAME_DURATION,
        Date.now() - startedAt
      );

    const secondsUsed =
      Math.ceil(elapsed / 1000);

    let title;
    let label;
    let icon;
    let resultText;
    let effects;
    let futureEffect = null;

    if (completed) {
      const fast =
        secondsUsed <= 18;

      title = fast
        ? "Engenheiro da nação"
        : "Obra entregue no prazo";

      label = fast
        ? "EFICIÊNCIA ELEITORAL"
        : "ESTRADA CONCLUÍDA";

      icon = fast ? "🏆" : "🛣️";

      resultText =
        "A cidade foi conectada ao hospital antes da cerimônia. Pela primeira vez, a faixa foi cortada depois que a obra terminou.";

      effects = {
        indicators: {
          people: fast ? 12 : 9,
          congress: 3,
          economy: 6,
          stability: 6
        },

        factions: {
          business: 5,
          press: 6,
          socialMovements: 4
        },

        country: {
          publicServices: 9,
          inequality: -2
        },

        politics: {
          personalism: 2
        },

        corruption: -2,
        personalWealth: 0
      };
    } else {
      const severity =
        completion >= 0.67
          ? "mild"
          : completion >= 0.34
            ? "medium"
            : "severe";

      title =
        severity === "mild"
          ? "Fita cortada, estrada não"
          : "Ponte para lugar nenhum";

      label =
        "INAUGURADA ASSIM MESMO";

      icon =
        severity === "mild"
          ? "✂️"
          : "🚧";

      resultText =
        `O governo inaugurou a obra com apenas ${percentage}% do caminho conectado. As câmeras evitaram filmar os trechos que terminavam no mato.`;

      effects = {
        indicators: {
          people:
            severity === "mild"
              ? 5
              : 2,

          congress: 4,
          economy: -4,
          stability:
            severity === "severe"
              ? -8
              : -4
        },

        factions: {
          business: 4,
          press: -7,
          socialMovements: -4
        },

        country: {
          publicServices:
            severity === "mild"
              ? 2
              : -2
        },

        politics: {
          personalism: 7
        },

        corruption:
          severity === "severe"
            ? 12
            : 8,

        personalWealth: 0
      };

      const futureSeverity =
        severity === "mild"
          ? {
              people: -7,
              economy: -4,
              stability: -6,
              services: -3,
              corruption: 4
            }
          : severity === "medium"
            ? {
                people: -11,
                economy: -7,
                stability: -10,
                services: -6,
                corruption: 7
              }
            : {
                people: -16,
                economy: -11,
                stability: -15,
                services: -10,
                corruption: 10
              };

      futureEffect = {
        afterMonths:
          severity === "mild"
            ? 6
            : 3,

        message:
          "As chuvas revelaram falhas graves na obra inaugurada às pressas. Trechos cederam e o hospital voltou a ficar isolado.",

        effects: {
          indicators: {
            people:
              futureSeverity.people,

            economy:
              futureSeverity.economy,

            stability:
              futureSeverity.stability
          },

          country: {
            publicServices:
              futureSeverity.services
          },

          corruption:
            futureSeverity.corruption
        }
      };
    }

    app.innerHTML = `
      <section class="screen inauguration-result-screen">
        <div class="inauguration-result-icon">
          ${icon}
        </div>

        <p class="eyebrow">
          Cerimônia de inauguração
        </p>

        <h1>${title}</h1>

        <strong class="inauguration-result-label">
          ${label}
        </strong>

        <div class="inauguration-result-stats">
          <div>
            <small>Conexão</small>
            <strong>${percentage}%</strong>
          </div>

          <div>
            <small>Tempo</small>
            <strong>${secondsUsed}s</strong>
          </div>

          <div>
            <small>Estado</small>

            <strong>
              ${
                completed
                  ? "Completa"
                  : "Improvisada"
              }
            </strong>
          </div>
        </div>

        <p>${resultText}</p>

        ${
          futureEffect
            ? `
              <div class="inauguration-danger">
                ⚠️ A obra pode apresentar
                problemas futuramente
              </div>
            `
            : `
              <div class="inauguration-success">
                ✅ Ligação concluída
              </div>
            `
        }

        <button
          type="button"
          class="primary-button"
          id="continue-inauguration"
        >
          Continuar governo
        </button>
      </section>
    `;

    document
      .querySelector(
        "#continue-inauguration"
      )
      .addEventListener(
        "click",
        () => {
          const choice = {
            id: completed
              ? "complete-inauguration"
              : "incomplete-inauguration",

            text: completed
              ? "Concluir a obra"
              : "Inaugurar assim mesmo",

            resultText,
            effects,

            metadata: {
              inauguration: {
                attempted: true,
                completed,
                completion:
                  percentage,
                secondsUsed
              }
            }
          };

          if (futureEffect) {
            choice.futureEffect =
              futureEffect;
          }

          onComplete(choice);
        }
      );
  }
}