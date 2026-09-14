const ACTIVE_CELLS = [
  2, 3,
  6, 7, 8, 9,
  11, 12, 13, 14, 15,
  17, 18, 19, 20,
  22, 23, 24
];

const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
];

function selectEnemyBases(amount) {
  return [...ACTIVE_CELLS]
    .sort(() => Math.random() - 0.5)
    .slice(0, amount);
}

function getCoordinates(cellNumber) {
  const index = cellNumber - 1;

  return {
    row: Math.floor(index / 5),
    column: index % 5
  };
}

function countNearbyEnemies(
  cellNumber,
  enemyBases
) {
  const coordinates =
    getCoordinates(cellNumber);

  return DIRECTIONS.reduce(
    (total, [rowDifference, columnDifference]) => {
      const nearbyRow =
        coordinates.row + rowDifference;

      const nearbyColumn =
        coordinates.column +
        columnDifference;

      const nearbyCell =
        nearbyRow * 5 +
        nearbyColumn +
        1;

      const validCoordinates =
        nearbyRow >= 0 &&
        nearbyRow < 5 &&
        nearbyColumn >= 0 &&
        nearbyColumn < 5;

      if (
        validCoordinates &&
        enemyBases.includes(nearbyCell)
      ) {
        return total + 1;
      }

      return total;
    },
    0
  );
}

export function renderInvasionGame({
  gameState,
  decision,
  onComplete
}) {
  const app = document.querySelector("#app");

  const enemyAmount = 3;

  const militarySupport =
    gameState.factions.military ?? 50;

  const totalOperations = Math.min(
    15,
    9 + Math.floor(militarySupport / 15)
  );

  const enemyBases =
    selectEnemyBases(enemyAmount);

  const investigatedCells = new Set();
  const discoveredBases = new Set();

  let remainingOperations = totalOperations;
  let finished = false;

  function createMap() {
    return Array.from(
      { length: 25 },
      (_, index) => {
        const cellNumber = index + 1;
        const isActive =
          ACTIVE_CELLS.includes(cellNumber);

        return `
          <button
            type="button"
            class="map-cell ${
              isActive ? "active" : "inactive"
            }"
            data-cell="${cellNumber}"
            ${isActive ? "" : "disabled"}
            aria-label="Setor ${cellNumber}"
          ></button>
        `;
      }
    ).join("");
  }

  app.innerHTML = `
    <section class="screen invasion-screen">
      <header class="invasion-header">
        <div>
          <p class="eyebrow">
            Emergência nacional
          </p>

          <h1>${decision.title}</h1>
        </div>

        <div class="operation-counter">
          <small>Operações</small>

          <strong id="remaining-operations">
            ${remainingOperations}
          </strong>
        </div>
      </header>

      <article class="invasion-message">
        <span>🎖️</span>

        <div>
          <strong>
            ${decision.character.name}
          </strong>

          <p>
            ${decision.description}
          </p>
        </div>
      </article>

      <div class="invasion-progress">
        <span>
          Bases encontradas
        </span>

        <strong id="bases-found">
          0/${enemyAmount}
        </strong>
      </div>

      <div
        class="brazil-map"
        id="brazil-map"
      >
        ${createMap()}
      </div>

      <div class="map-legend">
        <span>🟩 Não investigado</span>
        <span>📡 Área limpa</span>
        <span>💥 Base inimiga</span>
      </div>

      <article
        class="military-report"
        id="military-report"
      >
        Selecione um setor para iniciar a operação.
      </article>
    </section>
  `;

  const operationElement =
    document.querySelector(
      "#remaining-operations"
    );

  const basesElement =
    document.querySelector("#bases-found");

  const reportElement =
    document.querySelector(
      "#military-report"
    );

  document
    .querySelectorAll(".map-cell.active")
    .forEach((cell) => {
      cell.addEventListener("click", () => {
        investigateCell(cell);
      });
    });

  function investigateCell(cellElement) {
    if (finished) {
      return;
    }

    const cellNumber = Number(
      cellElement.dataset.cell
    );

    if (investigatedCells.has(cellNumber)) {
      return;
    }

    investigatedCells.add(cellNumber);
    remainingOperations -= 1;

    cellElement.disabled = true;
    cellElement.classList.add("investigated");

    if (enemyBases.includes(cellNumber)) {
      discoveredBases.add(cellNumber);

      cellElement.classList.add("enemy-base");
      cellElement.textContent = "💥";

      reportElement.innerHTML = `
        <strong>Base inimiga encontrada!</strong>
        Nossas tropas retomaram o setor.
      `;
    } else {
      const nearbyEnemies =
        countNearbyEnemies(
          cellNumber,
          enemyBases
        );

      cellElement.textContent =
        nearbyEnemies > 0
          ? String(nearbyEnemies)
          : "✓";

      reportElement.innerHTML =
        nearbyEnemies > 0
          ? `Os radares detectaram <strong>${nearbyEnemies}</strong> ${
              nearbyEnemies === 1
                ? "base próxima"
                : "bases próximas"
            }.`
          : "Nenhuma atividade inimiga foi detectada nas proximidades.";
    }

    operationElement.textContent =
      remainingOperations;

    basesElement.textContent =
      `${discoveredBases.size}/${enemyAmount}`;

    if (discoveredBases.size === enemyAmount) {
      finishGame(true);
      return;
    }

    if (remainingOperations <= 0) {
      finishGame(false);
    }
  }

  function revealEnemyBases() {
    enemyBases.forEach((cellNumber) => {
      const cell = document.querySelector(
        `[data-cell="${cellNumber}"]`
      );

      if (cell) {
        cell.classList.add("enemy-base");
        cell.textContent = "💥";
      }
    });
  }

  function finishGame(playerWon) {
    finished = true;
    revealEnemyBases();

    document
      .querySelectorAll(".map-cell.active")
      .forEach((cell) => {
        cell.disabled = true;
      });

    reportElement.innerHTML = playerWon
      ? `
        <strong>Vitória nacional!</strong>
        Todas as bases invasoras foram destruídas.

        <button
          type="button"
          class="primary-button invasion-result-button"
          id="finish-invasion"
        >
          Declarar vitória
        </button>
      `
      : `
        <strong>O território foi perdido.</strong>
        As tropas inimigas chegaram à capital.

        <button
          type="button"
          class="primary-button invasion-result-button"
          id="finish-invasion"
        >
          Ver o fim do governo
        </button>
      `;

    document
      .querySelector("#finish-invasion")
      .addEventListener("click", () => {
        completeInvasion(playerWon);
      });
  }

  function completeInvasion(playerWon) {
    if (playerWon) {
      onComplete({
        id: "defend-territory",
        text: "Defender o território",

        resultText:
          "As forças invasoras foram derrotadas. O país comemorou, mas os militares passaram a exigir maior influência no governo.",

        effects: {
          indicators: {
            people: 20,
            congress: 8,
            economy: -10,
            stability: 15
          },

          politics: {
            economicPosition: 0,
            socialPosition: 5,
            authoritarianism: 8,
            popularParticipation: 5,
            personalism: 12
          },

          factions: {
            military: 20,
            business: 3,
            unions: 3,
            socialMovements: 3,
            religiousGroups: 5,
            press: 10
          },

          country: {
            inequality: 0,
            publicServices: -3,
            environment: -5
          },

          corruption: 2,
          personalWealth: 0
        },

        invasion: {
          won: true,
          operationsUsed:
            totalOperations -
            remainingOperations
        }
      });

      return;
    }

    onComplete({
      id: "lose-territory",
      text: "Falhar na defesa do território",

      resultText:
        "As tropas inimigas tomaram a capital. Trampi declarou vitória e entregou o governo provisório a Bolsocloro.",

      effects: {
        indicators: {
          people: -50,
          congress: -50,
          economy: -50,
          stability: -50
        },

        politics: {
          economicPosition: 0,
          socialPosition: 0,
          authoritarianism: 0,
          popularParticipation: 0,
          personalism: 0
        },

        factions: {
          military: -50,
          business: -20,
          unions: -20,
          socialMovements: -20,
          religiousGroups: -10,
          press: -20
        },

        country: {
          inequality: 10,
          publicServices: -20,
          environment: -10
        },

        corruption: 0,
        personalWealth: 0
      },

      forcedEnding: "foreign-occupation",

      invasion: {
        won: false,
        operationsUsed: totalOperations
      }
    });
  }
}