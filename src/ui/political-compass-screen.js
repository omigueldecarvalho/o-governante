function createInitialCompassState() {
  return {
    economicPosition: 0,
    socialPosition: 0,
    authoritarianism: 0,
    popularParticipation: 0,
    personalism: 0
  };
}

function applyAnswerEffects(
  state,
  effects = {}
) {
  Object.entries(effects).forEach(
    ([key, value]) => {
      state[key] =
        Number(state[key] ?? 0) +
        Number(value ?? 0);
    }
  );
}

export function renderPoliticalCompassScreen({
  questions = [],
  onComplete,
  onCancel
}) {
  const app =
    document.querySelector("#app");

  if (!app) {
    console.error(
      "Elemento #app não encontrado."
    );

    return;
  }

  if (
    !Array.isArray(questions) ||
    questions.length === 0
  ) {
    console.error(
      "Nenhuma pergunta da bússola foi recebida."
    );

    app.innerHTML = `
      <section class="screen">
        <h1>Bússola indisponível</h1>

        <p>
          Nenhuma pergunta foi encontrada.
        </p>

        <button
          type="button"
          class="secondary-button"
          id="cancel-political-compass"
        >
          Voltar ao início
        </button>
      </section>
    `;

    document
      .querySelector(
        "#cancel-political-compass"
      )
      ?.addEventListener(
        "click",
        onCancel
      );

    return;
  }

  let currentQuestionIndex = 0;

  const answers = [];

  const compassState =
    createInitialCompassState();

  function finishCompass() {
    if (
      typeof onComplete !==
      "function"
    ) {
      console.error(
        "onComplete da bússola não foi informado."
      );

      return;
    }

    onComplete({
      answers:
        structuredClone(answers),

      state:
        structuredClone(
          compassState
        )
    });
  }

  function selectAnswer(
    question,
    answer
  ) {
    applyAnswerEffects(
      compassState,
      answer.effects
    );

    answers.push({
      questionId:
        question.id,

      answerId:
        answer.id,

      questionTitle:
        question.title,

      answerText:
        answer.text,

      effects:
        structuredClone(
          answer.effects ?? {}
        )
    });

    currentQuestionIndex += 1;

    if (
      currentQuestionIndex >=
      questions.length
    ) {
      finishCompass();
      return;
    }

    renderQuestion();
  }

  function renderQuestion() {
    const question =
      questions[
        currentQuestionIndex
      ];

    const currentNumber =
      currentQuestionIndex + 1;

    const progress =
      Math.round(
        (
          currentQuestionIndex /
          questions.length
        ) * 100
      );

    const answersHTML =
      question.answers
        .map(
          (answer, index) => `
            <button
              type="button"
              class="compass-answer-button"
              data-answer-index="${index}"
            >
              <span class="compass-answer-letter">
                ${String.fromCharCode(
                  65 + index
                )}
              </span>

              <span>
                ${answer.text}
              </span>
            </button>
          `
        )
        .join("");

    app.innerHTML = `
      <section
        class="screen political-compass-screen"
      >
        <header class="compass-header">
          <button
            type="button"
            class="back-button"
            id="cancel-political-compass"
          >
            ← Voltar
          </button>

          <div class="compass-heading">
            <span class="compass-icon">
              🧭
            </span>

            <div>
              <p class="eyebrow">
                Bússola do Governante
              </p>

              <h1>
                Descubra sua orientação
              </h1>
            </div>
          </div>

          <div class="compass-progress-information">
            <span>
              Pergunta ${currentNumber}
              de ${questions.length}
            </span>

            <strong>
              ${progress}%
            </strong>
          </div>

          <div class="compass-progress-bar">
            <div
              style="width: ${progress}%"
            ></div>
          </div>
        </header>

        <article class="compass-question-card">
          <span class="compass-question-number">
            ${currentNumber}
          </span>

          <h2>
            ${question.title}
          </h2>

          <p>
            ${
              question.description ??
              ""
            }
          </p>
        </article>

        <div class="compass-answers">
          ${answersHTML}
        </div>

        <p class="compass-privacy">
          🔒 Suas respostas ficam somente
          neste dispositivo.
        </p>
      </section>
    `;

    const answerButtons =
      document.querySelectorAll(
        "[data-answer-index]"
      );

    answerButtons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            const answerIndex =
              Number(
                button.dataset
                  .answerIndex
              );

            const answer =
              question.answers[
                answerIndex
              ];

            if (!answer) {
              return;
            }

            answerButtons.forEach(
              (answerButton) => {
                answerButton.disabled =
                  true;
              }
            );

            selectAnswer(
              question,
              answer
            );
          }
        );
      }
    );

    document
      .querySelector(
        "#cancel-political-compass"
      )
      ?.addEventListener(
        "click",
        () => {
          if (
            typeof onCancel ===
            "function"
          ) {
            onCancel();
          }
        }
      );
  }

  renderQuestion();
}