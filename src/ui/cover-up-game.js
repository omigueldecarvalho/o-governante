const DOCUMENTS = [
  {
    id: "offshore-account",
    icon: "🏝️",
    name: "Conta no exterior"
  },

  {
    id: "suspicious-contract",
    icon: "📄",
    name: "Contrato suspeito"
  },

  {
    id: "secret-audio",
    icon: "🎙️",
    name: "Áudio comprometedor"
  },

  {
    id: "money-suitcase",
    icon: "💼",
    name: "Mala de dinheiro"
  },

  {
    id: "spreadsheet",
    icon: "📊",
    name: "Planilha de pagamentos"
  },

  {
    id: "secret-photo",
    icon: "📸",
    name: "Foto da reunião"
  },

  {
    id: "deleted-message",
    icon: "📱",
    name: "Mensagem não tão apagada"
  },

  {
    id: "fake-invoice",
    icon: "🧾",
    name: "Nota fiscal criativa"
  }
];

const ACTIONS = {
  destroy: {
    icon: "🗑️",
    name: "Destruir"
  },

  investigate: {
    icon: "🚔",
    name: "Entregar à PF"
  },

  leak: {
    icon: "📰",
    name: "Vazar"
  },

  ally: {
    icon: "🤝",
    name: "Dar ao aliado"
  }
};

function shuffle(items) {
  return [...items].sort(
    () => Math.random() - 0.5
  );
}

function getDominantAction(results) {
  return Object.entries(results)
    .filter(([key]) => key !== "ignored")
    .sort((a, b) => b[1] - a[1])[0]?.[0];
}

function calculateEffects(results) {
  const {
    destroy,
    investigate,
    leak,
    ally,
    ignored
  } = results;

  return {
    indicators: {
      people:
        investigate * 2 +
        leak * 3 -
        ignored * 2,

      congress:
        destroy +
        ally * 3 -
        investigate * 2 -
        leak * 3,

      economy:
        ally -
        leak,

      stability:
        destroy +
        investigate * 2 -
        leak -
        ignored * 2
    },

    politics: {
      economicPosition: ally * 2,

      socialPosition:
        destroy +
        ally,

      authoritarianism:
        destroy * 2 +
        ally,

      popularParticipation:
        investigate +
        leak * 2 -
        destroy * 2,

      personalism:
        destroy * 3 +
        ally * 2 -
        investigate
    },

    factions: {
      military:
        destroy,

      business:
        ally * 3 -
        investigate,

      unions:
        investigate +
        leak,

      socialMovements:
        investigate +
        leak * 2 -
        destroy,

      religiousGroups: 0,

      press:
        leak * 4 +
        investigate -
        destroy * 3 -
        ally
    },

    country: {
      inequality: ally,
      publicServices: 0,
      environment: 0
    },

    corruption:
      destroy * 3 +
      ally * 4 +
      ignored -
      investigate * 4 -
      leak * 2,

    personalWealth:
      ally * 150000
  };
}

function getResultText(results) {
  const dominantAction =
    getDominantAction(results);

  const texts = {
    destroy:
      "A trituradora trabalhou mais que todo o ministério. As principais provas desapareceram — aparentemente.",

    investigate:
      "A maior parte das provas foi entregue à investigação. Seus aliados começaram a procurar novos amigos.",

    leak:
      "Os documentos chegaram à imprensa. O país ganhou transparência e o governo ganhou uma crise.",

    ally:
      "As provas foram distribuídas entre aliados. Agora todos estão comprometidos juntos."
  };

  return (
    texts[dominantAction] ??
    "A operação terminou em completa desorganização. Ninguém sabe onde foram parar as provas."
  );
}

function getFutureEffect(results) {
  if (results.destroy >= 3) {
    return {
      afterMonths: 3,

      message:
        "Um funcionário recuperou cópias dos documentos destruídos e entregou tudo à imprensa.",

      effects: {
        indicators: {
          people: -12,
          congress: -5,
          economy: -2,
          stability: -10
        },

        factions: {
          press: -10
        },

        corruption: 15
      }
    };
  }

  if (results.ally >= 3) {
    return {
      afterMonths: 3,

      message:
        "Um dos aliados utilizou as provas como moeda de troca e iniciou uma chantagem contra o governo.",

      effects: {
        indicators: {
          congress: -10,
          stability: -8
        },

        corruption: 10,

        personalWealth: -200000
      }
    };
  }

  return null;
}

export function renderCoverUpGame({
  gameState,
  decision,
  onComplete
}) {
  const app = document.querySelector("#app");

  const documents = shuffle(DOCUMENTS);

  const results = {
    destroy: 0,
    investigate: 0,
    leak: 0,
    ally: 0,
    ignored: 0
  };

  let currentIndex = 0;
  let timeRemaining = 25;
  let finished = false;

  app.innerHTML = `
    <section class="screen cover-up-screen">
      <header class="cover-up-header">
        <div>
          <p class="eyebrow">
            Escândalo em andamento
          </p>

          <h1>${decision.title}</h1>
        </div>

        <div class="cover-up-timer">
          <small>Tempo</small>

          <strong id="cover-up-time">
            ${timeRemaining}
          </strong>
        </div>
      </header>

      <div class="cover-up-progress">
        <div
          id="cover-up-progress-bar"
        ></div>
      </div>

      <article
        class="evidence-card"
        id="evidence-card"
      >
        <span
          class="evidence-icon"
          id="evidence-icon"
        ></span>

        <strong id="evidence-name"></strong>

        <small>
          PROVA CONFIDENCIAL
        </small>
      </article>

      <div class="evidence-actions">
        ${Object.entries(ACTIONS)
          .map(
            ([id, action]) => `
              <button
                type="button"
                class="evidence-action"
                data-action="${id}"
              >
                <span>${action.icon}</span>
                <strong>${action.name}</strong>
              </button>
            `
          )
          .join("")}
      </div>

      <div
        class="cover-up-score"
        id="cover-up-score"
      >
        <span>🗑️ 0</span>
        <span>🚔 0</span>
        <span>📰 0</span>
        <span>🤝 0</span>
      </div>
    </section>
  `;

  const timeElement =
    document.querySelector("#cover-up-time");

  const progressElement =
    document.querySelector(
      "#cover-up-progress-bar"
    );

  const cardElement =
    document.querySelector("#evidence-card");

  function showCurrentDocument() {
  if (currentIndex >= documents.length) {
    finishOperation();
    return;
  }

  const currentDocument =
    documents[currentIndex];

  const iconElement =
    window.document.querySelector(
      "#evidence-icon"
    );

  const nameElement =
    window.document.querySelector(
      "#evidence-name"
    );

  if (
    !iconElement ||
    !nameElement ||
    !cardElement
  ) {
    console.error(
      "Elementos da prova não encontrados."
    );

    return;
  }

  iconElement.textContent =
    currentDocument.icon;

  nameElement.textContent =
    currentDocument.name;

  cardElement.classList.remove(
    "evidence-enter"
  );

  void cardElement.offsetWidth;

  cardElement.classList.add(
    "evidence-enter"
  );

  const progress =
    ((currentIndex + 1) /
      documents.length) *
    100;

  progressElement.style.width =
    `${progress}%`;
}

  function updateScore() {
    document.querySelector(
      "#cover-up-score"
    ).innerHTML = `
      <span>🗑️ ${results.destroy}</span>
      <span>🚔 ${results.investigate}</span>
      <span>📰 ${results.leak}</span>
      <span>🤝 ${results.ally}</span>
    `;
  }

  function processDocument(action) {
    if (finished) {
      return;
    }

    results[action] += 1;
    currentIndex += 1;

    updateScore();
    showCurrentDocument();
  }

  document
    .querySelectorAll(".evidence-action")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          processDocument(
            button.dataset.action
          );
        }
      );
    });

  const timer = window.setInterval(() => {
    timeRemaining -= 1;
    timeElement.textContent = timeRemaining;

    if (timeRemaining <= 5) {
      timeElement.classList.add("danger");
    }

    if (timeRemaining <= 0) {
      finishOperation();
    }
  }, 1000);

  function finishOperation() {
    if (finished) {
      return;
    }

    finished = true;
    window.clearInterval(timer);

    results.ignored =
      documents.length - currentIndex;

    const effects =
      calculateEffects(results);

    const resultText =
      getResultText(results);

    const futureEffect =
      getFutureEffect(results);

    app.innerHTML = `
      <section class="screen cover-up-result-screen">
        <div class="cover-up-result-icon">
          🕵️
        </div>

        <p class="eyebrow">
          Operação encerrada
        </p>

        <h1>O que foi feito com as provas?</h1>

        <div class="cover-up-final-score">
          <article>
            <span>🗑️</span>
            <strong>${results.destroy}</strong>
            <small>Destruídas</small>
          </article>

          <article>
            <span>🚔</span>
            <strong>${results.investigate}</strong>
            <small>Investigadas</small>
          </article>

          <article>
            <span>📰</span>
            <strong>${results.leak}</strong>
            <small>Vazadas</small>
          </article>

          <article>
            <span>🤝</span>
            <strong>${results.ally}</strong>
            <small>Com aliados</small>
          </article>

          <article>
            <span>❓</span>
            <strong>${results.ignored}</strong>
            <small>Abandonadas</small>
          </article>
        </div>

        <button
          type="button"
          class="primary-button"
          id="finish-cover-up"
        >
          Ver repercussão
        </button>
      </section>
    `;

    document
      .querySelector("#finish-cover-up")
      ?.addEventListener("click", () => {
        onComplete({
          id: "operation-cover-up-result",
          text: "Administrar as provas",

          resultText,
          effects,
          futureEffect,

          coverUp: {
            ...results
          }
        });
      });
  }

  showCurrentDocument();
}