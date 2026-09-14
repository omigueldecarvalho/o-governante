const BET_OPTIONS = [
  {
    id: "cautious",
    label: "10%",
    percentage: 0.1
  },
  {
    id: "confident",
    label: "25%",
    percentage: 0.25
  },
  {
    id: "reckless",
    label: "50%",
    percentage: 0.5
  },
  {
    id: "all-in",
    label: "Tudo",
    percentage: 1
  }
];

const SYMBOLS = [
  {
    icon: "🐯",
    weight: 10
  },
  {
    icon: "💰",
    weight: 18
  },
  {
    icon: "⭐",
    weight: 20
  },
  {
    icon: "🍊",
    weight: 25
  },
  {
    icon: "🍒",
    weight: 27
  }
];

function formatCurrency(value) {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    }
  ).format(value);
}

function getRandomSymbol() {
  const random =
    Math.random() * 100;

  let accumulatedWeight = 0;

  for (const symbol of SYMBOLS) {
    accumulatedWeight += symbol.weight;

    if (random <= accumulatedWeight) {
      return symbol.icon;
    }
  }

  return "🍒";
}

function calculateResult(reels) {
  const [first, second, third] = reels;

  const tigerCount = reels.filter(
    (symbol) => symbol === "🐯"
  ).length;

  if (tigerCount === 3) {
    return {
      id: "tiger-jackpot",
      title: "O Tigrinho pagou!",
      label: "JACKPOT",
      multiplier: 5,
      icon: "🐯",
      className: "jackpot"
    };
  }

  if (
    first === second &&
    second === third
  ) {
    return {
      id: "triple",
      title: "Trinca premiada!",
      label: "PRÊMIO 2X",
      multiplier: 2,
      icon: "💰",
      className: "win"
    };
  }

  if (tigerCount === 2) {
    return {
      id: "two-tigers",
      title: "O tigre quase veio!",
      label: "PRÊMIO 1X",
      multiplier: 1,
      icon: "🐯",
      className: "win"
    };
  }

  if (
    first === second ||
    first === third ||
    second === third
  ) {
    return {
      id: "pair",
      title: "Uma duplinha salvou!",
      label: "PRÊMIO 0,5X",
      multiplier: 0.5,
      icon: "🪙",
      className: "small-win"
    };
  }

  return {
    id: "loss",
    title: "Hoje o Tigrinho estava com fome",
    label: "PERDEU",
    multiplier: -1,
    icon: "💸",
    className: "loss"
  };
}

function calculateCaughtChance(
  percentage,
  corruption
) {
  return Math.min(
    80,
    Math.round(
      10 +
      percentage * 35 +
      corruption * 0.2
    )
  );
}

export function renderTigrinhoGame({
  gameState,
  decision,
  onComplete
}) {
  const app =
    document.querySelector("#app");

  const personalWealth = Math.max(
    0,
    gameState.player
      ?.personalWealth ?? 0
  );

  let selectedBet = BET_OPTIONS[0];
  let spinning = false;

  function calculateBetValue() {
    return Math.max(
      1,
      Math.floor(
        personalWealth *
        selectedBet.percentage
      )
    );
  }

  app.innerHTML = `
    <section class="screen tigrinho-screen">
      <header class="tigrinho-header">
        <div>
          <p class="eyebrow">
            Aplicativo não oficial
          </p>

          <h1>${decision.title}</h1>

          <p class="tigrinho-subtitle">
            A fortuna do país não.
            A sua pode.
          </p>
        </div>

        <div class="tigrinho-wallet">
          <span>💼 Patrimônio</span>

          <strong>
            ${formatCurrency(
              personalWealth
            )}
          </strong>
        </div>
      </header>

      <div class="tigrinho-machine">
        <div class="tigrinho-logo">
          <span>🐯</span>

          <div>
            <strong>
              TIGRINHO DO PLANALTO
            </strong>

            <small>
              Confia no pai da nação
            </small>
          </div>
        </div>

        <div class="tigrinho-reels">
          <div
            class="tigrinho-reel"
            id="tiger-reel-1"
          >
            ❔
          </div>

          <div
            class="tigrinho-reel"
            id="tiger-reel-2"
          >
            ❔
          </div>

          <div
            class="tigrinho-reel"
            id="tiger-reel-3"
          >
            ❔
          </div>
        </div>

        <div class="tigrinho-prizes">
          <span>🐯🐯🐯 = 5x</span>
          <span>💰💰💰 = 2x</span>
          <span>🍒🍒 = 0,5x</span>
        </div>

        <div class="tigrinho-bet">
          <small>Valor da aposta</small>

          <strong id="tiger-bet-value">
            ${formatCurrency(
              calculateBetValue()
            )}
          </strong>
        </div>

        <div class="tigrinho-bet-options">
          ${BET_OPTIONS.map(
            (option) => `
              <button
                type="button"
                class="tigrinho-bet-button ${
                  option.id ===
                  selectedBet.id
                    ? "selected"
                    : ""
                }"
                data-bet-id="${option.id}"
              >
                ${option.label}
              </button>
            `
          ).join("")}
        </div>

        <button
          type="button"
          class="tigrinho-spin-button"
          id="spin-tigrinho"
        >
          <span>🎰</span>
          GIRAR
        </button>
      </div>

      <p class="tigrinho-warning">
        Quanto maior a aposta, maior a
        chance de a imprensa descobrir.
      </p>
    </section>
  `;

  const reelElements = [
    document.querySelector(
      "#tiger-reel-1"
    ),
    document.querySelector(
      "#tiger-reel-2"
    ),
    document.querySelector(
      "#tiger-reel-3"
    )
  ];

  const betValueElement =
    document.querySelector(
      "#tiger-bet-value"
    );

  const spinButton =
    document.querySelector(
      "#spin-tigrinho"
    );

  document
    .querySelectorAll(
      ".tigrinho-bet-button"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          if (spinning) {
            return;
          }

          const option =
            BET_OPTIONS.find(
              (item) =>
                item.id ===
                button.dataset.betId
            );

          if (!option) {
            return;
          }

          selectedBet = option;

          betValueElement.textContent =
            formatCurrency(
              calculateBetValue()
            );

          document
            .querySelectorAll(
              ".tigrinho-bet-button"
            )
            .forEach((item) => {
              item.classList.toggle(
                "selected",
                item === button
              );
            });
        }
      );
    });

  spinButton.addEventListener(
    "click",
    () => {
      if (
        spinning ||
        personalWealth <= 0
      ) {
        return;
      }

      spinning = true;
      spinButton.disabled = true;
      spinButton.innerHTML =
        "<span>🐯</span> GIRANDO...";

      document
        .querySelectorAll(
          ".tigrinho-bet-button"
        )
        .forEach((button) => {
          button.disabled = true;
        });

      const finalReels = [
        getRandomSymbol(),
        getRandomSymbol(),
        getRandomSymbol()
      ];

      let spinCount = 0;

      const animation = setInterval(
        () => {
          reelElements.forEach(
            (reel, index) => {
              if (
                spinCount <
                18 + index * 5
              ) {
                reel.textContent =
                  getRandomSymbol();

                reel.classList.add(
                  "spinning"
                );
              } else {
                reel.textContent =
                  finalReels[index];

                reel.classList.remove(
                  "spinning"
                );
              }
            }
          );

          spinCount += 1;

          if (spinCount >= 29) {
            clearInterval(animation);

            reelElements.forEach(
              (reel, index) => {
                reel.textContent =
                  finalReels[index];

                reel.classList.remove(
                  "spinning"
                );
              }
            );

            const result =
              calculateResult(
                finalReels
              );

            setTimeout(() => {
              showResult(
                finalReels,
                result
              );
            }, 650);
          }
        },
        90
      );
    }
  );

  function showResult(
    reels,
    result
  ) {
    const betValue =
      calculateBetValue();

    const wealthChange = Math.floor(
      betValue * result.multiplier
    );

    const caughtChance =
      calculateCaughtChance(
        selectedBet.percentage,
        gameState.corruption ?? 0
      );

    const caught =
      Math.random() * 100 <
      caughtChance;

    const effects = {
      indicators: {
        people:
          result.multiplier > 0
            ? 2
            : -1,

        congress: 0,
        economy: 0,

        stability:
          result.multiplier > 0
            ? 1
            : -2
      },

      factions: {
        press: 0
      },

      country: {},

      politics: {
        personalism:
          result.multiplier > 0
            ? 3
            : 1
      },

      corruption: 2,

      personalWealth:
        wealthChange
    };

    if (caught) {
      effects.indicators.people -= 10;
      effects.indicators.congress -= 6;
      effects.indicators.stability -= 6;

      effects.factions.press -= 12;

      effects.politics.personalism += 4;

      effects.corruption += 9;
    }

    let resultText;

    if (result.multiplier > 0) {
      resultText =
        `O Tigrinho liberou a carta! ` +
        `Você ganhou ${formatCurrency(
          wealthChange
        )}.`;
    } else {
      resultText =
        `O aplicativo agradeceu sua ` +
        `"contribuição" de ${formatCurrency(
          betValue
        )}.`;
    }

    if (caught) {
      resultText +=
        " Um jornalista registrou o governante comemorando diante das roletas.";
    } else {
      resultText +=
        " A jogatina terminou antes que alguém descobrisse.";
    }

    app.innerHTML = `
      <section
        class="screen tigrinho-result-screen"
      >
        <div
          class="tigrinho-result-icon ${
            result.className
          }"
        >
          ${result.icon}
        </div>

        <p class="eyebrow">
          Resultado da rodada
        </p>

        <h1>${result.title}</h1>

        <div class="tigrinho-final-reels">
          ${reels
            .map(
              (symbol) => `
                <span>${symbol}</span>
              `
            )
            .join("")}
        </div>

        <strong
          class="tigrinho-result-label ${
            result.className
          }"
        >
          ${result.label}
        </strong>

        <div
          class="tigrinho-money-change ${
            wealthChange >= 0
              ? "positive"
              : "negative"
          }"
        >
          ${
            wealthChange >= 0
              ? "+"
              : "-"
          }

          ${formatCurrency(
            Math.abs(wealthChange)
          )}
        </div>

        <p class="tigrinho-result-text">
          ${resultText}
        </p>

        ${
          caught
            ? `
              <div class="tigrinho-caught">
                📸 FLAGRADO PELA IMPRENSA
              </div>
            `
            : `
              <div class="tigrinho-escaped">
                🥸 NINGUÉM DESCOBRIU
              </div>
            `
        }

        <button
          type="button"
          class="primary-button"
          id="continue-tigrinho"
        >
          Voltar ao governo
        </button>
      </section>
    `;

    document
      .querySelector(
        "#continue-tigrinho"
      )
      .addEventListener(
        "click",
        () => {
          onComplete({
            id: result.id,

            text:
              result.multiplier > 0
                ? "Ganhar no Tigrinho"
                : "Perder no Tigrinho",

            resultText,

            effects,

            metadata: {
              tigrinho: {
                reels,
                bet: betValue,
                multiplier:
                  result.multiplier,
                wealthChange,
                caught,
                caughtChance
              }
            }
          });
        }
      );
  }
}