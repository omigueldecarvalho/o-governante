const REQUIRED_VOTES = 308;
const TOTAL_DEPUTIES = 513;

const BLOCS = [
  {
    id: "center",
    icon: "🐘",
    name: "Centrão Unido",
    votes: 90,

    effects: {
      factions: {
        business: 3
      }
    }
  },

  {
    id: "religious",
    icon: "🙏",
    name: "Bancada da Fé",
    votes: 55,

    effects: {
      factions: {
        religiousGroups: 10,
        socialMovements: -3
      },

      politics: {
        socialPosition: 5
      }
    }
  },

  {
    id: "rural",
    icon: "🐂",
    name: "Frente do Agro",
    votes: 45,

    effects: {
      factions: {
        business: 8,
        socialMovements: -4
      },

      country: {
        environment: -3
      },

      politics: {
        economicPosition: 4
      }
    }
  },

  {
    id: "workers",
    icon: "✊",
    name: "Bloco Trabalhista",
    votes: 50,

    effects: {
      factions: {
        unions: 10,
        business: -3
      },

      politics: {
        economicPosition: -4,
        popularParticipation: 3
      }
    }
  },

  {
    id: "security",
    icon: "🔫",
    name: "Bancada da Ordem",
    votes: 40,

    effects: {
      factions: {
        military: 10,
        socialMovements: -5
      },

      politics: {
        authoritarianism: 5
      }
    }
  },

  {
    id: "green",
    icon: "🌳",
    name: "Bloco Ambiental",
    votes: 30,

    effects: {
      factions: {
        socialMovements: 7,
        business: -4
      },

      country: {
        environment: 8
      },

      politics: {
        economicPosition: -2,
        popularParticipation: 4
      }
    }
  }
];

const METHODS = {
  dialogue: {
    icon: "💬",
    name: "Negociar",
    cost: 30,

    effects: {
      indicators: {
        people: 2,
        congress: 3,
        stability: 3
      },

      politics: {
        popularParticipation: 3,
        personalism: -2
      },

      corruption: 0
    }
  },

  amendment: {
    icon: "💰",
    name: "Emenda",
    cost: 20,

    effects: {
      indicators: {
        economy: -4,
        congress: 4
      },

      politics: {
        personalism: 2
      },

      corruption: 5
    }
  },

  ministry: {
    icon: "🪑",
    name: "Dar cargo",
    cost: 15,

    effects: {
      indicators: {
        people: -2,
        congress: 6
      },

      politics: {
        personalism: 5,
        popularParticipation: -2
      },

      corruption: 7
    }
  },

  blackmail: {
    icon: "📸",
    name: "Chantagear",
    cost: 10,

    effects: {
      indicators: {
        congress: 5,
        stability: -6
      },

      politics: {
        authoritarianism: 7,
        personalism: 7,
        popularParticipation: -5
      },

      factions: {
        press: -5
      },

      corruption: 10
    }
  }
};

function clamp(value, minimum, maximum) {
  return Math.max(
    minimum,
    Math.min(maximum, value)
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

function createFutureEffect(methodUsage) {
  if (methodUsage.blackmail >= 2) {
    return {
      afterMonths: 3,

      message:
        "Gravações das chantagens usadas para conquistar votos chegaram à imprensa.",

      effects: {
        indicators: {
          people: -12,
          congress: -10,
          economy: -2,
          stability: -12
        },

        factions: {
          press: -12
        },

        corruption: 15
      }
    };
  }

  if (
    methodUsage.amendment +
      methodUsage.ministry >=
    3
  ) {
    return {
      afterMonths: 4,

      message:
        "Os acordos da votação começaram a pressionar o orçamento e dividir o governo.",

      effects: {
        indicators: {
          people: -7,
          congress: -5,
          economy: -8,
          stability: -3
        },

        corruption: 8
      }
    };
  }

  return null;
}

export function renderCongressVoteGame({
  gameState,
  decision,
  onComplete
}) {
  const app = document.querySelector("#app");

  if (!app) {
    return;
  }

  let politicalCapital = 100;
  let finished = false;

  let securedVotes = clamp(
    Math.round(
      70 +
      gameState.indicators.congress * 1.5
    ),
    80,
    220
  );

  const baseVotes = securedVotes;
  const selectedBlocs = [];
  const effects = createEmptyEffects();

  const methodUsage = {
    dialogue: 0,
    amendment: 0,
    ministry: 0,
    blackmail: 0
  };

  const blocsHTML = BLOCS.map(
    (bloc) => `
      <article
        class="congress-bloc"
        data-bloc-id="${bloc.id}"
      >
        <header>
          <span>${bloc.icon}</span>

          <div>
            <strong>${bloc.name}</strong>
            <small>${bloc.votes} votos</small>
          </div>
        </header>

        <div class="bloc-methods">
          ${Object.entries(METHODS)
            .map(
              ([methodId, method]) => `
                <button
                  type="button"
                  class="bloc-method"
                  data-bloc-id="${bloc.id}"
                  data-method-id="${methodId}"
                  title="${method.name}"
                >
                  <span>${method.icon}</span>
                  <small>${method.cost}</small>
                </button>
              `
            )
            .join("")}
        </div>

        <div class="bloc-status">
          Aguardando proposta
        </div>
      </article>
    `
  ).join("");

  app.innerHTML = `
    <section class="screen congress-game-screen">
      <header class="congress-game-header">
        <div>
          <p class="eyebrow">
            Votação no Congresso
          </p>

          <h1>${decision.title}</h1>
        </div>

        <div class="political-capital">
          <small>Capital político</small>

          <strong id="political-capital">
            ${politicalCapital}
          </strong>
        </div>
      </header>

      <div class="congress-vote-counter">
        <strong id="secured-votes">
          ${securedVotes}
        </strong>

        <span>
          / ${REQUIRED_VOTES} votos
        </span>
      </div>

      <div class="congress-vote-progress">
        <div
          id="congress-vote-progress"
          style="width: ${
            securedVotes /
            REQUIRED_VOTES *
            100
          }%"
        ></div>
      </div>

      <div class="method-legend">
        ${Object.values(METHODS)
          .map(
            (method) => `
              <span>
                ${method.icon}
                ${method.name}
                (${method.cost})
              </span>
            `
          )
          .join("")}
      </div>

      <div class="congress-blocs">
        ${blocsHTML}
      </div>

      <p
        class="congress-message"
        id="congress-message"
      >
        Conquiste pelo menos 308 votos.
      </p>

      <button
        type="button"
        class="primary-button"
        id="start-congress-vote"
      >
        Levar projeto à votação
      </button>
    </section>
  `;

  const capitalElement =
    document.querySelector(
      "#political-capital"
    );

  const votesElement =
    document.querySelector(
      "#secured-votes"
    );

  const progressElement =
    document.querySelector(
      "#congress-vote-progress"
    );

  const messageElement =
    document.querySelector(
      "#congress-message"
    );

  function updateInformation() {
    capitalElement.textContent =
      politicalCapital;

    votesElement.textContent =
      securedVotes;

    progressElement.style.width =
      `${Math.min(
        securedVotes /
          REQUIRED_VOTES *
          100,
        100
      )}%`;

    progressElement.classList.toggle(
      "approved",
      securedVotes >= REQUIRED_VOTES
    );
  }

  function secureBloc(blocId, methodId) {
    if (finished) {
      return;
    }

    const alreadySelected =
      selectedBlocs.some(
        (item) => item.id === blocId
      );

    if (alreadySelected) {
      return;
    }

    const bloc = BLOCS.find(
      (item) => item.id === blocId
    );

    const method = METHODS[methodId];

    if (!bloc || !method) {
      return;
    }

    if (politicalCapital < method.cost) {
      messageElement.textContent =
        "Capital político insuficiente.";

      return;
    }

    politicalCapital -= method.cost;

    securedVotes = clamp(
      securedVotes + bloc.votes,
      0,
      TOTAL_DEPUTIES
    );

    selectedBlocs.push({
      id: bloc.id,
      name: bloc.name,
      votes: bloc.votes,
      method: methodId
    });

    methodUsage[methodId] += 1;

    mergeEffects(effects, bloc.effects);
    mergeEffects(effects, method.effects);

    const blocElement =
      document.querySelector(
        `[data-bloc-id="${blocId}"]`
      );

    if (blocElement) {
      blocElement.classList.add("secured");

      blocElement
        .querySelectorAll("button")
        .forEach((button) => {
          button.disabled = true;
        });

      const status =
        blocElement.querySelector(
          ".bloc-status"
        );

      if (status) {
        status.textContent =
          `${method.icon} Apoio garantido`;
      }
    }

    messageElement.textContent =
      `${bloc.name} entrou para a base usando: ${method.name}.`;

    if (securedVotes >= REQUIRED_VOTES) {
      messageElement.textContent =
        "Maioria conquistada! O projeto pode ser votado.";
    }

    updateInformation();
  }

  document
    .querySelectorAll(".bloc-method")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          secureBloc(
            button.dataset.blocId,
            button.dataset.methodId
          );
        }
      );
    });

  document
    .querySelector(
      "#start-congress-vote"
    )
    ?.addEventListener(
      "click",
      finishCongressVote
    );

  function finishCongressVote() {
    if (finished) {
      return;
    }

    finished = true;

    const proposalPassed =
      securedVotes >= REQUIRED_VOTES;

    if (proposalPassed) {
      mergeEffects(effects, {
        indicators: {
          people: 3,
          congress: 10,
          stability: 6
        }
      });
    } else {
      mergeEffects(effects, {
        indicators: {
          people: -4,
          congress: -12,
          stability: -7
        }
      });
    }

    onComplete({
      id: proposalPassed
        ? "proposal-approved"
        : "proposal-rejected",

      text: proposalPassed
        ? "Aprovar o projeto no Congresso"
        : "Fracassar na votação",

      resultText: proposalPassed
        ? `O projeto foi aprovado com ${securedVotes} votos. Ninguém quis explicar detalhadamente os acordos.`
        : `O projeto recebeu apenas ${securedVotes} votos. A oposição comemorou e sua base pediu mais cargos.`,

      effects,

      futureEffect:
        createFutureEffect(methodUsage),

      congressVote: {
        baseVotes,
        finalVotes: securedVotes,
        requiredVotes: REQUIRED_VOTES,
        proposalPassed,
        politicalCapitalRemaining:
          politicalCapital,
        selectedBlocs,
        methodUsage
      }
    });
  }
}