const ALLIANCES = {
  atlantic: {
    id: "atlantic",
    icon: "🦅",
    name: "Neo-Eixo Ocidental",
    countries: "EUA, Inglaterra e Israel",

    effects: {
      indicators: {
        congress: 5,
        economy: 4
      },

      factions: {
        business: 7,
        military: 6,
        unions: -3
      },

      politics: {
        economicPosition: 5,
        authoritarianism: 3
      }
    }
  },

  brics: {
    id: "brics",
    icon: "🐉",
    name: "Pan-BRICS",
    countries:
      "China, Rússia e Coreia do Norte",

    effects: {
      indicators: {
        congress: -3,
        stability: 5
      },

      factions: {
        unions: 5,
        military: 7,
        business: -4
      },

      politics: {
        economicPosition: -5,
        authoritarianism: 4
      }
    }
  },

  neutral: {
    id: "neutral",
    icon: "🕊️",
    name: "Neutralidade brasileira",
    countries: "Brasil por conta própria",

    effects: {
      indicators: {
        people: 5,
        congress: -2
      },

      factions: {
        military: -3,
        socialMovements: 5
      },

      politics: {
        popularParticipation: 5,
        personalism: -3
      }
    }
  }
};

const REGIONS = [
  {
    id: "north",
    icon: "🌳",
    name: "Norte",
    enemyStrength: 5
  },
  {
    id: "northeast",
    icon: "☀️",
    name: "Nordeste",
    enemyStrength: 6
  },
  {
    id: "center",
    icon: "🌾",
    name: "Centro-Oeste",
    enemyStrength: 5
  },
  {
    id: "southeast",
    icon: "🏭",
    name: "Sudeste",
    enemyStrength: 8
  },
  {
    id: "south",
    icon: "❄️",
    name: "Sul",
    enemyStrength: 7
  }
];

const STRATEGIES = {
  attack: {
    id: "attack",
    icon: "⚔️",
    name: "Atacar"
  },
  defend: {
    id: "defend",
    icon: "🛡️",
    name: "Defender"
  },
  sabotage: {
    id: "sabotage",
    icon: "🕵️",
    name: "Sabotar"
  }
};

function randomBetween(
  minimum,
  maximum
) {
  return Math.floor(
    Math.random() *
      (maximum - minimum + 1)
  ) + minimum;
}

function shuffle(items) {
  const result = [...items];

  for (
    let index = result.length - 1;
    index > 0;
    index -= 1
  ) {
    const randomIndex = Math.floor(
      Math.random() * (index + 1)
    );

    [
      result[index],
      result[randomIndex]
    ] = [
      result[randomIndex],
      result[index]
    ];
  }

  return result;
}

function createEmptyEffects() {
  return {
    indicators: {},
    factions: {},
    country: {},
    politics: {},
    corruption: 0,
    personalWealth: 0
  };
}

function mergeGroup(
  target,
  source = {}
) {
  Object.entries(source).forEach(
    ([key, value]) => {
      target[key] =
        (target[key] ?? 0) + value;
    }
  );
}

function mergeEffects(
  target,
  source = {}
) {
  mergeGroup(
    target.indicators,
    source.indicators
  );

  mergeGroup(
    target.factions,
    source.factions
  );

  mergeGroup(
    target.country,
    source.country
  );

  mergeGroup(
    target.politics,
    source.politics
  );

  target.corruption +=
    source.corruption ?? 0;

  target.personalWealth +=
    source.personalWealth ?? 0;
}

export function renderWarGame({
  gameState,
  decision,
  onComplete
}) {
  const app =
    document.querySelector("#app");

  let selectedAlliance = null;

  const troops = Object.fromEntries(
    REGIONS.map(
      (region) => [
        region.id,
        1
      ]
    )
  );

  let remainingTroops = 7;
  let battleRegions = [];
  let battleIndex = 0;
  const battleResults = [];

  renderAllianceSelection();

  function renderAllianceSelection() {
    app.innerHTML = `
      <section class="screen war-screen">
        <header class="war-header">
          <p class="eyebrow">
            Conflito internacional
          </p>

          <h1>${decision.title}</h1>

          <p>
            Escolha um bloco ou tente
            enfrentar a crise sozinho.
          </p>
        </header>

        <div class="war-alliances">
          ${Object.values(ALLIANCES)
            .map(
              (alliance) => `
                <button
                  type="button"
                  class="war-alliance"
                  data-alliance-id="${
                    alliance.id
                  }"
                >
                  <span>
                    ${alliance.icon}
                  </span>

                  <strong>
                    ${alliance.name}
                  </strong>

                  <small>
                    ${alliance.countries}
                  </small>
                </button>
              `
            )
            .join("")}
        </div>
      </section>
    `;

    document
      .querySelectorAll(
        ".war-alliance"
      )
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            selectedAlliance =
              ALLIANCES[
                button.dataset
                  .allianceId
              ];

            renderDeployment();
          }
        );
      });
  }

  function renderDeployment() {
    app.innerHTML = `
      <section class="screen war-screen">
        <header class="war-game-header">
          <div>
            <p class="eyebrow">
              Operação Defesa Nacional
            </p>

            <h1>
              Distribua suas tropas
            </h1>
          </div>

          <div class="remaining-troops">
            <small>Tropas restantes</small>

            <strong id="remaining-troops">
              ${remainingTroops}
            </strong>
          </div>
        </header>

        <div class="selected-alliance">
          <span>
            ${selectedAlliance.icon}
          </span>

          <div>
            <small>Aliança escolhida</small>

            <strong>
              ${selectedAlliance.name}
            </strong>
          </div>
        </div>

        <div class="war-map">
          ${REGIONS.map(
            (region) => `
              <article
                class="
                  war-region
                  war-region--${region.id}
                "
              >
                <span class="region-icon">
                  ${region.icon}
                </span>

                <strong>
                  ${region.name}
                </strong>

                <small>
                  Ameaça:
                  ${region.enemyStrength}
                </small>

                <div class="troop-controller">
                  <button
                    type="button"
                    data-action="remove"
                    data-region-id="${
                      region.id
                    }"
                  >
                    −
                  </button>

                  <span
                    id="troops-${
                      region.id
                    }"
                  >
                    ${troops[region.id]}
                  </span>

                  <button
                    type="button"
                    data-action="add"
                    data-region-id="${
                      region.id
                    }"
                  >
                    +
                  </button>
                </div>
              </article>
            `
          ).join("")}
        </div>

        <button
          type="button"
          class="primary-button"
          id="start-war"
          ${
            remainingTroops > 0
              ? "disabled"
              : ""
          }
        >
          Iniciar defesa
        </button>
      </section>
    `;

    document
      .querySelectorAll(
        ".troop-controller button"
      )
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            const regionId =
              button.dataset.regionId;

            const action =
              button.dataset.action;

            if (
              action === "add" &&
              remainingTroops > 0
            ) {
              troops[regionId] += 1;
              remainingTroops -= 1;
            }

            if (
              action === "remove" &&
              troops[regionId] > 1
            ) {
              troops[regionId] -= 1;
              remainingTroops += 1;
            }

            renderDeployment();
          }
        );
      });

    document
      .querySelector("#start-war")
      .addEventListener(
        "click",
        () => {
          if (remainingTroops > 0) {
            return;
          }

          battleRegions =
            shuffle(REGIONS).slice(0, 3);

          battleIndex = 0;

          renderBattle();
        }
      );
  }

  function renderBattle() {
    const region =
      battleRegions[battleIndex];

    app.innerHTML = `
      <section class="screen war-battle-screen">
        <header class="war-battle-header">
          <div>
            <p class="eyebrow">
              Batalha
              ${battleIndex + 1}
              de 3
            </p>

            <h1>
              ${region.icon}
              ${region.name}
            </h1>
          </div>

          <div class="battle-troops">
            <small>Suas tropas</small>

            <strong>
              ${troops[region.id]}
            </strong>
          </div>
        </header>

        <div class="battle-progress">
          ${[0, 1, 2]
            .map(
              (index) => `
                <span
                  class="${
                    index < battleIndex
                      ? battleResults[index]
                          .won
                        ? "won"
                        : "lost"
                      : index ===
                          battleIndex
                        ? "current"
                        : ""
                  }"
                ></span>
              `
            )
            .join("")}
        </div>

        <div class="battlefield">
          <div class="battle-army">
            <span>
              ${selectedAlliance.icon}
            </span>

            <strong>Brasil</strong>

            <small>
              ${troops[region.id]}
              tropas
            </small>
          </div>

          <div class="battle-versus">
            VS
          </div>

          <div class="battle-army enemy">
            <span>💀</span>

            <strong>Invasores</strong>

            <small>
              Força estimada:
              ${region.enemyStrength}
            </small>
          </div>
        </div>

        <div class="war-strategies">
          ${Object.values(STRATEGIES)
            .map(
              (strategy) => `
                <button
                  type="button"
                  class="war-strategy"
                  data-strategy-id="${
                    strategy.id
                  }"
                >
                  <span>
                    ${strategy.icon}
                  </span>

                  <strong>
                    ${strategy.name}
                  </strong>
                </button>
              `
            )
            .join("")}
        </div>
      </section>
    `;

    document
      .querySelectorAll(
        ".war-strategy"
      )
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            resolveBattle(
              region,
              button.dataset
                .strategyId
            );
          }
        );
      });
  }

  function calculateStrategyBonus(
    strategyId
  ) {
    const economy =
      gameState.indicators
        ?.economy ?? 50;

    const stability =
      gameState.indicators
        ?.stability ?? 50;

    const corruption =
      gameState.corruption ?? 0;

    if (strategyId === "attack") {
      return (
        1 +
        economy / 20
      );
    }

    if (strategyId === "defend") {
      return (
        2 +
        stability / 18
      );
    }

    if (strategyId === "sabotage") {
      return (
        randomBetween(0, 7) +
        corruption / 30
      );
    }

    return 0;
  }

  function calculateAllianceBonus() {
    const economy =
      gameState.indicators
        ?.economy ?? 50;

    const stability =
      gameState.indicators
        ?.stability ?? 50;

    const people =
      gameState.indicators
        ?.people ?? 50;

    if (
      selectedAlliance.id ===
      "atlantic"
    ) {
      return economy >= 50 ? 2 : 0;
    }

    if (
      selectedAlliance.id ===
      "brics"
    ) {
      return stability >= 50 ? 2 : 0;
    }

    return people >= 60 ? 1 : -1;
  }

  function resolveBattle(
    region,
    strategyId
  ) {
    document
      .querySelectorAll(
        ".war-strategy"
      )
      .forEach((button) => {
        button.disabled = true;
      });

    const strategy =
      STRATEGIES[strategyId];

    const playerRoll =
      randomBetween(1, 6);

    const enemyRoll =
      randomBetween(1, 6);

    const strategyBonus =
      calculateStrategyBonus(
        strategyId
      );

    const allianceBonus =
      calculateAllianceBonus();

    const stability =
      gameState.indicators
        ?.stability ?? 50;

    const instabilityBonus =
      Math.max(
        0,
        (50 - stability) / 20
      );

    const playerPower =
      troops[region.id] +
      playerRoll +
      strategyBonus +
      allianceBonus;

    const enemyPower =
      region.enemyStrength +
      enemyRoll +
      instabilityBonus;

    const won =
      playerPower >= enemyPower;

    battleResults.push({
      regionId: region.id,
      regionName: region.name,
      strategy: strategyId,
      playerPower:
        Math.round(playerPower),
      enemyPower:
        Math.round(enemyPower),
      won
    });

    app.innerHTML = `
      <section class="screen battle-result-screen">
        <div
          class="battle-result-icon ${
            won ? "won" : "lost"
          }"
        >
          ${won ? "🏆" : "💥"}
        </div>

        <p class="eyebrow">
          ${region.name}
        </p>

        <h1>
          ${
            won
              ? "Território defendido"
              : "Linha de defesa rompida"
          }
        </h1>

        <div class="battle-score">
          <div>
            <small>Brasil</small>
            <strong>
              ${Math.round(playerPower)}
            </strong>
          </div>

          <span>×</span>

          <div>
            <small>Invasores</small>
            <strong>
              ${Math.round(enemyPower)}
            </strong>
          </div>
        </div>

        <p>
          Estratégia utilizada:
          ${strategy.icon}
          ${strategy.name}
        </p>

        <button
          type="button"
          class="primary-button"
          id="next-battle"
        >
          ${
            battleIndex < 2
              ? "Próxima batalha"
              : "Ver resultado da guerra"
          }
        </button>
      </section>
    `;

    document
      .querySelector(
        "#next-battle"
      )
      .addEventListener(
        "click",
        () => {
          battleIndex += 1;

          if (
            battleIndex <
            battleRegions.length
          ) {
            renderBattle();
            return;
          }

          showWarResult();
        }
      );
  }

  function showWarResult() {
    const victories =
      battleResults.filter(
        (result) => result.won
      ).length;

    const stability =
      gameState.indicators
        ?.stability ?? 50;

    const occupied =
      victories === 0 ||
      (
        victories === 1 &&
        stability < 35
      );

    const effects =
      createEmptyEffects();

    mergeEffects(
      effects,
      selectedAlliance.effects
    );

    let title;
    let description;
    let icon;
    let resultClass;

    if (victories === 3) {
      title =
        "Vitória esmagadora";

      description =
        "As três ofensivas foram derrotadas. O governante já procura espaço para construir uma estátua de si mesmo.";

      icon = "🏆";
      resultClass = "great-victory";

      mergeEffects(effects, {
        indicators: {
          people: 12,
          congress: 6,
          economy: -5,
          stability: 15
        },

        factions: {
          military: 14,
          press: 5
        },

        politics: {
          personalism: 6
        }
      });
    } else if (victories === 2) {
      title =
        "Vitória estratégica";

      description =
        "O Brasil perdeu uma frente, mas conseguiu preservar o território e declarar vitória antes que alguém fizesse as contas.";

      icon = "🎖️";
      resultClass = "victory";

      mergeEffects(effects, {
        indicators: {
          people: 6,
          economy: -7,
          stability: 7
        },

        factions: {
          military: 8
        },

        politics: {
          personalism: 3
        }
      });
    } else if (!occupied) {
      title =
        "Derrota militar";

      description =
        "As tropas recuaram e o governo assinou um acordo constrangedor para evitar a ocupação completa.";

      icon = "🏳️";
      resultClass = "defeat";

      mergeEffects(effects, {
        indicators: {
          people: -12,
          congress: -7,
          economy: -14,
          stability: -18
        },

        factions: {
          military: -8,
          press: -6
        }
      });
    } else {
      title =
        "O país foi ocupado";

      description =
        "As linhas de defesa desmoronaram. Os invasores assumiram prédios públicos e encerraram o governo.";

      icon = "☠️";
      resultClass = "occupation";

      mergeEffects(effects, {
        indicators: {
          people: -25,
          congress: -30,
          economy: -30,
          stability: -100
        },

        factions: {
          military: -25,
          press: -10
        },

        politics: {
          authoritarianism: 10
        }
      });
    }

    app.innerHTML = `
      <section class="screen war-result-screen">
        <div
          class="war-final-icon ${
            resultClass
          }"
        >
          ${icon}
        </div>

        <p class="eyebrow">
          Fim do conflito
        </p>

        <h1>${title}</h1>

        <div class="war-victory-counter">
          ${battleResults
            .map(
              (result) => `
                <span
                  class="${
                    result.won
                      ? "won"
                      : "lost"
                  }"
                >
                  ${
                    result.won
                      ? "✓"
                      : "✕"
                  }
                </span>
              `
            )
            .join("")}
        </div>

        <strong>
          ${victories} de 3 territórios
          defendidos
        </strong>

        <p class="war-result-description">
          ${description}
        </p>

        <div class="selected-alliance">
          <span>
            ${selectedAlliance.icon}
          </span>

          <div>
            <small>Bloco escolhido</small>

            <strong>
              ${selectedAlliance.name}
            </strong>
          </div>
        </div>

        <button
          type="button"
          class="primary-button"
          id="finish-war"
        >
          ${
            occupied
              ? "Reconhecer a derrota"
              : "Continuar governo"
          }
        </button>
      </section>
    `;

    document
      .querySelector("#finish-war")
      .addEventListener(
        "click",
        () => {
          onComplete({
            id:
              `war-${resultClass}`,

            text:
              selectedAlliance.name,

            resultText:
              description,

            effects,

            metadata: {
              war: {
                alliance:
                  selectedAlliance.id,

                victories,
                occupied,

                battles:
                  battleResults
              }
            }
          });
        }
      );
  }
}