const TACTICS = {
  proposal: {
    icon: "📋",
    name: "Proposta"
  },

  attack: {
    icon: "🥊",
    name: "Ataque"
  },

  meme: {
    icon: "🤡",
    name: "Meme"
  }
};

const WIN_AGAINST = {
  proposal: "attack",
  attack: "meme",
  meme: "proposal"
};

function clamp(value, minimum, maximum) {
  return Math.max(
    minimum,
    Math.min(maximum, value)
  );
}

function randomBetween(minimum, maximum) {
  return Math.floor(
    Math.random() *
      (maximum - minimum + 1)
  ) + minimum;
}

function numberOrZero(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function getRivalElectionData(
  gameState,
  electionType
) {
  /*
   * A primeira eleição continua
   * utilizando o adversário comum.
   */
  if (electionType === "initial") {
    return {
      rival: null,
      popularity: 50,
      scandals: 0,
      pressure: 0,
      scandalBonus: 0,
      totalImpact: 0
    };
  }

  const rival =
    gameState.government
      ?.politicalRival;

  if (!rival) {
    return {
      rival: null,
      popularity: 50,
      scandals: 0,
      pressure: 0,
      scandalBonus: 0,
      totalImpact: 0
    };
  }

  const popularity =
    numberOrZero(
      rival.popularity
    );

  const scandals =
    numberOrZero(
      rival.scandals
    );

  /*
   * Rival com 70%:
   * pressão de 5 pontos.
   *
   * Rival com 30%:
   * pressão de -5, dando vantagem
   * ao jogador.
   */
  const pressure =
    (popularity - 50) *
    0.25;

  /*
   * Cada escândalo descoberto contra
   * o rival dá 2 pontos ao jogador.
   */
  const scandalBonus =
    scandals * 2;

  return {
    rival,
    popularity,
    scandals,
    pressure,
    scandalBonus,

    /*
     * Valor final aplicado ao jogador.
     *
     * Positivo = vantagem.
     * Negativo = desvantagem.
     */
    totalImpact:
      scandalBonus - pressure
  };
}

function escapeHTML(value) {
  const element =
    document.createElement("div");

  element.textContent = String(value ?? "");

  return element.innerHTML;
}

function calculatePoll(
  gameState,
  electionType,
  campaignBonus = 0
) {
  const indicators =
    gameState.indicators;

  if (electionType === "initial") {
    return clamp(
      Math.round(
        54 +
        campaignBonus +
        (indicators.people - 50) *
          0.35 +
        (indicators.stability - 50) *
          0.15 +
        randomBetween(-2, 4)
      ),
      35,
      75
    );
  }

  const rivalData =
    getRivalElectionData(
      gameState,
      electionType
    );

  console.log(
    "Impacto eleitoral do rival:",
    rivalData
  );

  return clamp(
    Math.round(
      50 +
      campaignBonus +

      (indicators.people - 50) *
        0.35 +

      (indicators.economy - 50) *
        0.2 +

      (indicators.stability - 50) *
        0.2 -

      gameState.corruption *
        0.15 +

      /*
       * Popularidade e escândalos
       * do adversário recorrente.
       */
      rivalData.totalImpact +

      randomBetween(-4, 4)
    ),
    15,
    85
  );
}

export function renderElectionFlow({
  gameState,
  electionType,
  campaignBonus = 0,
  onComplete
}) {
  const app = document.querySelector("#app");

  const playerName = escapeHTML(
    gameState.player.name
  );

  const playerNumber =
    gameState.player.candidateNumber;

 const politicalRival =
  electionType === "initial"
    ? null
    : gameState.government
        ?.politicalRival;

const opponent = {
  id:
    politicalRival?.id ??
    "nestor-conserva",

  name:
    escapeHTML(
      politicalRival?.name ??
      "Nestor Conserva"
    ),

  nickname:
    escapeHTML(
      politicalRival?.nickname ??
      "O Candidato Genérico"
    ),

  icon:
    politicalRival?.icon ??
    "😠",

  ideology:
    escapeHTML(
      politicalRival?.ideology ??
      "Conservadorismo"
    ),

  popularity:
    numberOrZero(
      politicalRival?.popularity ??
      50
    ),

  scandals:
    numberOrZero(
      politicalRival?.scandals
    ),

  number:
    playerNumber === "38"
      ? "17"
      : "38"
};

const rivalElectionData =
  getRivalElectionData(
    gameState,
    electionType
  );

  const pollPercentage =
  calculatePoll(
    gameState,
    electionType,
    campaignBonus
  );

  let debateRound = 0;
  let debateScore = 0;
  let playerVote = "blank";

  function showPoll() {
    app.innerHTML = `
      <section class="screen election-screen">
        <div class="datapapel-logo">
          DATA<span>PAPEL</span>
        </div>

        <p class="eyebrow">
          Pesquisa eleitoral
        </p>

        <h1>Quem venceria hoje?</h1>

        <div class="poll-candidates">
          ${createPollCandidate(
            playerName,
            playerNumber,
            pollPercentage,
            true
          )}

          ${
  electionType !== "initial" &&
  politicalRival
    ? `
      <article class="election-rival-info">
        <span>
          ${opponent.icon}
        </span>

        <div>
          <small>
            Seu adversário recorrente
          </small>

          <strong>
            ${opponent.name},
            ${opponent.nickname}
          </strong>

          <p>
            Popularidade própria:
            ${opponent.popularity}%

            · Escândalos descobertos:
            ${opponent.scandals}
          </p>
        </div>
      </article>
    `
    : ""
}

          ${createPollCandidate(
            opponent.name,
            opponent.number,
            100 - pollPercentage,
            false
          )}
        </div>

        <p class="poll-disclaimer">
          Margem de erro: o suficiente para
          justificar qualquer resultado.
        </p>

        <button
          type="button"
          class="primary-button"
          id="go-to-debate"
        >
          Ir para o debate
        </button>
      </section>
    `;

    document
      .querySelector("#go-to-debate")
      ?.addEventListener(
        "click",
        showDebate
      );
  }

  function createPollCandidate(
    name,
    number,
    percentage,
    player
  ) {
    return `
      <article class="poll-candidate ${
        player ? "player" : ""
      }">
        <div>
          <strong>${name}</strong>
          <span>${number}</span>
        </div>

        <div class="poll-bar">
          <div
            style="width: ${percentage}%"
          ></div>
        </div>

        <strong class="poll-percentage">
          ${percentage}%
        </strong>
      </article>
    `;
  }

  function showDebate() {
    if (debateRound >= 3) {
      showVotingMachine();
      return;
    }

    app.innerHTML = `
      <section class="screen debate-screen">
        <header class="debate-header">
          <div>
            <p class="eyebrow">
              Debate nacional
            </p>

            <h1>Vale tudo por um voto</h1>
          </div>

          <strong>
            ${debateRound + 1}/3
          </strong>
        </header>

        <div class="debate-stage">
          <div>
            <span>🎤</span>
            <strong>${playerName}</strong>
          </div>

          <span class="versus">VS</span>

         <div>
  <span>${opponent.icon}</span>

  <strong>
    ${opponent.name}
  </strong>

  ${
    electionType !== "initial"
      ? `
        <small>
          ${opponent.nickname}
        </small>
      `
      : ""
  }
</div>

        <p class="debate-question">
          Escolha sua estratégia:
        </p>

        <div class="debate-tactics">
          ${Object.entries(TACTICS)
            .map(
              ([id, tactic]) => `
                <button
                  type="button"
                  class="debate-tactic"
                  data-tactic="${id}"
                >
                  <span>${tactic.icon}</span>
                  <strong>${tactic.name}</strong>
                </button>
              `
            )
            .join("")}
        </div>
      </section>
    `;

    document
      .querySelectorAll(".debate-tactic")
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            resolveDebateRound(
              button.dataset.tactic
            );
          }
        );
      });
  }

  function resolveDebateRound(playerTactic) {
    const tacticIds =
      Object.keys(TACTICS);

    const opponentTactic =
      tacticIds[
        randomBetween(
          0,
          tacticIds.length - 1
        )
      ];

    let result;
    let reaction;

    if (playerTactic === opponentTactic) {
      result = "draw";
      reaction =
        "Os dois fizeram a mesma coisa. Ninguém entendeu nada.";
    } else if (
      WIN_AGAINST[playerTactic] ===
      opponentTactic
    ) {
      result = "win";
      debateScore += 1;
      reaction =
        "Você venceu a rodada e ainda virou corte nas redes sociais.";
    } else {
      result = "loss";
      debateScore -= 1;
      reaction =
        "Seu adversário venceu a rodada. Sua assessoria desligou a televisão.";
    }

    const reactions = {
      win: "🔥",
      draw: "😐",
      loss: "💀"
    };

    app.innerHTML = `
      <section class="screen debate-result-screen">
        <div class="debate-result-icon">
          ${reactions[result]}
        </div>

        <div class="tactic-comparison">
          <div>
            <span>
              ${TACTICS[playerTactic].icon}
            </span>

            <strong>
              ${TACTICS[playerTactic].name}
            </strong>
          </div>

          <span>contra</span>

          <div>
            <span>
              ${TACTICS[opponentTactic].icon}
            </span>

            <strong>
              ${TACTICS[opponentTactic].name}
            </strong>
          </div>
        </div>

        <p>${reaction}</p>

        <button
          type="button"
          class="primary-button"
          id="next-debate-round"
        >
          ${
            debateRound < 2
              ? "Próxima baixaria"
              : "Ir para a votação"
          }
        </button>
      </section>
    `;

    document
      .querySelector(
        "#next-debate-round"
      )
      ?.addEventListener("click", () => {
        debateRound += 1;
        showDebate();
      });
  }

  function showVotingMachine() {
    let typedNumber = "";

    app.innerHTML = `
      <section class="screen voting-screen">
        <p class="eyebrow">
          Dia da eleição
        </p>

        <h1>Urna eletrônica</h1>

        <div class="voting-machine">
          <div class="voting-display">
            <small>Seu voto para presidente</small>

            <div
              class="typed-number"
              id="typed-number"
            >
              _ _
            </div>

            <div
              class="voting-candidate"
              id="voting-candidate"
            >
              Digite dois números
            </div>
          </div>

          <div class="voting-keyboard">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9]
              .map(
                (number) => `
                  <button
                    type="button"
                    class="number-key"
                    data-number="${number}"
                  >
                    ${number}
                  </button>
                `
              )
              .join("")}

            <span></span>

            <button
              type="button"
              class="number-key"
              data-number="0"
            >
              0
            </button>
          </div>

          <div class="voting-actions">
            <button
              type="button"
              class="vote-white"
              id="vote-white"
            >
              BRANCO
            </button>

            <button
              type="button"
              class="vote-correct"
              id="vote-correct"
            >
              CORRIGE
            </button>

            <button
              type="button"
              class="vote-confirm"
              id="vote-confirm"
              disabled
            >
              CONFIRMA
            </button>
          </div>
        </div>

        <div class="candidate-numbers">
          <span>
            Você: ${playerNumber}
          </span>

          <span>
            ${opponent.name}: ${opponent.number}
          </span>
        </div>
      </section>
    `;

    const typedElement =
      document.querySelector(
        "#typed-number"
      );

    const candidateElement =
      document.querySelector(
        "#voting-candidate"
      );

    const confirmButton =
      document.querySelector(
        "#vote-confirm"
      );

    function updateDisplay() {
      typedElement.textContent =
        `${typedNumber[0] ?? "_"} ${
          typedNumber[1] ?? "_"
        }`;

      if (typedNumber === playerNumber) {
        candidateElement.textContent =
          playerName;

        playerVote = "player";
      } else if (
        typedNumber === opponent.number
      ) {
        candidateElement.textContent =
          opponent.name;

        playerVote = "opponent";
      } else if (typedNumber.length === 2) {
        candidateElement.textContent =
          "VOTO NULO";

        playerVote = "null";
      } else {
        candidateElement.textContent =
          "Digite dois números";

        playerVote = "blank";
      }

      confirmButton.disabled =
        typedNumber.length !== 2;
    }

    document
      .querySelectorAll(".number-key")
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            if (typedNumber.length >= 2) {
              return;
            }

            typedNumber +=
              button.dataset.number;

            updateDisplay();
          }
        );
      });

    document
      .querySelector("#vote-correct")
      ?.addEventListener("click", () => {
        typedNumber = "";
        updateDisplay();
      });

    document
      .querySelector("#vote-white")
      ?.addEventListener("click", () => {
        playerVote = "blank";
        showCounting();
      });

    confirmButton.addEventListener(
      "click",
      showCounting
    );
  }

  function showCounting() {
    const debateBonus = debateScore * 3;

    const voteBonus =
  playerVote === "player"
    ? 2
    : playerVote === "opponent"
      ? -2
      : 0;

    const initialElectionBonus =
  electionType === "initial"
    ? 2
    : 0;

const randomVariation =
  electionType === "initial"
    ? randomBetween(-2, 4)
    : randomBetween(-4, 4);

const finalPercentage = clamp(
  pollPercentage +
    debateBonus +
    voteBonus +
    initialElectionBonus +
    randomVariation,
  10,
  90
);

    const playerWon =
      finalPercentage >= 50;

    let progress = 0;

    app.innerHTML = `
      <section class="screen counting-screen">
        <p class="eyebrow">
          Apuração em tempo real
        </p>

        <h1>Urnas apuradas</h1>

        <strong
          class="counting-progress"
          id="counting-progress"
        >
          0%
        </strong>

        <div class="counting-candidates">
          ${createCountingCandidate(
            playerName,
            0,
            "player-count"
          )}

          ${createCountingCandidate(
            opponent.name,
            0,
            "opponent-count"
          )}
        </div>

        <div id="election-final-result"></div>
      </section>
    `;

    const interval = window.setInterval(
      () => {
        progress = Math.min(
          100,
          progress + randomBetween(4, 10)
        );

        const variation =
          (100 - progress) / 20;

        const displayedPlayer = clamp(
          finalPercentage +
            randomBetween(
              -Math.ceil(variation),
              Math.ceil(variation)
            ),
          0,
          100
        );

        document.querySelector(
          "#counting-progress"
        ).textContent = `${progress}%`;

        document.querySelector(
          "#player-count"
        ).textContent =
          `${displayedPlayer.toFixed(1)}%`;

        document.querySelector(
          "#opponent-count"
        ).textContent =
          `${(100 - displayedPlayer).toFixed(1)}%`;

        if (progress >= 100) {
          window.clearInterval(interval);

          showFinalElectionResult(
            finalPercentage,
            playerWon
          );
        }
      },
      180
    );
  }

  function createCountingCandidate(
    name,
    percentage,
    elementId
  ) {
    return `
      <article>
        <strong>${name}</strong>

        <span id="${elementId}">
          ${percentage.toFixed(1)}%
        </span>
      </article>
    `;
  }

  function showFinalElectionResult(
    finalPercentage,
    playerWon
  ) {
    document.querySelector(
      "#player-count"
    ).textContent =
      `${finalPercentage.toFixed(1)}%`;

    document.querySelector(
      "#opponent-count"
    ).textContent =
      `${(100 - finalPercentage).toFixed(1)}%`;

    document.querySelector(
      "#election-final-result"
    ).innerHTML = `
      <article class="election-result ${
        playerWon ? "victory" : "defeat"
      }">
        <span>
          ${playerWon ? "🎉" : "📦"}
        </span>

        <h2>
          ${
            playerWon
              ? "Você venceu!"
              : "Você perdeu!"
          }
        </h2>

        <p>
          ${
            playerWon
              ? "O povo decidiu confiar em você. Isso certamente terminará bem."
              : "Sua equipe já começou a apagar as promessas de campanha do site."
          }
        </p>

        <button
          type="button"
          class="primary-button"
          id="finish-election"
        >
          Ver resultado
        </button>
      </article>
    `;

    document
      .querySelector("#finish-election")
      ?.addEventListener("click", () => {
       onComplete({
  type:
    electionType,

  pollPercentage,
  debateScore,
  playerVote,
  finalPercentage,

  won:
    playerWon,

  opponent: {
    id:
      opponent.id,

    name:
      opponent.name,

    nickname:
      opponent.nickname,

    popularity:
      opponent.popularity,

    scandals:
      opponent.scandals
  },

  rivalImpact:
    electionType === "initial"
      ? null
      : {
          pressure:
            rivalElectionData
              .pressure,

          scandalBonus:
            rivalElectionData
              .scandalBonus,

          total:
            rivalElectionData
              .totalImpact
        }
});
      });
  }

  showPoll();
}