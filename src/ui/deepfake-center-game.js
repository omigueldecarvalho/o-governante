import {
  DEEPFAKE_CARDS,
  DEEPFAKE_ANSWERS
} from "../data/deepfake-cards.js";

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isPublishableCard(card) {
  return Boolean(
    card?.id &&
    card?.statement &&
    card?.answer &&
    card?.explanation &&
    card?.verifiedAt &&
    Array.isArray(card?.sources) &&
    card.sources.length > 0 &&
    card.sources.every(
      (source) =>
        source?.label &&
        source?.url &&
        source?.type
    )
  );
}

function createSourcesHTML(sources = []) {
  if (sources.length === 0) {
    return `
      <p class="source-warning">
        Este conteúdo não possui fontes
        suficientes.
      </p>
    `;
  }

  return `
    <footer class="fact-check-sources">
      <strong>
        📚 Fontes desta verificação
      </strong>

      <ul>
        ${sources
          .map(
            (source) => `
              <li>
                <a
                  href="${escapeHTML(source.url)}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ${escapeHTML(source.label)}
                </a>

                <small>
                  ${escapeHTML(source.type)}
                </small>
              </li>
            `
          )
          .join("")}
      </ul>
    </footer>
  `;
}

function createFinalChoice(score, total) {
  const percentage =
    total > 0
      ? Math.round(
          (score / total) * 100
        )
      : 0;

  if (percentage >= 80) {
    return {
      id: "deepfake-center-excellent",

      text: "Central eficiente",

      resultText:
        `Você acertou ${score} de ${total} verificações. A central desmontou boatos sem fabricar novas mentiras.`,

      effects: {
        indicators: {
          people: 8,
          congress: -2,
          stability: 5
        },

        country: {
          pressFreedom: 5
        },

        politics: {
          authoritarianism: -3
        },

        corruption: -2,
        personalWealth: 0
      }
    };
  }

  if (percentage >= 50) {
    return {
      id: "deepfake-center-average",

      text: "Central confusa",

      resultText:
        `Você acertou ${score} de ${total} verificações. Alguns boatos foram desmentidos, mas a equipe também publicou classificações precipitadas.`,

      effects: {
        indicators: {
          people: 2,
          congress: -1,
          stability: -1
        },

        country: {
          pressFreedom: 1
        },

        corruption: 0,
        personalWealth: 0
      }
    };
  }

  return {
    id: "deepfake-center-failed",

    text: "A central virou fábrica de boatos",

    resultText:
      `Você acertou somente ${score} de ${total} verificações. A oposição agora chama a central de Ministério da Verdade.`,

    effects: {
      indicators: {
        people: -8,
        congress: -6,
        stability: -5
      },

      country: {
        pressFreedom: -5
      },

      politics: {
        authoritarianism: 5
      },

      corruption: 3,
      personalWealth: 0
    }
  };
}


function shuffleCards(cards) {
  const shuffledCards = [...cards];

  for (
    let index =
      shuffledCards.length - 1;
    index > 0;
    index -= 1
  ) {
    const randomIndex =
      Math.floor(
        Math.random() * (index + 1)
      );

    [
      shuffledCards[index],
      shuffledCards[randomIndex]
    ] = [
      shuffledCards[randomIndex],
      shuffledCards[index]
    ];
  }

  return shuffledCards;
}

export function renderDeepfakeCenterGame({
  gameState,
  decision,
  onComplete
}) {
  const app =
    document.querySelector("#app");

  if (!app) {
    throw new Error(
      "Elemento #app não encontrado."
    );
  }

 const verifiedCards =
  DEEPFAKE_CARDS.filter(
    isPublishableCard
  );

const playableCards =
  shuffleCards(
    verifiedCards
  ).slice(0, 3);

  if (playableCards.length === 0) {
    throw new Error(
      "Nenhum card verificável foi encontrado."
    );
  }

  let currentCardIndex = 0;
  let score = 0;
  let answered = false;

  function renderCurrentCard() {
    const card =
      playableCards[currentCardIndex];

    answered = false;

    app.innerHTML = `
      <section class="screen deepfake-screen">
        <header class="deepfake-header">
          <div>
            <p class="eyebrow">
              Monitoramento nacional
            </p>

            <h1>
              ${escapeHTML(
                decision?.title ??
                  "Central do Deepfake"
              )}
            </h1>
          </div>

          <div class="deepfake-score">
            <small>Acertos</small>

            <strong>
              ${score}/${playableCards.length}
            </strong>
          </div>
        </header>

        <div class="deepfake-progress">
          <div
            style="
              width: ${
                ((currentCardIndex + 1) /
                  playableCards.length) *
                100
              }%
            "
          ></div>
        </div>

        <p class="deepfake-counter">
          Arquivo ${
            currentCardIndex + 1
          } de ${playableCards.length}
        </p>

        <article class="deepfake-card">
          <header>
            <span class="deepfake-avatar">
              📡
            </span>

            <div>
              <strong>
                ${escapeHTML(
                  card.character.name
                )}
              </strong>

              <small>
                Caso baseado em:
                ${escapeHTML(
                  card.character.realName
                )}
              </small>
            </div>
          </header>

          <blockquote>
            “${escapeHTML(card.statement)}”
          </blockquote>

          <p>
            ${escapeHTML(card.context)}
          </p>
        </article>

        <div class="deepfake-answers">
          ${Object.entries(
            DEEPFAKE_ANSWERS
          )
            .map(
              ([answerId, answer]) => `
                <button
                  type="button"
                  class="deepfake-answer"
                  data-answer="${answerId}"
                >
                  <span>
                    ${answer.icon}
                  </span>

                  ${escapeHTML(
                    answer.label
                  )}
                </button>
              `
            )
            .join("")}
        </div>

        <section
          class="deepfake-result"
          id="deepfake-result"
        ></section>

        <div
          id="deepfake-sources"
        ></div>

        <button
          type="button"
          class="primary-button"
          id="next-deepfake-card"
          hidden
        >
          ${
            currentCardIndex ===
            playableCards.length - 1
              ? "Finalizar relatório"
              : "Próximo arquivo"
          }
        </button>
      </section>
    `;

    const answerButtons =
      document.querySelectorAll(
        ".deepfake-answer"
      );

    const resultElement =
      document.querySelector(
        "#deepfake-result"
      );

    const sourcesElement =
      document.querySelector(
        "#deepfake-sources"
      );

    const nextButton =
      document.querySelector(
        "#next-deepfake-card"
      );

    answerButtons.forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          if (answered) {
            return;
          }

          answered = true;

          const selectedAnswer =
            button.dataset.answer;

          const isCorrect =
            selectedAnswer ===
            card.answer;

          if (isCorrect) {
            score += 1;
          }

          answerButtons.forEach(
            (answerButton) => {
              answerButton.disabled = true;

              if (
                answerButton.dataset
                  .answer === card.answer
              ) {
                answerButton.classList.add(
                  "correct"
                );
              }
            }
          );

          if (!isCorrect) {
            button.classList.add(
              "incorrect"
            );
          }

          const correctAnswer =
            DEEPFAKE_ANSWERS[
              card.answer
            ];

          resultElement.innerHTML = `
            <article class="
              fact-check-result
              ${
                isCorrect
                  ? "success"
                  : "failure"
              }
            ">
              <h2>
                ${
                  isCorrect
                    ? "✅ Verificação correta"
                    : "❌ Classificação incorreta"
                }
              </h2>

              <p>
                <strong>
                  Veredito:
                  ${correctAnswer.icon}
                  ${escapeHTML(
                    correctAnswer.label
                  )}
                </strong>
              </p>

              <p>
                ${escapeHTML(
                  card.explanation
                )}
              </p>

              <small>
                Verificado em:
                ${escapeHTML(
                  card.verifiedAt
                )}
              </small>
            </article>
          `;

          sourcesElement.innerHTML =
            createSourcesHTML(
              card.sources
            );

          nextButton.hidden = false;
        }
      );
    });

    nextButton.addEventListener(
      "click",
      () => {
        if (!answered) {
          return;
        }

        const isLastCard =
          currentCardIndex >=
          playableCards.length - 1;

        if (isLastCard) {
          const finalChoice =
            createFinalChoice(
              score,
              playableCards.length
            );

          onComplete(finalChoice);
          return;
        }

        currentCardIndex += 1;
        renderCurrentCard();
      }
    );
  }

  renderCurrentCard();
}