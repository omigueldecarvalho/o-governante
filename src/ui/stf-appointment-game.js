const QUESTION_TIME = 15000;
const ADVISOR_COST = 100000;

const QUESTION_BANK = {
  easy: [
    {
      question:
        "Quantos ministros compõem o STF?",

      answers: [
        "9 ministros",
        "11 ministros",
        "15 ministros",
        "81 ministros"
      ],

      correctAnswer: 1,

      explanation:
        "O STF é composto por onze ministros."
    },

    {
      question:
        "Quem indica um ministro do STF?",

      answers: [
        "O Presidente da República",
        "A Câmara dos Deputados",
        "O próprio STF",
        "O Conselho Federal da OAB"
      ],

      correctAnswer: 0,

      explanation:
        "O Presidente indica. A escolha precisa ser aprovada pela maioria absoluta do Senado."
    },

    {
      question:
        "Qual é a faixa etária constitucional para ser ministro do STF?",

      answers: [
        "Mais de 21 e menos de 60 anos",
        "Mais de 30 e menos de 75 anos",
        "Mais de 35 e menos de 70 anos",
        "Mais de 40 e menos de 65 anos"
      ],

      correctAnswer: 2,

      explanation:
        "A Constituição exige mais de 35 e menos de 70 anos."
    }
  ],

  medium: [
    {
      question:
        "Qual destas autoridades NÃO pode propor uma ADI diretamente no STF?",

      answers: [
        "Presidente da República",
        "Procurador-Geral da República",
        "Prefeito municipal",
        "Conselho Federal da OAB"
      ],

      correctAnswer: 2,

      explanation:
        "Prefeitos não estão no rol de legitimados do artigo 103 da Constituição."
    },

    {
      question:
        "Qual quórum permite ao STF aprovar uma súmula vinculante?",

      answers: [
        "Maioria simples",
        "Maioria absoluta",
        "Três quintos",
        "Dois terços dos ministros"
      ],

      correctAnswer: 3,

      explanation:
        "A Constituição exige decisão de dois terços dos membros do STF."
    },

    {
      question:
        "Uma Ação Declaratória de Constitucionalidade no STF pode ter como objeto:",

      answers: [
        "Lei ou ato normativo federal",
        "Somente lei municipal",
        "Qualquer decreto municipal",
        "Sentença de primeira instância"
      ],

      correctAnswer: 0,

      explanation:
        "A ADC pode tratar de lei ou ato normativo federal."
    }
  ],

  hard: [
    {
      question:
        "Qual quórum é necessário para o STF modular os efeitos de uma declaração de inconstitucionalidade?",

      answers: [
        "Maioria simples",
        "Maioria absoluta",
        "Dois terços dos membros",
        "Unanimidade"
      ],

      correctAnswer: 2,

      explanation:
        "A Lei nº 9.868 exige maioria de dois terços para a modulação."
    },

    {
      question:
        "Segundo a Lei da ADPF, quando ela não será admitida?",

      answers: [
        "Quando existir outro meio eficaz de sanar a lesividade",
        "Quando envolver norma federal",
        "Quando for proposta pelo PGR",
        "Quando tratar de preceito fundamental"
      ],

      correctAnswer: 0,

      explanation:
        "A ADPF possui caráter subsidiário e não será admitida se houver outro meio eficaz."
    },

    {
      question:
        "As decisões definitivas de mérito em ADI e ADC produzem, em regra:",

      answers: [
        "Efeito apenas entre as partes",
        "Somente efeito consultivo",
        "Eficácia contra todos e efeito vinculante",
        "Efeito apenas para o Poder Executivo"
      ],

      correctAnswer: 2,

      explanation:
        "Essas decisões possuem eficácia contra todos e efeito vinculante."
    }
  ]
};

const CANDIDATE_IDENTITIES = [
  {
    id: "sandro",
    icon: "👨‍🦲",
    name: "Sandro de Morais",
    nickname: "O Calvo",

    slogan:
      "A Constituição não tem cabelo, mas tem força."
  },

  {
    id: "cama",
    icon: "👩‍⚖️",
    name: "Cama Luciene",
    nickname: "A Sereníssima",

    slogan:
      "Meu voto será técnico. Só não pergunte qual técnica."
  },

  {
    id: "adriano",
    icon: "🙏",
    name: "Adriano Mendonsinha",
    nickname: "Terrivelmente Indicado",

    slogan:
      "Entre a lei e a lealdade, analisarei os autos."
  }
];

const CANDIDATE_PROFILES = [
  {
    profile: "guardian",
    legalKnowledge: 88,
    independence: 85,
    democracy: 87,
    integrity: 82,
    senateSupport: 52,
    loyalty: 24,
    authoritarianism: 22,
    secret: "Pode votar contra o governo sem perder o sono."
  },

  {
    profile: "loyalist",
    legalKnowledge: 67,
    independence: 38,
    democracy: 48,
    integrity: 62,
    senateSupport: 84,
    loyalty: 91,
    authoritarianism: 68,
    secret: "Confunde independência judicial com falta de educação."
  },

  {
    profile: "celebrity",
    legalKnowledge: 74,
    independence: 61,
    democracy: 63,
    integrity: 70,
    senateSupport: 69,
    loyalty: 57,
    authoritarianism: 49,
    secret: "Já possui mais assessores de imprensa do que votos publicados."
  }
];

function randomBetween(
  minimum,
  maximum
) {
  return Math.floor(
    Math.random() *
      (maximum - minimum + 1)
  ) + minimum;
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

function varyAttribute(value) {
  return clamp(
    value + randomBetween(-9, 9),
    10,
    100
  );
}

function createCandidates() {
  const shuffledProfiles =
    shuffle(CANDIDATE_PROFILES);

  return CANDIDATE_IDENTITIES.map(
    (identity, index) => {
      const profile =
        shuffledProfiles[index];

      const candidate = {
        ...identity,
        profile: profile.profile,

        legalKnowledge:
          varyAttribute(
            profile.legalKnowledge
          ),

        independence:
          varyAttribute(
            profile.independence
          ),

        democracy:
          varyAttribute(
            profile.democracy
          ),

        integrity:
          varyAttribute(
            profile.integrity
          ),

        senateSupport:
          varyAttribute(
            profile.senateSupport
          ),

        loyalty:
          varyAttribute(
            profile.loyalty
          ),

        authoritarianism:
          varyAttribute(
            profile.authoritarianism
          ),

        secret: profile.secret
      };

      candidate.quality = Math.round(
        candidate.legalKnowledge * 0.35 +
        candidate.independence * 0.25 +
        candidate.democracy * 0.25 +
        candidate.integrity * 0.15
      );

      return candidate;
    }
  );
}

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

export function renderSTFAppointmentGame({
  gameState,
  decision,
  onComplete
}) {
  const app =
    document.querySelector("#app");

  const difficulties = [
    "easy",
    "medium",
    "hard"
  ];

  const difficultyNames = {
    easy: "Fácil",
    medium: "Média",
    hard: "Difícil"
  };

  const questions =
    difficulties.map(
      (difficulty) => {
        const options =
          QUESTION_BANK[difficulty];

        return {
          ...options[
            randomBetween(
              0,
              options.length - 1
            )
          ],

          difficulty
        };
      }
    );

  const candidates =
    createCandidates();

  let currentQuestionIndex = 0;
  let correctAnswers = 0;
  let selectedCandidate = null;

  let advisorUsed = false;
  let hiddenSearchUsed = false;
  let advisorCost = 0;
  let cheatingCorruption = 0;

  let timerId = null;
  let deadline = 0;
  let answered = false;

  renderIntroduction();

  function renderIntroduction() {
    app.innerHTML = `
      <section class="screen stf-introduction">
        <header>
          <p class="eyebrow">
            Vaga no Supremo
          </p>

          <h1>${decision.title}</h1>

          <p>
            Antes de analisar os indicados,
            prove que sabe como o STF funciona.
          </p>
        </header>

        <div class="stf-building">
          <span>⚖️</span>

          <strong>
            SUPREMO OU SUPOSIÇÃO?
          </strong>

          <small>
            Três perguntas. Uma indicação.
            Onze pessoas julgando o país.
          </small>
        </div>

        <div class="stf-quiz-preview">
          <span>🟢 Fácil</span>
          <span>🟡 Média</span>
          <span>🔴 Difícil</span>
        </div>

        <button
          type="button"
          class="primary-button"
          id="start-stf-quiz"
        >
          Iniciar sabatina
        </button>

        <small class="stf-fiction-warning">
          Os candidatos são personagens
          fictícios e satíricos.
        </small>
      </section>
    `;

    document
      .querySelector(
        "#start-stf-quiz"
      )
      .addEventListener(
        "click",
        renderQuestion
      );
  }

  function renderQuestion() {
    answered = false;

    const currentQuestion =
      questions[currentQuestionIndex];

    app.innerHTML = `
      <section class="screen stf-quiz-screen">
        <header class="stf-quiz-header">
          <div>
            <p class="eyebrow">
              Pergunta
              ${currentQuestionIndex + 1}
              de 3
            </p>

            <h1>
              ${difficultyNames[
                currentQuestion.difficulty
              ]}
            </h1>
          </div>

          <div class="stf-timer">
            <strong id="stf-time">
              15
            </strong>

            <small>segundos</small>
          </div>
        </header>

        <div class="stf-progress">
          ${questions
            .map(
              (_, index) => `
                <span
                  class="${
                    index <
                    currentQuestionIndex
                      ? "completed"
                      : index ===
                          currentQuestionIndex
                        ? "current"
                        : ""
                  }"
                ></span>
              `
            )
            .join("")}
        </div>

        <article class="stf-question">
          <span>⚖️</span>

          <strong>
            ${currentQuestion.question}
          </strong>
        </article>

        <div class="stf-answers">
          ${currentQuestion.answers
            .map(
              (answer, index) => `
                <button
                  type="button"
                  class="stf-answer"
                  data-answer-index="${index}"
                >
                  <span>
                    ${String.fromCharCode(
                      65 + index
                    )}
                  </span>

                  ${answer}
                </button>
              `
            )
            .join("")}
        </div>

        <div class="stf-help-options">
          <button
            type="button"
            id="ask-advisor"
            ${
              advisorUsed ||
              (
                gameState.player
                  ?.personalWealth ?? 0
              ) < ADVISOR_COST
                ? "disabled"
                : ""
            }
          >
            🧑‍💼 Consultar assessor

            <small>
              ${formatCurrency(
                ADVISOR_COST
              )}
            </small>
          </button>

          <button
            type="button"
            id="hidden-search"
            ${
              hiddenSearchUsed
                ? "disabled"
                : ""
            }
          >
            📱 Pesquisar escondido

            <small>
              +8s e +5 corrupção
            </small>
          </button>
        </div>
      </section>
    `;

    document
      .querySelectorAll(
        ".stf-answer"
      )
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            answerQuestion(
              Number(
                button.dataset
                  .answerIndex
              )
            );
          }
        );
      });

    document
      .querySelector("#ask-advisor")
      ?.addEventListener(
        "click",
        useAdvisor
      );

    document
      .querySelector("#hidden-search")
      ?.addEventListener(
        "click",
        useHiddenSearch
      );

    deadline =
      Date.now() + QUESTION_TIME;

    timerId = setInterval(
      updateTimer,
      100
    );
  }

  function updateTimer() {
    const remaining = Math.max(
      0,
      deadline - Date.now()
    );

    const seconds =
      Math.ceil(remaining / 1000);

    const element =
      document.querySelector(
        "#stf-time"
      );

    if (element) {
      element.textContent =
        seconds;

      element.classList.toggle(
        "danger",
        seconds <= 5
      );
    }

    if (
      remaining <= 0 &&
      !answered
    ) {
      answered = true;
      clearInterval(timerId);

      showQuestionResult(
        false,
        null
      );
    }
  }

  function useAdvisor() {
    if (
      advisorUsed ||
      answered
    ) {
      return;
    }

    advisorUsed = true;
    advisorCost += ADVISOR_COST;

    const currentQuestion =
      questions[currentQuestionIndex];

    const wrongButtons = [
      ...document.querySelectorAll(
        ".stf-answer"
      )
    ].filter(
      (button) =>
        Number(
          button.dataset.answerIndex
        ) !==
        currentQuestion.correctAnswer
    );

    shuffle(wrongButtons)
      .slice(0, 2)
      .forEach((button) => {
        button.disabled = true;
        button.classList.add(
          "eliminated"
        );
      });

    const advisorButton =
      document.querySelector(
        "#ask-advisor"
      );

    if (advisorButton) {
      advisorButton.disabled = true;
      advisorButton.innerHTML =
        "🧑‍💼 Duas alternativas eliminadas";
    }
  }

  function useHiddenSearch() {
    if (
      hiddenSearchUsed ||
      answered
    ) {
      return;
    }

    hiddenSearchUsed = true;
    cheatingCorruption += 5;
    deadline += 8000;

    const searchButton =
      document.querySelector(
        "#hidden-search"
      );

    if (searchButton) {
      searchButton.disabled = true;
      searchButton.innerHTML =
        "📱 Pesquisa realizada";
    }
  }

  function answerQuestion(
    selectedAnswer
  ) {
    if (answered) {
      return;
    }

    answered = true;
    clearInterval(timerId);

    const currentQuestion =
      questions[currentQuestionIndex];

    const correct =
      selectedAnswer ===
      currentQuestion.correctAnswer;

    if (correct) {
      correctAnswers += 1;
    }

    showQuestionResult(
      correct,
      selectedAnswer
    );
  }

  function showQuestionResult(
    correct,
    selectedAnswer
  ) {
    const currentQuestion =
      questions[currentQuestionIndex];

    const timedOut =
      selectedAnswer === null;

    app.innerHTML = `
      <section class="screen stf-question-result">
        <div
          class="stf-question-result-icon ${
            correct ? "correct" : "wrong"
          }"
        >
          ${
            correct
              ? "✅"
              : timedOut
                ? "⏰"
                : "❌"
          }
        </div>

        <p class="eyebrow">
          ${
            correct
              ? "Resposta correta"
              : timedOut
                ? "Tempo esgotado"
                : "Resposta errada"
          }
        </p>

        <h1>
          ${
            correct
              ? "Conhecimento desbloqueado"
              : "Falou de Direito no grupo da família"
          }
        </h1>

        <p>
          ${currentQuestion.explanation}
        </p>

        <div class="stf-current-score">
          Acertos:
          <strong>
            ${correctAnswers}/3
          </strong>
        </div>

        <button
          type="button"
          class="primary-button"
          id="next-stf-question"
        >
          ${
            currentQuestionIndex < 2
              ? "Próxima pergunta"
              : "Analisar candidatos"
          }
        </button>
      </section>
    `;

    document
      .querySelector(
        "#next-stf-question"
      )
      .addEventListener(
        "click",
        () => {
          currentQuestionIndex += 1;

          if (
            currentQuestionIndex <
            questions.length
          ) {
            renderQuestion();
            return;
          }

          renderCandidates();
        }
      );
  }

  function canReveal(attribute) {
    const firstLevel = [
      "legalKnowledge",
      "senateSupport"
    ];

    const secondLevel = [
      "independence",
      "democracy"
    ];

    const thirdLevel = [
      "integrity",
      "loyalty",
      "authoritarianism",
      "quality",
      "secret"
    ];

    if (
      correctAnswers >= 1 &&
      firstLevel.includes(attribute)
    ) {
      return true;
    }

    if (
      correctAnswers >= 2 &&
      secondLevel.includes(attribute)
    ) {
      return true;
    }

    if (
      correctAnswers >= 3 &&
      thirdLevel.includes(attribute)
    ) {
      return true;
    }

    return false;
  }

  function attributeHTML(
    label,
    attribute,
    value
  ) {
    const visible =
      canReveal(attribute);

    return `
      <div class="candidate-attribute">
        <span>${label}</span>

        <strong>
          ${
            visible
              ? value
              : "???"
          }
        </strong>

        <div class="attribute-bar">
          <i
            style="width: ${
              visible ? value : 0
            }%"
          ></i>
        </div>
      </div>
    `;
  }

  function renderCandidates() {
    app.innerHTML = `
      <section class="screen stf-candidates-screen">
        <header>
          <p class="eyebrow">
            Indicação ao Supremo
          </p>

          <h1>Escolha um candidato</h1>

          <p>
            Você acertou
            <strong>
              ${correctAnswers}/3
            </strong>
            perguntas.
          </p>
        </header>

        <div class="candidate-revelation">
          ${
            correctAnswers === 0
              ? "🙈 Você avaliará apenas slogans e aparências."
              : correctAnswers === 1
                ? "🔍 Currículo e apoio político revelados."
                : correctAnswers === 2
                  ? "🔍 Independência e democracia reveladas."
                  : "🧠 Dossiê completo desbloqueado."
          }
        </div>

        <div class="stf-candidates">
          ${candidates
            .map(
              (candidate) => `
                <article class="stf-candidate">
                  <div class="candidate-icon">
                    ${candidate.icon}
                  </div>

                  <h2>${candidate.name}</h2>

                  <small>
                    ${candidate.nickname}
                  </small>

                  <blockquote>
                    “${candidate.slogan}”
                  </blockquote>

                  <div class="candidate-attributes">
                    ${attributeHTML(
                      "Saber jurídico",
                      "legalKnowledge",
                      candidate
                        .legalKnowledge
                    )}

                    ${attributeHTML(
                      "Apoio no Senado",
                      "senateSupport",
                      candidate
                        .senateSupport
                    )}

                    ${attributeHTML(
                      "Independência",
                      "independence",
                      candidate
                        .independence
                    )}

                    ${attributeHTML(
                      "Democracia",
                      "democracy",
                      candidate
                        .democracy
                    )}

                    ${attributeHTML(
                      "Integridade",
                      "integrity",
                      candidate
                        .integrity
                    )}

                    ${attributeHTML(
                      "Lealdade a você",
                      "loyalty",
                      candidate.loyalty
                    )}

                    ${attributeHTML(
                      "Autoritarismo",
                      "authoritarianism",
                      candidate
                        .authoritarianism
                    )}
                  </div>

                  ${
                    canReveal("secret")
                      ? `
                        <p class="candidate-secret">
                          🗂️ ${candidate.secret}
                        </p>

                        <strong class="candidate-quality">
                          Qualidade institucional:
                          ${candidate.quality}
                        </strong>
                      `
                      : ""
                  }

                  <button
                    type="button"
                    class="primary-button choose-candidate"
                    data-candidate-id="${
                      candidate.id
                    }"
                  >
                    Indicar ao STF
                  </button>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;

    document
      .querySelectorAll(
        ".choose-candidate"
      )
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            selectedCandidate =
              candidates.find(
                (candidate) =>
                  candidate.id ===
                  button.dataset
                    .candidateId
              );

            renderSenateVote();
          }
        );
      });
  }

  function renderSenateVote() {
    const congress =
      gameState.indicators
        ?.congress ?? 50;

    const approvalChance = clamp(
      selectedCandidate
        .senateSupport * 0.7 +
      congress * 0.3,
      20,
      92
    );

    const yesVotes = clamp(
      Math.round(
        81 *
        approvalChance /
        100
      ) +
      randomBetween(-4, 4),
      0,
      81
    );

    const noVotes =
      81 - yesVotes;

    const approved =
      yesVotes >= 41;

    app.innerHTML = `
      <section class="screen stf-senate-screen">
        <p class="eyebrow">
          Sabatina no Senado
        </p>

        <h1>
          ${selectedCandidate.icon}
          ${selectedCandidate.name}
        </h1>

        <div class="senate-vote-board">
          <div>
            <small>SIM</small>

            <strong id="senate-yes">
              0
            </strong>
          </div>

          <span>81 votos</span>

          <div>
            <small>NÃO</small>

            <strong id="senate-no">
              0
            </strong>
          </div>
        </div>

        <div class="senate-progress">
          <div
            id="senate-yes-progress"
          ></div>
        </div>

        <p id="senate-status">
          Senadores depositando votos...
        </p>
      </section>
    `;

    let countedVotes = 0;
    let currentYes = 0;
    let currentNo = 0;

    const voteSequence = shuffle([
      ...Array(yesVotes).fill("yes"),
      ...Array(noVotes).fill("no")
    ]);

    const voteInterval =
      setInterval(() => {
        const vote =
          voteSequence[countedVotes];

        if (vote === "yes") {
          currentYes += 1;
        } else {
          currentNo += 1;
        }

        countedVotes += 1;

        document.querySelector(
          "#senate-yes"
        ).textContent = currentYes;

        document.querySelector(
          "#senate-no"
        ).textContent = currentNo;

        document.querySelector(
          "#senate-yes-progress"
        ).style.width =
          `${
            currentYes / 81 * 100
          }%`;

        if (
          countedVotes >= 81
        ) {
          clearInterval(voteInterval);

          setTimeout(() => {
            showFinalResult({
              approved,
              yesVotes,
              noVotes
            });
          }, 700);
        }
      }, 38);
  }

  function showFinalResult({
    approved,
    yesVotes,
    noVotes
  }) {
    const effects =
      createEmptyEffects();

    effects.personalWealth =
      -advisorCost;

    effects.corruption =
      cheatingCorruption;

    let title;
    let verdict;
    let icon;
    let resultText;
    let qualityLevel;

    if (!approved) {
      title =
        "Nem o Senado tankou";

      verdict =
        "INDICAÇÃO REJEITADA";

      icon = "🚫";
      qualityLevel = "rejected";

      resultText =
        `${selectedCandidate.name} recebeu ${yesVotes} votos favoráveis e foi rejeitado pelo Senado.`;

      effects.indicators = {
        people: -3,
        congress: -8,
        economy: 0,
        stability: -4
      };

      effects.factions = {
        press: -2
      };

      effects.politics = {
        personalism: 2
      };
    } else if (
      selectedCandidate.quality >= 75
    ) {
      title =
        "Guardião da Constituição";

      verdict =
        "EXCELENTE INDICAÇÃO";

      icon = "⚖️";
      qualityLevel = "excellent";

      resultText =
        `${selectedCandidate.name} foi aprovado com ${yesVotes} votos e demonstrou forte preparo institucional.`;

      effects.indicators = {
        people: 7,
        congress: 3,
        economy: 0,
        stability: 9
      };

      effects.factions = {
        press: 7,
        socialMovements: 5
      };

      effects.politics = {
        authoritarianism: -5,
        popularParticipation: 4,
        personalism: -3
      };

      effects.corruption -= 3;
    } else if (
      selectedCandidate.quality >= 58
    ) {
      title =
        "Ministro razoável";

      verdict =
        "INDICAÇÃO APROVADA";

      icon = "🏛️";
      qualityLevel = "regular";

      resultText =
        `${selectedCandidate.name} foi aprovado com ${yesVotes} votos. Não empolgou constitucionalistas, mas também não provocou fuga do país.`;

      effects.indicators = {
        people: 2,
        congress: 5,
        economy: 0,
        stability: 3
      };

      effects.factions = {
        press: 1
      };

      effects.politics = {
        personalism: 1
      };
    } else {
      title =
        "Advogado do Presidente";

      verdict =
        "LEALDADE ACIMA DA LEI";

      icon = "🤝";
      qualityLevel = "bad";

      resultText =
        `${selectedCandidate.name} foi aprovado com ${yesVotes} votos. O novo ministro promete independência, desde que o governo concorde.`;

      effects.indicators = {
        people: -7,
        congress: 8,
        economy: 0,
        stability: -8
      };

      effects.factions = {
        press: -9,
        socialMovements: -7
      };

      effects.politics = {
        authoritarianism: 8,
        personalism: 8
      };

      effects.corruption += 5;
    }

    app.innerHTML = `
      <section class="screen stf-final-screen">
        <div class="stf-final-icon">
          ${icon}
        </div>

        <p class="eyebrow">
          Resultado da indicação
        </p>

        <h1>${title}</h1>

        <strong class="stf-final-verdict">
          ${verdict}
        </strong>

        <div class="stf-final-candidate">
          <span>
            ${selectedCandidate.icon}
          </span>

          <div>
            <small>Indicado</small>

            <strong>
              ${selectedCandidate.name}
            </strong>
          </div>
        </div>

        <div class="stf-final-votes">
          <span>
            ✅ ${yesVotes} votos
          </span>

          <span>
            ❌ ${noVotes} votos
          </span>
        </div>

        <p>${resultText}</p>

        <div class="stf-player-performance">
          Conhecimento jurídico:
          <strong>
            ${correctAnswers}/3
          </strong>
        </div>

        <button
          type="button"
          class="primary-button"
          id="continue-after-stf"
        >
          Continuar governo
        </button>
      </section>
    `;

    document
      .querySelector(
        "#continue-after-stf"
      )
      .addEventListener(
        "click",
        () => {
          onComplete({
            appointment: {
              candidateId:
                selectedCandidate.id,

              candidateName:
                selectedCandidate.name,

              candidateIcon:
                selectedCandidate.icon,

              approved,
              yesVotes,
              noVotes,
              quality:
                selectedCandidate.quality,

              qualityLevel,
              correctAnswers
            },

            choice: {
              id:
                approved
                  ? `stf-approved-${selectedCandidate.id}`
                  : `stf-rejected-${selectedCandidate.id}`,

              text:
                `Indicar ${selectedCandidate.name}`,

              resultText,
              effects,

              metadata: {
                stf: {
                  candidate:
                    selectedCandidate.id,

                  approved,
                  yesVotes,
                  noVotes,

                  quality:
                    selectedCandidate
                      .quality,

                  correctAnswers,

                  advisorUsed,
                  hiddenSearchUsed
                }
              }
            }
          });
        }
      );
  }
}