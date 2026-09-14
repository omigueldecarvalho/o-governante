const RESPONSES = {
  firefighters: {
    icon: "🚒",
    name: "Bombeiros"
  },

  rescue: {
    icon: "🚁",
    name: "Resgate"
  },

  dialogue: {
    icon: "💬",
    name: "Diálogo"
  },

  technicians: {
    icon: "🔧",
    name: "Técnicos"
  },

  funding: {
    icon: "💰",
    name: "Recursos"
  },

  investigation: {
    icon: "🚔",
    name: "Investigar"
  }
};

const CRISES = [
  {
    id: "forest-fire",
    icon: "🔥",
    name: "Incêndio florestal",
    response: "firefighters",

    successEffects: {
      indicators: {
        people: 2,
        stability: 2
      },

      country: {
        environment: 3
      }
    },

    failureEffects: {
      indicators: {
        people: -3,
        economy: -3,
        stability: -3
      },

      country: {
        environment: -6
      }
    }
  },

  {
    id: "flood",
    icon: "🌊",
    name: "Enchente",
    response: "rescue",

    successEffects: {
      indicators: {
        people: 3,
        stability: 2
      },

      country: {
        publicServices: 2
      }
    },

    failureEffects: {
      indicators: {
        people: -5,
        economy: -3,
        stability: -3
      },

      country: {
        publicServices: -3
      }
    }
  },

  {
    id: "protest",
    icon: "✊",
    name: "Manifestação",
    response: "dialogue",

    successEffects: {
      indicators: {
        people: 3,
        congress: -1,
        stability: 2
      },

      politics: {
        authoritarianism: -2,
        popularParticipation: 3
      },

      factions: {
        unions: 2,
        socialMovements: 3
      }
    },

    failureEffects: {
      indicators: {
        people: -4,
        stability: -4
      },

      politics: {
        popularParticipation: -2
      },

      factions: {
        unions: -3,
        socialMovements: -4
      }
    }
  },

  {
    id: "blackout",
    icon: "⚡",
    name: "Apagão nacional",
    response: "technicians",

    successEffects: {
      indicators: {
        economy: 3,
        stability: 2
      }
    },

    failureEffects: {
      indicators: {
        people: -3,
        economy: -6,
        stability: -4
      },

      country: {
        publicServices: -2
      }
    }
  },

  {
    id: "hospital-collapse",
    icon: "🏥",
    name: "Hospitais lotados",
    response: "funding",

    successEffects: {
      indicators: {
        people: 4,
        economy: -2,
        stability: 2
      },

      country: {
        publicServices: 4
      }
    },

    failureEffects: {
      indicators: {
        people: -6,
        economy: -2,
        stability: -3
      },

      country: {
        publicServices: -5
      }
    }
  },

  {
    id: "government-scandal",
    icon: "📸",
    name: "Escândalo vazado",
    response: "investigation",

    successEffects: {
      indicators: {
        people: 3,
        congress: -2,
        stability: 3
      },

      factions: {
        press: 4
      },

      corruption: -4
    },

    failureEffects: {
      indicators: {
        people: -5,
        congress: -3,
        stability: -4
      },

      factions: {
        press: -5
      },

      corruption: 6
    }
  }
];

function shuffle(items) {
  return [...items].sort(
    () => Math.random() - 0.5
  );
}

function createCrisisSequence() {
  return shuffle([
    ...CRISES,
    ...CRISES
  ]).slice(0, 10);
}

function createEmptyEffects() {
  return {
    indicators: {},
    politics: {},
    factions: {},
    country: {},
    corruption: 0,
    personalWealth: 0
  };
}

function mergeGroup(target, source = {}) {
  Object.entries(source).forEach(
    ([key, value]) => {
      target[key] =
        (target[key] ?? 0) + value;
    }
  );
}

function mergeEffects(target, source = {}) {
  mergeGroup(
    target.indicators,
    source.indicators
  );

  mergeGroup(
    target.politics,
    source.politics
  );

  mergeGroup(
    target.factions,
    source.factions
  );

  mergeGroup(
    target.country,
    source.country
  );

  target.corruption +=
    source.corruption ?? 0;

  target.personalWealth +=
    source.personalWealth ?? 0;
}

function createFutureEffect(
  failed,
  ignored
) {
  if (failed + ignored < 5) {
    return null;
  }

  return {
    afterMonths: 2,

    message:
      "As crises ignoradas cresceram e se transformaram em uma emergência nacional ainda maior.",

    effects: {
      indicators: {
        people: -10,
        congress: -3,
        economy: -8,
        stability: -10
      },

      country: {
        publicServices: -5,
        environment: -3
      }
    }
  };
}

export function renderCrisisFirefighterGame({
  gameState,
  decision,
  onComplete
}) {
  const app = document.querySelector("#app");

  const crisisSequence =
    createCrisisSequence();

  const totalCrises =
    crisisSequence.length;

  const effects = createEmptyEffects();

  let currentIndex = 0;
  let timeRemaining = 25;
  let resolved = 0;
  let failed = 0;
  let ignored = 0;
  let locked = false;
  let finished = false;

  app.innerHTML = `
    <section class="screen crisis-game-screen">
      <header class="crisis-game-header">
        <div>
          <p class="eyebrow">
            Gabinete de crise
          </p>

          <h1>${decision.title}</h1>
        </div>

        <div class="crisis-timer">
          <small>Tempo</small>

          <strong id="crisis-time">
            ${timeRemaining}
          </strong>
        </div>
      </header>

      <div class="crisis-progress">
        <div id="crisis-progress-bar"></div>
      </div>

      <div
        class="crisis-map"
        id="crisis-map"
      >
        ${Array.from(
          { length: 9 },
          (_, index) => `
            <div
              class="crisis-region"
              data-region="${index}"
            ></div>
          `
        ).join("")}
      </div>

      <article class="current-crisis">
        <span id="current-crisis-icon">
          🚨
        </span>

        <strong id="current-crisis-name">
          Preparando gabinete...
        </strong>

        <small>
          Escolha a resposta correta
        </small>
      </article>

      <div class="crisis-responses">
        ${Object.entries(RESPONSES)
          .map(
            ([responseId, response]) => `
              <button
                type="button"
                class="crisis-response"
                data-response="${responseId}"
                title="${response.name}"
              >
                <span>${response.icon}</span>
                <small>${response.name}</small>
              </button>
            `
          )
          .join("")}
      </div>

      <div class="crisis-score">
        <span>
          ✅ <strong id="resolved-count">0</strong>
        </span>

        <span>
          ❌ <strong id="failed-count">0</strong>
        </span>

        <span>
          📍
          <strong id="crisis-position">
            1/${totalCrises}
          </strong>
        </span>
      </div>

      <p
        class="crisis-feedback"
        id="crisis-feedback"
      >
        Resolva o máximo possível.
      </p>
    </section>
  `;

  const timeElement =
    document.querySelector("#crisis-time");

  const iconElement =
    document.querySelector(
      "#current-crisis-icon"
    );

  const nameElement =
    document.querySelector(
      "#current-crisis-name"
    );

  const feedbackElement =
    document.querySelector(
      "#crisis-feedback"
    );

  const progressElement =
    document.querySelector(
      "#crisis-progress-bar"
    );

  function showCurrentCrisis() {
    if (
      currentIndex >= totalCrises
    ) {
      finishGame();
      return;
    }

    locked = false;

    const crisis =
      crisisSequence[currentIndex];

    iconElement.textContent =
      crisis.icon;

    nameElement.textContent =
      crisis.name;

    document.querySelector(
      "#crisis-position"
    ).textContent =
      `${currentIndex + 1}/${totalCrises}`;

    progressElement.style.width =
      `${
        currentIndex /
        totalCrises *
        100
      }%`;

    const regions =
      document.querySelectorAll(
        ".crisis-region"
      );

    regions.forEach((region) => {
      region.classList.remove("active");
      region.textContent = "";
    });

    const randomRegion =
      regions[
        Math.floor(
          Math.random() * regions.length
        )
      ];

    randomRegion.classList.add("active");
    randomRegion.textContent =
      crisis.icon;
  }

  function processResponse(responseId) {
    if (locked || finished) {
      return;
    }

    locked = true;

    const crisis =
      crisisSequence[currentIndex];

    const correct =
      responseId === crisis.response;

    if (correct) {
      resolved += 1;

      mergeEffects(
        effects,
        crisis.successEffects
      );

      feedbackElement.textContent =
        "✅ Crise controlada!";

      feedbackElement.className =
        "crisis-feedback success";
    } else {
      failed += 1;

      mergeEffects(
        effects,
        crisis.failureEffects
      );

      feedbackElement.textContent =
        `❌ Resposta errada: ${
          RESPONSES[
            crisis.response
          ].name
        } era necessária.`;

      feedbackElement.className =
        "crisis-feedback failure";
    }

    document.querySelector(
      "#resolved-count"
    ).textContent = resolved;

    document.querySelector(
      "#failed-count"
    ).textContent = failed;

    window.setTimeout(() => {
      if (finished) {
        return;
      }

      currentIndex += 1;
      showCurrentCrisis();
    }, 450);
  }

  document
    .querySelectorAll(".crisis-response")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          processResponse(
            button.dataset.response
          );
        }
      );
    });

  const timer = window.setInterval(() => {
    timeRemaining -= 1;

    timeElement.textContent =
      timeRemaining;

    if (timeRemaining <= 5) {
      timeElement.classList.add("danger");
    }

    if (timeRemaining <= 0) {
      finishGame();
    }
  }, 1000);

  function finishGame() {
    if (finished) {
      return;
    }

    finished = true;
    window.clearInterval(timer);

    ignored =
      totalCrises -
      currentIndex -
      (locked ? 1 : 0);

    if (ignored > 0) {
      mergeEffects(effects, {
        indicators: {
          people: ignored * -2,
          economy: ignored * -2,
          stability: ignored * -2
        },

        country: {
          publicServices:
            ignored * -1
        }
      });
    }

    const performance =
      resolved >= 8
        ? {
            icon: "🦸",
            title: "Herói nacional",

            text:
              "Seu governo resolveu quase tudo. Pela primeira vez, a expressão gabinete de crise não foi uma piada."
          }
        : resolved >= 5
          ? {
              icon: "🧯",
              title: "Incêndio parcialmente apagado",

              text:
                "Algumas crises foram resolvidas. As outras foram encaminhadas para uma comissão."
            }
          : {
              icon: "🔥",
              title: "O país continua pegando fogo",

              text:
                "Seu governo tentou responder às crises, mas aparentemente utilizou gasolina."
            };

    app.innerHTML = `
      <section class="screen crisis-result-screen">
        <div class="crisis-result-icon">
          ${performance.icon}
        </div>

        <p class="eyebrow">
          Relatório da crise
        </p>

        <h1>${performance.title}</h1>

        <p class="crisis-result-text">
          ${performance.text}
        </p>

        <div class="crisis-final-score">
          <article>
            <span>✅</span>
            <strong>${resolved}</strong>
            <small>Resolvidas</small>
          </article>

          <article>
            <span>❌</span>
            <strong>${failed}</strong>
            <small>Erros</small>
          </article>

          <article>
            <span>🙈</span>
            <strong>${ignored}</strong>
            <small>Ignoradas</small>
          </article>
        </div>

        <button
          type="button"
          class="primary-button"
          id="finish-crisis-game"
        >
          Ver consequências
        </button>
      </section>
    `;

    document
      .querySelector(
        "#finish-crisis-game"
      )
      ?.addEventListener("click", () => {
        onComplete({
          id: "crisis-firefighter-result",

          text:
            "Administrar a crise nacional",

          resultText: performance.text,

          effects,

          futureEffect:
            createFutureEffect(
              failed,
              ignored
            ),

          crisisGame: {
            resolved,
            failed,
            ignored,
            totalCrises
          }
        });
      });
  }

  showCurrentCrisis();
}