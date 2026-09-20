const INDICATOR_LABELS = {
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

function createEffectItem(key, value) {
  if (value === 0 || value === undefined) {
    return "";
  }

  const indicator = INDICATOR_LABELS[key];

  if (!indicator) {
    return "";
  }

  const signal = value > 0 ? "+" : "";
  const effectClass = value > 0
    ? "positive"
    : "negative";

  return `
    <article class="result-effect ${effectClass}">
      <span>${indicator.icon}</span>

      <div>
        <small>${indicator.name}</small>
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

function createWealthEffect(value) {
  if (value === 0 || value === undefined) {
    return "";
  }

  const formattedValue = new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
      signDisplay: "always"
    }
  ).format(value);

  return `
    <article class="result-effect wealth">
      <span>💼</span>

      <div>
        <small>Patrimônio pessoal</small>
        <strong>${formattedValue}</strong>
      </div>
    </article>
  `;
}

export function renderChoiceResult({
  decision,
  choice,
  gameState,
  onContinue,
  onOpenShop
}) {
  const app =
    document.querySelector("#app");

  if (!choice) {
    console.error(
      "Escolha não recebida."
    );

    return;
  }

  const effects =
    choice.effects ?? {};

  const indicatorEffects =
    effects.indicators ?? {};

  const effectsHTML =
    Object.entries(
      indicatorEffects
    )
      .map(([key, value]) => {
        return createEffectItem(
          key,
          value
        );
      })
      .join("");

  const corruptionHTML =
    createCorruptionEffect(
      effects.corruption
    );

  const wealthHTML =
    createWealthEffect(
      effects.personalWealth
    );

  const resultText =
    choice.resultText ||
    "A decisão foi anunciada e o país começou a reagir.";

  const salaryReceived = Number(
    gameState?.government
      ?.lastSalaryPayment ?? 0
  );

  const currentWealth = Number(
    gameState?.player
      ?.personalWealth ?? 0
  );

  app.innerHTML = `
    <section class="screen result-screen">
      <p class="eyebrow">
        Consequência imediata
      </p>

      <h1>
        ${decision.title}
      </h1>

      <section class="presidential-finance-bar">
        <div class="finance-icon">
          💰
        </div>

        <div class="finance-item">
          <small>
            Salário recebido
          </small>

          <strong>
            ${salaryReceived.toLocaleString(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL"
              }
            )}
          </strong>
        </div>

        <div class="finance-item wealth">
          <small>
            Patrimônio atual
          </small>

          <strong>
            ${currentWealth.toLocaleString(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL"
              }
            )}
          </strong>
        </div>

        ${
          typeof onOpenShop ===
          "function"
            ? `
              <button
                type="button"
                class="finance-shop-button"
                id="open-presidential-shop"
              >
                <span>🛍️</span>

                <div>
                  <small>
                    Usar patrimônio
                  </small>

                  <strong>
                    Shopping
                  </strong>
                </div>
              </button>
            `
            : ""
        }
      </section>

      <article class="selected-choice">
        <small>
          Sua decisão
        </small>

        <strong>
          ${choice.text}
        </strong>
      </article>

      <article class="result-message">
        <span class="result-message-icon">
          📰
        </span>

        <div>
          <small>
            Reação do país
          </small>

          <p>
            ${resultText}
          </p>
        </div>
      </article>

      <div class="result-effects">
        ${effectsHTML}
        ${corruptionHTML}
        ${wealthHTML}
      </div>

      ${
        choice.futureEffect
          ? `
            <article class="future-warning">
              <span>⏳</span>

              <p>
                Essa decisão poderá produzir
                consequências no futuro.
              </p>
            </article>
          `
          : ""
      }

      <button
        type="button"
        class="primary-button"
        id="continue-after-result"
      >
        Continuar
      </button>
    </section>
  `;

  const shopButton =
    document.querySelector(
      "#open-presidential-shop"
    );

  if (
    shopButton &&
    typeof onOpenShop === "function"
  ) {
    shopButton.addEventListener(
      "click",
      () => {
        onOpenShop();
      }
    );
  }

  const continueButton =
    document.querySelector(
      "#continue-after-result"
    );

  if (
    continueButton &&
    typeof onContinue === "function"
  ) {
    continueButton.addEventListener(
      "click",
      onContinue
    );
  }
}