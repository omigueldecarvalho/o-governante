function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value);
}

function createCompactIndicator(icon, name, value) {
  return `
    <article class="compact-indicator">
      <span>${icon}</span>

      <div>
        <small>${name}</small>
        <strong>${value}</strong>
      </div>
    </article>
  `;
}

export function renderDecisionScreen({
  gameState,
  decision,
  onChoice
}) {
  const app = document.querySelector("#app");

  const [firstChoice, secondChoice] = decision.choices;

  app.innerHTML = `
    <section class="screen decision-screen">
      <header class="game-status">
        <div>
          <small>Mandato</small>

          <strong>
            Ano ${gameState.government.year}
            · Mês ${gameState.government.month}
          </strong>
        </div>

        <div class="wealth-summary">
          <small>Patrimônio</small>

          <strong>
            ${formatCurrency(
              gameState.player.personalWealth
            )}
          </strong>
        </div>
      </header>

      <div class="compact-indicators">
        ${createCompactIndicator(
          "👥",
          "Povo",
          gameState.indicators.people
        )}

        ${createCompactIndicator(
          "🏛️",
          "Congresso",
          gameState.indicators.congress
        )}

        ${createCompactIndicator(
          "💰",
          "Economia",
          gameState.indicators.economy
        )}

        ${createCompactIndicator(
          "🛡️",
          "Estabilidade",
          gameState.indicators.stability
        )}

        ${createCompactIndicator(
          "⚠️",
          "Corrupção",
          gameState.corruption
        )}
      </div>

      <article class="decision-card">
        <div class="character">
          <div class="character-image">
            👤
          </div>

          <div>
            <strong>${decision.character.name}</strong>
            <span>${decision.character.role}</span>
          </div>
        </div>

        <span class="decision-category">
          ${decision.category}
        </span>

        <h1>${decision.title}</h1>

        <p>${decision.description}</p>
      </article>

      <div class="choices">
        <button
          type="button"
          class="choice-button first-choice"
          id="first-choice"
        >
          ${firstChoice.text}
        </button>

        <button
          type="button"
          class="choice-button second-choice"
          id="second-choice"
        >
          ${secondChoice.text}
        </button>
      </div>
    </section>
  `;

  document
    .querySelector("#first-choice")
    .addEventListener("click", () => {
      onChoice(firstChoice);
    });

  document
    .querySelector("#second-choice")
    .addEventListener("click", () => {
      onChoice(secondChoice);
    });
}