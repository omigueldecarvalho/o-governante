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

function mergeObjectEffects(
  accumulated,
  newEffects = {}
) {
  Object.entries(newEffects).forEach(
    ([key, value]) => {
      accumulated[key] =
        (accumulated[key] ?? 0) + value;
    }
  );
}

function mergeEffects(
  accumulated,
  newEffects = {}
) {
  mergeObjectEffects(
    accumulated.indicators,
    newEffects.indicators
  );

  mergeObjectEffects(
    accumulated.politics,
    newEffects.politics
  );

  mergeObjectEffects(
    accumulated.factions,
    newEffects.factions
  );

  mergeObjectEffects(
    accumulated.country,
    newEffects.country
  );

  accumulated.corruption +=
    newEffects.corruption ?? 0;

  accumulated.personalWealth +=
    newEffects.personalWealth ?? 0;
}

export function renderPressConference({
  gameState,
  decision,
  onComplete
}) {
  const app = document.querySelector("#app");

  let currentQuestionIndex = 0;
  let accumulatedEffects = createEmptyEffects();
  let selectedAnswers = [];
  let reactions = [];

  function showQuestion() {
    const question =
      decision.questions[currentQuestionIndex];

    const answersHTML = question.answers
      .map(
        (answer) => `
          <button
            type="button"
            class="press-answer"
            data-answer-id="${answer.id}"
          >
            ${answer.text}
          </button>
        `
      )
      .join("");

    app.innerHTML = `
      <section class="screen press-screen">
        <header class="press-header">
          <div>
            <p class="eyebrow">
              Coletiva de imprensa
            </p>

            <h1>${decision.title}</h1>
          </div>

          <span class="question-counter">
            ${currentQuestionIndex + 1}
            de
            ${decision.questions.length}
          </span>
        </header>

        <div class="press-room">
          <div class="press-cameras">
            📸 🎥 🎙️
          </div>

          <article class="journalist-question">
            <div class="journalist-avatar">
              🧑‍💼
            </div>

            <div>
              <strong>
                ${question.journalist}
              </strong>

              <small>
                ${question.outlet}
              </small>

              <p>${question.text}</p>
            </div>
          </article>
        </div>

        <div class="press-answers">
          ${answersHTML}
        </div>
      </section>
    `;

    document
      .querySelectorAll(".press-answer")
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            answerQuestion(
              question,
              button.dataset.answerId
            );
          }
        );
      });
  }

  function answerQuestion(
    question,
    answerId
  ) {
    const answer = question.answers.find(
      (item) => item.id === answerId
    );

    if (!answer) {
      return;
    }

    mergeEffects(
      accumulatedEffects,
      answer.effects
    );

    selectedAnswers.push({
      questionId: question.id,
      answerId: answer.id,
      answerText: answer.text
    });

    reactions.push(answer.reaction);

    showReaction(answer);
  }

  function showReaction(answer) {
    app.innerHTML = `
      <section class="screen press-screen">
        <div class="press-reaction-icon">
          📰
        </div>

        <p class="eyebrow">
          Repercussão
        </p>

        <h1>Sua resposta repercutiu</h1>

        <article class="press-reaction">
          <strong>
            “${answer.text}”
          </strong>

          <p>
            ${answer.reaction}
          </p>
        </article>

        <button
          type="button"
          class="primary-button"
          id="next-question"
        >
          ${
            currentQuestionIndex <
            decision.questions.length - 1
              ? "Próxima pergunta"
              : "Encerrar coletiva"
          }
        </button>
      </section>
    `;

    document
      .querySelector("#next-question")
      .addEventListener("click", () => {
        currentQuestionIndex += 1;

        if (
          currentQuestionIndex >=
          decision.questions.length
        ) {
          finishConference();
          return;
        }

        showQuestion();
      });
  }

  function finishConference() {
    onComplete({
      id: "press-conference-result",

      text:
        "Responder à coletiva de imprensa",

      resultText:
        reactions.join(" "),

      effects: accumulatedEffects,

      pressConference: {
        answers: selectedAnswers
      }
    });
  }

  showQuestion();
}