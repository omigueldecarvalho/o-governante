const AREAS = [
  {
    id: "health",
    name: "Saúde",
    icon: "🏥"
  },

  {
    id: "education",
    name: "Educação",
    icon: "📚"
  },

  {
    id: "security",
    name: "Segurança",
    icon: "🛡️"
  },

  {
    id: "infrastructure",
    name: "Infraestrutura",
    icon: "🏗️"
  },

  {
    id: "publicity",
    name: "Publicidade",
    icon: "📺"
  }
];

function clampEffect(value) {
  return Math.max(
    -30,
    Math.min(30, Math.round(value))
  );
}

function calculateEffects(allocation) {
  const {
    health,
    education,
    security,
    infrastructure,
    publicity
  } = allocation;

  return {
    indicators: {
      people: clampEffect(
        (health - 20) * 0.3 +
        (education - 20) * 0.3 -
        (publicity - 20) * 0.1
      ),

      congress: clampEffect(
        (infrastructure - 20) * 0.2 +
        (publicity - 20) * 0.2
      ),

      economy: clampEffect(
        (infrastructure - 20) * 0.4 +
        (education - 20) * 0.1 -
        Math.max(health - 35, 0) * 0.1
      ),

      stability: clampEffect(
        (security - 20) * 0.35 +
        (health - 20) * 0.1
      )
    },

    politics: {
      economicPosition: clampEffect(
        -(
          (health - 20) +
          (education - 20)
        ) * 0.3 +
        (infrastructure - 20) * 0.1
      ),

      socialPosition: clampEffect(
        (security - 20) * 0.2 -
        (education - 20) * 0.2
      ),

      authoritarianism: clampEffect(
        Math.max(security - 20, 0) * 0.5
      ),

      popularParticipation: clampEffect(
        (
          health +
          education -
          40
        ) * 0.2
      ),

      personalism: clampEffect(
        (publicity - 20) * 0.5
      )
    },

    factions: {
      military: clampEffect(
        (security - 20) * 0.5
      ),

      business: clampEffect(
        (infrastructure - 20) * 0.4
      ),

      unions: clampEffect(
        (
          health +
          education -
          40
        ) * 0.25
      ),

      socialMovements: clampEffect(
        (
          health +
          education -
          security -
          20
        ) * 0.2
      ),

      religiousGroups: 0,

      press: clampEffect(
        (publicity - 20) * 0.2
      )
    },

    country: {
      inequality: clampEffect(
        -(
          health +
          education -
          40
        ) * 0.2
      ),

      publicServices: clampEffect(
        (
          health +
          education -
          40
        ) * 0.3
      ),

      environment: 0
    },

    corruption: clampEffect(
      Math.max(publicity - 20, 0) * 0.25
    ),

    personalWealth: 0
  };
}

function getResultText(allocation) {
  const largestArea = Object.entries(allocation)
    .sort((a, b) => b[1] - a[1])[0];

  const area = AREAS.find(
    (item) => item.id === largestArea[0]
  );

  return `O orçamento foi aprovado com prioridade para ${area.name.toLowerCase()}. Setores beneficiados comemoraram, enquanto as demais áreas reclamaram da distribuição.`;
}

function getFutureEffect(allocation) {
  if (allocation.health <= 10) {
    return {
      afterMonths: 2,

      message:
        "A falta de recursos na saúde provocou filas, falta de medicamentos e uma crise nos hospitais.",

      effects: {
        indicators: {
          people: -15,
          economy: -5,
          stability: -8
        },

        country: {
          publicServices: -10
        }
      }
    };
  }

  if (allocation.education <= 10) {
    return {
      afterMonths: 3,

      message:
        "O corte na educação provocou greves e manifestações de estudantes e professores.",

      effects: {
        indicators: {
          people: -10,
          congress: -4,
          stability: -7
        },

        factions: {
          unions: -8,
          socialMovements: -8
        }
      }
    };
  }

  if (allocation.security >= 40) {
    return {
      afterMonths: 2,

      message:
        "O aumento dos gastos com segurança fortaleceu as forças policiais, mas denúncias de abuso começaram a surgir.",

      effects: {
        indicators: {
          people: -7,
          stability: -5
        },

        factions: {
          military: 5,
          press: -5
        }
      }
    };
  }

  if (allocation.publicity >= 35) {
    return {
      afterMonths: 2,

      message:
        "A imprensa revelou que o governo gastou mais com publicidade do que com serviços essenciais.",

      effects: {
        indicators: {
          people: -12,
          congress: -3,
          stability: -4
        },

        corruption: 8
      }
    };
  }

  return null;
}

export function renderBudgetScreen({
  gameState,
  decision,
  onComplete
}) {
  const app = document.querySelector("#app");

  const allocation = {
    health: 20,
    education: 20,
    security: 20,
    infrastructure: 20,
    publicity: 20
  };

  app.innerHTML = `
    <section class="screen budget-screen">
      <header class="game-status">
        <div>
          <p class="eyebrow">
            Orçamento nacional
          </p>

          <h1>${decision.title}</h1>
        </div>

        <div class="budget-total">
          <small>Distribuído</small>
          <strong id="budget-total">100/100</strong>
        </div>
      </header>

      <p class="budget-description">
        ${decision.description}
      </p>

      <div class="budget-areas">
        ${AREAS.map(
          (area) => `
            <article class="budget-area">
              <div class="budget-area-header">
                <span>
                  ${area.icon}
                  ${area.name}
                </span>

                <strong id="${area.id}-value">
                  20
                </strong>
              </div>

              <input
                type="range"
                class="budget-slider"
                data-area="${area.id}"
                min="0"
                max="60"
                step="5"
                value="20"
              />
            </article>
          `
        ).join("")}
      </div>

      <p
        class="budget-message valid"
        id="budget-message"
      >
        Todo o orçamento foi distribuído.
      </p>

      <button
        type="button"
        class="primary-button"
        id="approve-budget"
      >
        Enviar orçamento ao Congresso
      </button>
    </section>
  `;

  const totalElement = document.querySelector(
    "#budget-total"
  );

  const messageElement = document.querySelector(
    "#budget-message"
  );

  const approveButton = document.querySelector(
    "#approve-budget"
  );

  function updateBudget() {
    const total = Object.values(allocation)
      .reduce((sum, value) => sum + value, 0);

    totalElement.textContent = `${total}/100`;

    if (total === 100) {
      messageElement.textContent =
        "Todo o orçamento foi distribuído.";

      messageElement.className =
        "budget-message valid";

      approveButton.disabled = false;

      return;
    }

    if (total > 100) {
      messageElement.textContent =
        `Você ultrapassou o orçamento em ${
          total - 100
        } pontos.`;
    } else {
      messageElement.textContent =
        `Ainda restam ${
          100 - total
        } pontos para distribuir.`;
    }

    messageElement.className =
      "budget-message invalid";

    approveButton.disabled = true;
  }

  document
    .querySelectorAll(".budget-slider")
    .forEach((slider) => {
      slider.addEventListener("input", () => {
        const area = slider.dataset.area;
        const value = Number(slider.value);

        allocation[area] = value;

        document.querySelector(
          `#${area}-value`
        ).textContent = value;

        updateBudget();
      });
    });

  approveButton.addEventListener(
    "click",
    () => {
      const effects =
        calculateEffects(allocation);

      const futureEffect =
        getFutureEffect(allocation);

      onComplete({
        id: "national-budget-result",

        text:
          "Aprovar o orçamento nacional",

        resultText:
          getResultText(allocation),

        effects,

        futureEffect,

        budget: {
          ...allocation
        }
      });
    }
  );
}