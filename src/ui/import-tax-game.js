import {
  IMPORT_PACKAGES,
  IMPORT_ACTIONS
} from "../data/import-packages.js";

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clamp(
  value,
  minimum,
  maximum
) {
  return Math.max(
    minimum,
    Math.min(maximum, value)
  );
}

function shufflePackages(packages) {
  const shuffled = [...packages];

  for (
    let index = shuffled.length - 1;
    index > 0;
    index -= 1
  ) {
    const randomIndex =
      Math.floor(
        Math.random() * (index + 1)
      );

    [
      shuffled[index],
      shuffled[randomIndex]
    ] = [
      shuffled[randomIndex],
      shuffled[index]
    ];
  }

  return shuffled;
}

function createFinalChoice({
  correctAnswers,
  totalPackages,
  actionCounts,
  timeExpired
}) {
  const percentage =
    totalPackages > 0
      ? Math.round(
          (
            correctAnswers /
            totalPackages
          ) * 100
        )
      : 0;

  const taxBalance =
    actionCounts.tax -
    actionCounts.release;

  const economicPosition = clamp(
    (
      actionCounts.release -
      actionCounts.tax
    ) * 2,
    -10,
    10
  );

  const authoritarianism = clamp(
    actionCounts.seize * 2,
    0,
    12
  );

  const summary =
    `${correctAnswers} de ` +
    `${totalPackages} pacotes classificados. ` +
    `Liberados: ${actionCounts.release}. ` +
    `Taxados: ${actionCounts.tax}. ` +
    `Apreendidos: ${actionCounts.seize}.`;

  if (percentage >= 80) {
    return {
      id: "import-tax-excellent",

      text: "Alfândega eficiente",

      resultText:
        `${summary} A fiscalização funcionou, a arrecadação aumentou e até a esteira sobreviveu.${
          timeExpired
            ? " O tempo acabou no último instante."
            : ""
        }`,

      effects: {
        indicators: {
          people: clamp(
            5 - Math.max(0, taxBalance),
            -2,
            6
          ),

          congress: 3,
          economy: 7,
          stability: 5
        },

        factions: {
          business: clamp(
            actionCounts.tax * 2 -
              actionCounts.release,
            -5,
            8
          )
        },

        politics: {
          economicPosition,
          authoritarianism
        },

        corruption: -2,
        personalWealth: 0
      }
    };
  }

  if (percentage >= 50) {
    return {
      id: "import-tax-average",

      text: "A Receita fez o possível",

      resultText:
        `${summary} Algumas encomendas passaram sem fiscalização e outras foram tributadas no puro sentimento.`,

      effects: {
        indicators: {
          people: -1,
          congress: 1,
          economy: 2,
          stability: -1
        },

        factions: {
          business: clamp(
            taxBalance,
            -4,
            4
          )
        },

        politics: {
          economicPosition,
          authoritarianism
        },

        corruption: 1,
        personalWealth: 0
      }
    };
  }

  return {
    id: "import-tax-failed",

    text: "Colapso na alfândega",

    resultText:
      `${summary} A operação confundiu medicamento com muamba e liberou pacote suspeito como presente da tia.`,

    effects: {
      indicators: {
        people: -7,
        congress: -4,
        economy: -6,
        stability: -5
      },

      factions: {
        business: -4
      },

      politics: {
        economicPosition,
        authoritarianism:
          authoritarianism + 2
      },

      corruption: 4,
      personalWealth: 0
    }
  };
}

export function renderImportTaxGame({
  gameState,
  decision,
  onComplete
}) {
  const app =
    document.querySelector("#app");

  if (!app) {
    throw new Error(
      "Elemento #app não encontrado."
    );
  }

  const playablePackages =
    shufflePackages(
      IMPORT_PACKAGES
    ).slice(0, 6);

  let currentPackageIndex = 0;
  let correctAnswers = 0;
  let remainingTime = 35;
  let answered = false;
  let finished = false;
  let transitionTimeout = null;

  const actionCounts = {
    release: 0,
    tax: 0,
    seize: 0
  };

  app.innerHTML = `
    <section class="screen import-tax-screen">
      <header class="import-tax-header">
        <div>
          <p class="eyebrow">
            Fiscalização aduaneira
          </p>

          <h1>
            ${escapeHTML(
              decision?.title ??
                "Taxa das Blusinhas"
            )}
          </h1>
        </div>

        <div class="import-tax-timer">
          <small>Tempo</small>

          <strong id="import-tax-time">
            ${remainingTime}
          </strong>
        </div>
      </header>

      <div class="import-tax-information">
        <div>
          <small>Pacote</small>

          <strong id="import-tax-counter">
            1/${playablePackages.length}
          </strong>
        </div>

        <div>
          <small>Acertos</small>

          <strong id="import-tax-score">
            0
          </strong>
        </div>
      </div>

      <div class="import-tax-progress">
        <div
          id="import-tax-progress-bar"
          style="width: 0%"
        ></div>
      </div>

      <aside class="customs-rules">
        <span>
          📦 Regular: liberar
        </span>

        <span>
          💸 Importação comercial:
          taxar
        </span>

        <span>
          🚨 Fraude ou produto ilegal:
          apreender
        </span>
      </aside>

      <div class="conveyor-scene">
        <div class="conveyor-light">
          <span></span>
        </div>

        <article
          class="import-package-card"
          id="import-package-card"
        ></article>

        <div class="conveyor-belt">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div
        class="import-tax-feedback"
        id="import-tax-feedback"
      ></div>

      <div class="import-tax-actions">
        ${Object.entries(
          IMPORT_ACTIONS
        )
          .map(
            ([actionId, action]) => `
              <button
                type="button"
                class="
                  import-tax-action
                  ${actionId}
                "
                data-action="${actionId}"
              >
                <kbd>
                  ${escapeHTML(action.key)}
                </kbd>

                <span>
                  ${action.icon}
                </span>

                <strong>
                  ${escapeHTML(
                    action.label
                  )}
                </strong>
              </button>
            `
          )
          .join("")}
      </div>

      <div class="customs-statistics">
        <span>
          📦
          <strong id="released-count">
            0
          </strong>
        </span>

        <span>
          💸
          <strong id="taxed-count">
            0
          </strong>
        </span>

        <span>
          🚨
          <strong id="seized-count">
            0
          </strong>
        </span>
      </div>
    </section>
  `;

  const packageElement =
    document.querySelector(
      "#import-package-card"
    );

  const feedbackElement =
    document.querySelector(
      "#import-tax-feedback"
    );

  const timeElement =
    document.querySelector(
      "#import-tax-time"
    );

  const counterElement =
    document.querySelector(
      "#import-tax-counter"
    );

  const scoreElement =
    document.querySelector(
      "#import-tax-score"
    );

  const progressElement =
    document.querySelector(
      "#import-tax-progress-bar"
    );

  const releasedElement =
    document.querySelector(
      "#released-count"
    );

  const taxedElement =
    document.querySelector(
      "#taxed-count"
    );

  const seizedElement =
    document.querySelector(
      "#seized-count"
    );

  const actionButtons =
    document.querySelectorAll(
      ".import-tax-action"
    );

  function updateInformation() {
    counterElement.textContent =
      `${
        Math.min(
          currentPackageIndex + 1,
          playablePackages.length
        )
      }/${playablePackages.length}`;

    scoreElement.textContent =
      correctAnswers;

    progressElement.style.width =
      `${
        (
          currentPackageIndex /
          playablePackages.length
        ) * 100
      }%`;

    releasedElement.textContent =
      actionCounts.release;

    taxedElement.textContent =
      actionCounts.tax;

    seizedElement.textContent =
      actionCounts.seize;
  }

  function renderCurrentPackage() {
    if (finished) {
      return;
    }

    const currentPackage =
      playablePackages[
        currentPackageIndex
      ];

    if (!currentPackage) {
      finishGame(false);
      return;
    }

    answered = false;
    feedbackElement.innerHTML = "";

    actionButtons.forEach(
      (button) => {
        button.disabled = false;

        button.classList.remove(
          "selected",
          "correct",
          "incorrect"
        );
      }
    );

    packageElement.classList.remove(
      "package-enter"
    );

    void packageElement.offsetWidth;

    packageElement.classList.add(
      "package-enter"
    );

    packageElement.innerHTML = `
      <span class="package-icon">
        ${currentPackage.icon}
      </span>

      <div class="package-details">
        <small>
          Conteúdo declarado
        </small>

        <h2>
          ${escapeHTML(
            currentPackage.product
          )}
        </h2>

        <div class="declared-value">
          Valor declarado:

          <strong>
            ${Number(
              currentPackage.declaredValue
            ).toLocaleString(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL"
              }
            )}
          </strong>
        </div>

        <p>
          ${escapeHTML(
            currentPackage.description
          )}
        </p>
      </div>

      <span class="inspection-stamp">
        AGUARDANDO
      </span>
    `;

    updateInformation();
  }

  function handleAction(actionId) {
    if (
      answered ||
      finished
    ) {
      return;
    }

    const currentPackage =
      playablePackages[
        currentPackageIndex
      ];

    if (!currentPackage) {
      return;
    }

    answered = true;

    const isCorrect =
      actionId ===
      currentPackage.correctAction;

    actionCounts[actionId] += 1;

    if (isCorrect) {
      correctAnswers += 1;
    }

    actionButtons.forEach(
      (button) => {
        button.disabled = true;

        if (
          button.dataset.action ===
          currentPackage.correctAction
        ) {
          button.classList.add(
            "correct"
          );
        }
      }
    );

    const selectedButton =
      document.querySelector(
        `[data-action="${actionId}"]`
      );

    selectedButton?.classList.add(
      "selected",
      isCorrect
        ? "correct"
        : "incorrect"
    );

    const chosenAction =
      IMPORT_ACTIONS[actionId];

    feedbackElement.innerHTML = `
      <article class="
        customs-result
        ${
          isCorrect
            ? "success"
            : "failure"
        }
      ">
        <strong>
          ${
            isCorrect
              ? "✅ Boa fiscalização"
              : "❌ Decisão questionável"
          }
        </strong>

        <p>
          ${escapeHTML(
            currentPackage.reactions[
              actionId
            ]
          )}
        </p>

        <small>
          Destino correto:
          ${
            IMPORT_ACTIONS[
              currentPackage
                .correctAction
            ].icon
          }

          ${escapeHTML(
            IMPORT_ACTIONS[
              currentPackage
                .correctAction
            ].label
          )}
        </small>
      </article>
    `;

    updateInformation();

    transitionTimeout =
      window.setTimeout(() => {
        currentPackageIndex += 1;

        if (
          currentPackageIndex >=
          playablePackages.length
        ) {
          finishGame(false);
          return;
        }

        renderCurrentPackage();
      }, 1300);
  }

  function handleKeyboard(event) {
    const pressedKey =
      event.key.toUpperCase();

    const selectedAction =
      Object.entries(
        IMPORT_ACTIONS
      ).find(
        ([, action]) =>
          action.key === pressedKey
      );

    if (!selectedAction) {
      return;
    }

    event.preventDefault();

    handleAction(
      selectedAction[0]
    );
  }

  function finishGame(timeExpired) {
    if (finished) {
      return;
    }

    finished = true;

    window.clearInterval(
      timerInterval
    );

    if (transitionTimeout) {
      window.clearTimeout(
        transitionTimeout
      );
    }

    document.removeEventListener(
      "keydown",
      handleKeyboard
    );

    progressElement.style.width =
      "100%";

    const finalChoice =
      createFinalChoice({
        correctAnswers,
        totalPackages:
          playablePackages.length,
        actionCounts,
        timeExpired
      });

    onComplete(finalChoice);
  }

  actionButtons.forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        handleAction(
          button.dataset.action
        );
      }
    );
  });

  document.addEventListener(
    "keydown",
    handleKeyboard
  );

  const timerInterval =
    window.setInterval(() => {
      remainingTime -= 1;

      timeElement.textContent =
        remainingTime;

      timeElement.classList.toggle(
        "danger",
        remainingTime <= 10
      );

      if (remainingTime <= 0) {
        finishGame(true);
      }
    }, 1000);

  renderCurrentPackage();
}