const EFFECT_LABELS = {
  people: {
    icon: "👥",
    name: "Povo"
  },

  congress: {
    icon: "🏛️",
    name: "Congresso"
  },

  economy: {
    icon: "💰",
    name: "Economia"
  },

  stability: {
    icon: "🛡️",
    name: "Estabilidade"
  }
};

function createEffect(key, value) {
  if (value === 0 || value === undefined) {
    return "";
  }

  const information = EFFECT_LABELS[key];

  if (!information) {
    return "";
  }

  const signal = value > 0 ? "+" : "";
  const effectClass = value > 0
    ? "positive"
    : "negative";

  return `
    <article class="result-effect ${effectClass}">
      <span>${information.icon}</span>

      <div>
        <small>${information.name}</small>
        <strong>${signal}${value}</strong>
      </div>
    </article>
  `;
}

function createCorruptionEffect(value) {
  if (value === 0 || value === undefined) {
    return "";
  }

  const signal = value > 0 ? "+" : "";
  const effectClass = value > 0
    ? "negative"
    : "positive";

  return `
    <article class="result-effect ${effectClass}">
      <span>⚠️</span>

      <div>
        <small>Corrupção</small>
        <strong>${signal}${value}</strong>
      </div>
    </article>
  `;
}

export function renderConsequenceScreen({
  consequence,
  gameState,
  onContinue
}) {
  const app = document.querySelector("#app");
  const effects = consequence.effects ?? {};

  const indicatorEffects = Object.entries(
    effects.indicators ?? {}
  )
    .map(([key, value]) => {
      return createEffect(key, value);
    })
    .join("");

  const corruptionEffect =
    createCorruptionEffect(effects.corruption);

  app.innerHTML = `
    <section class="screen consequence-screen">
      <div class="consequence-icon">⏳</div>

      <p class="eyebrow">
        Consequência de uma decisão anterior
      </p>

      <h1>O passado retornou</h1>

      <article class="consequence-message">
        <span>📰</span>

        <p>${consequence.message}</p>
      </article>

      <div class="result-effects">
        ${indicatorEffects}
        ${corruptionEffect}
      </div>

      <div class="consequence-date">
        Ano ${gameState.government.year}
        · Mês ${gameState.government.month}
      </div>

      <button
        type="button"
        class="primary-button"
        id="continue-consequence"
      >
        Continuar governo
      </button>
    </section>
  `;

  document
    .querySelector("#continue-consequence")
    .addEventListener("click", onContinue);
}