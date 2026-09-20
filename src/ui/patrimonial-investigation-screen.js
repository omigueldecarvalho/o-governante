import {
  calculatePatrimonialRisk,
  getInvestigationLabel,
  registerInvestigation
} from "../game/patrimonial-investigation.js";

import {
  ensureFinancialState,
  updateUnexplainedWealth
} from "../game/finance-engine.js";

function formatCurrency(value) {
  return Number(value ?? 0)
    .toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    );
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

function createChoice(
  actionId,
  gameState,
  risk
) {
  if (actionId === "transparency") {
    const accountsAreExplainable =
      risk.unexplainedWealth <= 50000;

    gameState.player.image.scrutiny =
      clamp(
        gameState.player.image.scrutiny -
          (
            accountsAreExplainable
              ? 15
              : 2
          ),
        0,
        100
      );

    if (accountsAreExplainable) {
      return {
        id: "investigation-transparent",

        text:
          "Abrir as contas do governo",

        resultText:
          "Os documentos foram divulgados e os auditores não encontraram incompatibilidades relevantes. A transparência fortaleceu o governo.",

        effects: {
          indicators: {
            people: 8,
            congress: 3,
            stability: 5
          },

          factions: {
            press: 8
          },

          politics: {
            authoritarianism: -3,
            popularParticipation: 4
          },

          corruption: -8,
          personalWealth: 0
        }
      };
    }

    return {
      id: "investigation-transparent-failed",

      text:
        "Abrir as contas do governo",

      resultText:
        "A divulgação revelou que parte do patrimônio não poderia ser explicada pelo salário presidencial. A investigação ganhou força.",

      effects: {
        indicators: {
          people: -10,
          congress: -8,
          stability: -7
        },

        factions: {
          press: 6
        },

        politics: {
          popularParticipation: 2
        },

        corruption: 5,
        personalWealth: 0
      }
    };
  }

  if (actionId === "friend") {
    const congress =
      Number(
        gameState.indicators
          ?.congress ?? 50
      );

    const successChance =
      clamp(
        35 +
          congress * 0.35 -
          risk.score * 0.25,
        15,
        70
      );

    const succeeded =
      Math.random() * 100 <
      successChance;

    gameState.player.image.scrutiny =
      clamp(
        gameState.player.image.scrutiny +
          7,
        0,
        100
      );

    if (succeeded) {
      return {
        id: "investigation-friend-success",

        text:
          "Dizer que pertence a um amigo",

        resultText:
          "O amigo apareceu com documentos, uma história pouco convincente e muita disposição para ajudar. A comissão aceitou a explicação por enquanto.",

        effects: {
          indicators: {
            people: -2,
            congress: 6,
            stability: 2
          },

          politics: {
            personalism: 6
          },

          corruption: 8,
          personalWealth: 0
        }
      };
    }

    return {
      id: "investigation-friend-failed",

      text:
        "Dizer que pertence a um amigo",

      resultText:
        "O suposto proprietário não soube informar o endereço do próprio imóvel. A explicação aumentou ainda mais as suspeitas.",

      effects: {
        indicators: {
          people: -9,
          congress: -7,
          stability: -8
        },

        factions: {
          press: -6
        },

        politics: {
          personalism: 7
        },

        corruption: 12,
        personalWealth: 0
      }
    };
  }

  if (actionId === "bribe") {
    gameState.player.image.scrutiny =
      clamp(
        gameState.player.image.scrutiny +
          12,
        0,
        100
      );

    return {
      id: "investigation-bribe",

      text:
        "Comprar o silêncio do relator",

      resultText:
        "A comissão perdeu documentos, cancelou depoimentos e concluiu que o patrimônio presidencial era uma questão de interpretação.",

      wealthSource: "illicit",

      effects: {
        indicators: {
          people: -4,
          congress: 9,
          stability: 3
        },

        politics: {
          personalism: 8,
          authoritarianism: 4
        },

        corruption: 18,
        personalWealth: -150000
      }
    };
  }

  if (actionId === "press") {
    gameState.player.image.scrutiny =
      clamp(
        gameState.player.image.scrutiny +
          15,
        0,
        100
      );

    return {
      id: "investigation-attack-press",

      text:
        "Atacar a imprensa",

      resultText:
        "O governo chamou a investigação de perseguição. A base mais fiel comemorou, mas jornalistas começaram a procurar ainda mais documentos.",

      effects: {
        indicators: {
          people: -4,
          congress: 3,
          stability: -6
        },

        factions: {
          press: -15,
          military: 3
        },

        politics: {
          authoritarianism: 12,
          personalism: 8
        },

        corruption: 5,
        personalWealth: 0
      }
    };
  }

  return null;
}

export function renderPatrimonialInvestigation({
  gameState,
  decision,
  onComplete
}) {
  ensureFinancialState(gameState);

  const app =
    document.querySelector("#app");

  const risk =
    calculatePatrimonialRisk(
      gameState
    );

  const riskLabel =
    getInvestigationLabel(
      risk.level
    );

  const finances =
    gameState.player.finances;

  const assets =
    finances.assets ?? [];

  const assetsHTML =
    assets.length > 0
      ? assets
          .map(
            (asset) => `
              <article class="investigated-asset">
                <span>
                  ${asset.icon ?? "💼"}
                </span>

                <div>
                  <strong>
                    ${asset.name}
                  </strong>

                  <small>
                    ${formatCurrency(
                      asset.price
                    )}
                  </small>
                </div>
              </article>
            `
          )
          .join("")
      : `
        <p class="empty-investigation-assets">
          Nenhum bem particular foi declarado.
        </p>
      `;

  const reasonsHTML =
    risk.reasons.length > 0
      ? risk.reasons
          .map(
            (reason) => `
              <li>${reason}</li>
            `
          )
          .join("")
      : `
        <li>
          A investigação foi aberta por pressão política.
        </li>
      `;

  const canBribe =
    gameState.player.personalWealth >=
    150000;

  app.innerHTML = `
    <section class="
      screen
      patrimonial-investigation-screen
    ">
      <header class="investigation-header">
        <div>
          <p class="eyebrow">
            Comissão parlamentar
          </p>

          <h1>
            ${decision.title}
          </h1>

          <p>
            ${decision.description}
          </p>
        </div>

        <div class="
          investigation-risk
          ${risk.level}
        ">
          <small>
            Risco patrimonial
          </small>

          <strong>
            ${riskLabel.icon}
            ${risk.score}/100
          </strong>

          <span>
            ${riskLabel.label}
          </span>
        </div>
      </header>

      <div class="investigation-progress">
        <div
          class="${risk.level}"
          style="width: ${risk.score}%"
        ></div>
      </div>

      <section class="investigation-summary">
        <article>
          <small>Renda legal</small>

          <strong>
            ${formatCurrency(
              finances.lawfulIncome
            )}
          </strong>
        </article>

        <article>
          <small>Dinheiro ilícito</small>

          <strong>
            ${formatCurrency(
              finances.illicitIncome
            )}
          </strong>
        </article>

        <article>
          <small>Sem explicação</small>

          <strong>
            ${formatCurrency(
              finances.unexplainedWealth
            )}
          </strong>
        </article>
      </section>

      <div class="investigation-layout">
        <section class="investigation-dossier">
          <h2>📁 Dossiê patrimonial</h2>

          <ul>
            ${reasonsHTML}
          </ul>
        </section>

        <section class="investigation-assets">
          <h2>🏛️ Bens encontrados</h2>

          <div>
            ${assetsHTML}
          </div>
        </section>
      </div>

      <section class="investigation-actions">
        <h2>
          Como o governo responderá?
        </h2>

        <button
          type="button"
          class="investigation-action"
          data-action="transparency"
        >
          <span>📂</span>

          <div>
            <strong>
              Abrir as contas
            </strong>

            <small>
              Funciona melhor quando o patrimônio
              possui explicação.
            </small>
          </div>
        </button>

        <button
          type="button"
          class="investigation-action"
          data-action="friend"
        >
          <span>🤝</span>

          <div>
            <strong>
              Dizer que pertence a um amigo
            </strong>

            <small>
              O Congresso pode aceitar. Ou o amigo
              pode esquecer a história.
            </small>
          </div>
        </button>

        <button
          type="button"
          class="investigation-action"
          data-action="bribe"
          ${canBribe ? "" : "disabled"}
        >
          <span>💼</span>

          <div>
            <strong>
              Comprar o silêncio
            </strong>

            <small>
              ${
                canBribe
                  ? "Custo: R$ 150.000"
                  : "Você não possui R$ 150.000"
              }
            </small>
          </div>
        </button>

        <button
          type="button"
          class="investigation-action"
          data-action="press"
        >
          <span>📢</span>

          <div>
            <strong>
              Atacar a imprensa
            </strong>

            <small>
              Mobiliza a base, mas aumenta
              o autoritarismo e a investigação.
            </small>
          </div>
        </button>
      </section>
    </section>
  `;

  document
    .querySelectorAll(
      ".investigation-action"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          const choice =
            createChoice(
              button.dataset.action,
              gameState,
              risk
            );

          if (!choice) {
            return;
          }

          registerInvestigation(
            gameState,
            choice
          );

          updateUnexplainedWealth(
            gameState
          );

          onComplete(choice);
        }
      );
    });
}