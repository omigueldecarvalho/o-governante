const MATERIALS = [
  {
    id: "public-health",
    icon: "🏥",
    title: "Mais recursos para a saúde",
    type: "proposal",

    publish: {
      voteBonus: 2,

      effects: {
        indicators: {
          people: 2,
          economy: -1
        },

        politics: {
          economicPosition: -2
        }
      }
    },

    discard: {
      voteBonus: -1,
      effects: {}
    }
  },

  {
    id: "opponent-tax-air",
    icon: "🫁",
    title: "Adversário criará imposto para respirar",
    type: "fake",

    publish: {
      voteBonus: 4,

      effects: {
        indicators: {
          people: 2,
          stability: -3
        },

        politics: {
          authoritarianism: 2,
          personalism: 4
        },

        factions: {
          press: -4
        },

        corruption: 4
      }
    },

    discard: {
      voteBonus: 0,

      effects: {
        indicators: {
          stability: 2
        },

        corruption: -2
      }
    }
  },

  {
    id: "alien-opponent",
    icon: "👽",
    title: "Foto comprova que adversário é alienígena",
    type: "fake",

    publish: {
      voteBonus: 5,

      effects: {
        indicators: {
          people: 3,
          stability: -4
        },

        politics: {
          personalism: 5
        },

        factions: {
          press: -5
        },

        corruption: 5
      }
    },

    discard: {
      voteBonus: 0,
      effects: {}
    }
  },

  {
    id: "employment-program",
    icon: "👷",
    title: "Programa nacional de empregos",
    type: "proposal",

    publish: {
      voteBonus: 3,

      effects: {
        indicators: {
          people: 3,
          economy: 1
        },

        politics: {
          economicPosition: -2
        }
      }
    },

    discard: {
      voteBonus: -1,
      effects: {}
    }
  },

  {
    id: "datapapel-98",
    icon: "📊",
    title: "DataPapel aponta 98% de aprovação",
    type: "fake",

    publish: {
      voteBonus: 4,

      effects: {
        indicators: {
          people: 2,
          stability: -2
        },

        factions: {
          press: -4
        },

        corruption: 4
      }
    },

    discard: {
      voteBonus: 0,
      effects: {}
    }
  },

  {
    id: "football-support",
    icon: "⚽",
    title: "Craques declaram apoio ao candidato",
    type: "propaganda",

    publish: {
      voteBonus: 2,

      effects: {
        indicators: {
          people: 2
        },

        politics: {
          personalism: 2
        }
      }
    },

    discard: {
      voteBonus: -1,
      effects: {}
    }
  },

  {
    id: "secret-plan",
    icon: "📁",
    title: "Plano secreto do adversário foi descoberto",
    type: "fake",

    publish: {
      voteBonus: 4,

      effects: {
        indicators: {
          people: 2,
          stability: -3
        },

        politics: {
          authoritarianism: 3,
          personalism: 4
        },

        corruption: 5
      }
    },

    discard: {
      voteBonus: 0,

      effects: {
        corruption: -1
      }
    }
  },

  {
    id: "education-proposal",
    icon: "📚",
    title: "Investimento em escolas públicas",
    type: "proposal",

    publish: {
      voteBonus: 2,

      effects: {
        indicators: {
          people: 2,
          economy: -1
        },

        politics: {
          economicPosition: -3,
          popularParticipation: 2
        }
      }
    },

    discard: {
      voteBonus: -1,
      effects: {}
    }
  },

  {
    id: "opponent-video",
    icon: "📹",
    title: "Vídeo editado faz adversário confessar tudo",
    type: "fake",

    publish: {
      voteBonus: 5,

      effects: {
        indicators: {
          people: 3,
          stability: -5
        },

        politics: {
          authoritarianism: 3,
          personalism: 5
        },

        factions: {
          press: -6
        },

        corruption: 6
      }
    },

    discard: {
      voteBonus: 0,
      effects: {}
    }
  },

  {
    id: "generic-slogan",
    icon: "🇧🇷",
    title: "Brasil acima acima... Acima de tudo!",
    type: "propaganda",

    publish: {
      voteBonus: 2,

      effects: {
        indicators: {
          people: 2
        },

        politics: {
          personalism: 3
        }
      }
    },

    discard: {
      voteBonus: 0,
      effects: {}
    }
  }
];

function shuffle(items) {
  return [...items].sort(
    () => Math.random() - 0.5
  );
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

export function renderClandestinePrintShop({
  electionType,
  onComplete
}) {
  const app = document.querySelector("#app");

  const materials = shuffle(MATERIALS);
  const effects = createEmptyEffects();

  let currentIndex = 0;
  let timeRemaining = 25;
  let voteBonus = 0;
  let published = 0;
  let discarded = 0;
  let fakePublished = 0;
  let finished = false;

  app.innerHTML = `
    <section class="screen print-shop-screen">
      <header class="print-shop-header">
        <div>
          <p class="eyebrow">
            Campanha eleitoral
          </p>

          <h1>Gráfica Clandestina</h1>
        </div>

        <div class="print-shop-timer">
          <small>Tempo</small>

          <strong id="print-shop-time">
            ${timeRemaining}
          </strong>
        </div>
      </header>

      <div class="printing-machine">
        <div class="printer-top">
          🖨️
        </div>

        <article
          class="campaign-material"
          id="campaign-material"
        >
          <span id="material-icon"></span>

          <strong id="material-title"></strong>

          <small id="material-type"></small>
        </article>
      </div>

      <div class="print-shop-actions">
        <button
          type="button"
          class="print-action publish"
          id="publish-material"
        >
          <span>🖨️</span>
          <strong>IMPRIMIR</strong>
        </button>

        <button
          type="button"
          class="print-action discard"
          id="discard-material"
        >
          <span>🔥</span>
          <strong>DESTRUIR</strong>
        </button>
      </div>

      <div class="print-shop-status">
        <span>
          🖨️ <strong id="published-count">0</strong>
        </span>

        <span>
          🔥 <strong id="discarded-count">0</strong>
        </span>

        <span>
          🗳️ <strong id="vote-bonus">+0</strong>
        </span>
      </div>

      <div class="material-progress">
        <div id="material-progress-bar"></div>
      </div>
    </section>
  `;

  const timeElement =
    document.querySelector(
      "#print-shop-time"
    );

  const iconElement =
    document.querySelector(
      "#material-icon"
    );

  const titleElement =
    document.querySelector(
      "#material-title"
    );

  const typeElement =
    document.querySelector(
      "#material-type"
    );

  const materialElement =
    document.querySelector(
      "#campaign-material"
    );

  const progressElement =
    document.querySelector(
      "#material-progress-bar"
    );

  function showCurrentMaterial() {
    if (currentIndex >= materials.length) {
      finishPrintShop();
      return;
    }

    const material = materials[currentIndex];

    iconElement.textContent =
      material.icon;

    titleElement.textContent =
      material.title;

    const typeNames = {
      proposal: "PROPOSTA",
      propaganda: "PROPAGANDA",
      fake: "ORIGEM DESCONHECIDA"
    };

    typeElement.textContent =
      typeNames[material.type];

    materialElement.classList.remove(
      "material-enter"
    );

    void materialElement.offsetWidth;

    materialElement.classList.add(
      "material-enter"
    );

    progressElement.style.width =
      `${
        (currentIndex + 1) /
        materials.length *
        100
      }%`;
  }

  function processMaterial(action) {
    if (finished) {
      return;
    }

    const material = materials[currentIndex];
    const result = material[action];

    voteBonus +=
      result.voteBonus ?? 0;

    mergeEffects(
      effects,
      result.effects
    );

    if (action === "publish") {
      published += 1;

      if (material.type === "fake") {
        fakePublished += 1;
      }
    } else {
      discarded += 1;
    }

    currentIndex += 1;

    document.querySelector(
      "#published-count"
    ).textContent = published;

    document.querySelector(
      "#discarded-count"
    ).textContent = discarded;

    document.querySelector(
      "#vote-bonus"
    ).textContent =
      `${voteBonus >= 0 ? "+" : ""}${voteBonus}`;

    showCurrentMaterial();
  }

  document
    .querySelector("#publish-material")
    ?.addEventListener("click", () => {
      processMaterial("publish");
    });

  document
    .querySelector("#discard-material")
    ?.addEventListener("click", () => {
      processMaterial("discard");
    });

  const timer = window.setInterval(() => {
    timeRemaining -= 1;

    timeElement.textContent =
      timeRemaining;

    if (timeRemaining <= 5) {
      timeElement.classList.add("danger");
    }

    if (timeRemaining <= 0) {
      finishPrintShop();
    }
  }, 1000);

  function finishPrintShop() {
    if (finished) {
      return;
    }

    finished = true;
    window.clearInterval(timer);

    const ignored =
      materials.length - currentIndex;

    voteBonus -= ignored;

    const cappedVoteBonus = Math.max(
      -8,
      Math.min(12, voteBonus)
    );

    if (ignored > 0) {
      mergeEffects(effects, {
        indicators: {
          people: ignored * -1
        }
      });
    }

    const performance =
      fakePublished >= 4
        ? {
            icon: "🤥",

            title:
              "A verdade virou um detalhe",

            text:
              "A gráfica inundou o país com informações extremamente alternativas."
          }
        : published >= 6
          ? {
              icon: "🖨️",

              title:
                "Campanha nas ruas",

              text:
                "A gráfica trabalhou sem descanso e sem fazer perguntas."
            }
          : {
              icon: "🔥",

              title:
                "Cautela eleitoral",

              text:
                "Boa parte do material foi destruída antes que alguém perguntasse de onde veio."
            };

    app.innerHTML = `
      <section class="screen print-shop-result-screen">
        <div class="print-shop-result-icon">
          ${performance.icon}
        </div>

        <p class="eyebrow">
          Gráfica encerrada
        </p>

        <h1>${performance.title}</h1>

        <p>${performance.text}</p>

        <div class="print-shop-summary">
          <article>
            <strong>${published}</strong>
            <small>Impressos</small>
          </article>

          <article>
            <strong>${discarded}</strong>
            <small>Destruídos</small>
          </article>

          <article>
            <strong>${fakePublished}</strong>
            <small>Suspeitos</small>
          </article>

          <article>
            <strong>
              ${
                cappedVoteBonus >= 0
                  ? "+"
                  : ""
              }${cappedVoteBonus}
            </strong>

            <small>DataPapel</small>
          </article>
        </div>

        <button
          type="button"
          class="primary-button"
          id="finish-print-shop"
        >
          Ver pesquisa
        </button>
      </section>
    `;

    document
      .querySelector("#finish-print-shop")
      ?.addEventListener("click", () => {
        onComplete({
          id: "clandestine-print-shop",
          name: "Gráfica Clandestina",
          voteBonus: cappedVoteBonus,
          effects,

          printShop: {
            electionType,
            published,
            discarded,
            ignored,
            fakePublished,
            voteBonus: cappedVoteBonus
          }
        });
      });
  }

  showCurrentMaterial();
}