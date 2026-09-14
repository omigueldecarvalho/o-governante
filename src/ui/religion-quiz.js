const RELIGIONS = [
  {
    id: "catholic",
    icon: "✝️",
    name: "Catolicismo",

    question: {
      text:
        "Segundo a tradição católica, quem foi o primeiro papa?",

      answers: [
        "São Pedro",
        "São Paulo",
        "Santo Agostinho",
        "São Jorge"
      ],

      correctAnswer: 0
    },

    effects: {
      indicators: {
        people: 3,
        congress: 3
      },

      factions: {
        religiousGroups: 8
      },

      politics: {
        socialPosition: 2
      }
    }
  },

  {
    id: "protestant",
    icon: "📖",
    name: "Protestantismo",

    question: {
      text:
        "Qual personagem é associado ao início da Reforma Protestante?",

      answers: [
        "Martinho Lutero",
        "Carlos Magno",
        "São Francisco",
        "Galileu Galilei"
      ],

      correctAnswer: 0
    },

    effects: {
      indicators: {
        people: 3,
        congress: 5
      },

      factions: {
        religiousGroups: 10,
        socialMovements: -2
      },

      politics: {
        socialPosition: 4
      }
    }
  },

  {
    id: "spiritist",
    icon: "🕊️",
    name: "Espiritismo",

    question: {
      text:
        "Qual destas obras é associada a Allan Kardec?",

      answers: [
        "O Livro dos Espíritos",
        "A República",
        "O Príncipe",
        "Os Sertões"
      ],

      correctAnswer: 0
    },

    effects: {
      indicators: {
        people: 4,
        stability: 2
      },

      factions: {
        religiousGroups: 4,
        socialMovements: 2
      },

      country: {
        publicServices: 2
      },

      politics: {
        popularParticipation: 2
      }
    }
  },

  {
    id: "afro-brazilian",
    icon: "🌊",
    name: "Matrizes africanas",

    question: {
      text:
        "Nas religiões afro-brasileiras, Iemanjá é tradicionalmente associada a quê?",

      answers: [
        "Às águas",
        "À agricultura",
        "À escrita",
        "À metalurgia"
      ],

      correctAnswer: 0
    },

    effects: {
      indicators: {
        people: 4,
        congress: -2
      },

      factions: {
        socialMovements: 8,
        religiousGroups: 3
      },

      politics: {
        popularParticipation: 5,
        socialPosition: -2
      }
    }
  },

  {
    id: "other-faith",
    icon: "🕯️",
    name: "Outra fé",

    question: {
      text:
        "O que a liberdade religiosa garante em um Estado democrático?",

      answers: [
        "Praticar ou não uma religião",
        "Uma religião obrigatória",
        "Cultos apenas privados",
        "Voto exclusivo aos religiosos"
      ],

      correctAnswer: 0
    },

    effects: {
      indicators: {
        people: 2,
        stability: 3
      },

      factions: {
        religiousGroups: 2
      },

      politics: {
        popularParticipation: 3
      }
    }
  },

  {
    id: "no-religion",
    icon: "⚛️",
    name: "Sem religião",

    question: {
      text:
        "O que significa dizer que o Estado é laico?",

      answers: [
        "Não adota religião oficial",
        "Proíbe todas as religiões",
        "Obriga o ateísmo",
        "Ignora a liberdade religiosa"
      ],

      correctAnswer: 0
    },

    effects: {
      indicators: {
        stability: 4,
        congress: -3
      },

      factions: {
        religiousGroups: -7,
        press: 3
      },

      politics: {
        socialPosition: -4,
        popularParticipation: 3
      }
    }
  }
];

const SECULAR_OPTION = {
  id: "private-belief",
  icon: "🏛️",
  name: "Minha fé é assunto privado"
};

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

export function renderReligionQuiz({
  gameState,
  decision,
  onComplete
}) {
  const app =
    document.querySelector("#app");

  let selectedReligion = null;
  let timerId = null;
  let answered = false;

  renderSelection();

  function renderSelection() {
    app.innerHTML = `
      <section class="screen religion-screen">
        <header class="religion-header">
          <p class="eyebrow">
            Entrevista nacional
          </p>

          <h1>${decision.title}</h1>

          <p>
            A apresentadora quer conhecer
            a relação do governante com a fé.
          </p>
        </header>

        <div class="religion-grid">
          ${RELIGIONS.map(
            (religion) => `
              <button
                type="button"
                class="religion-option"
                data-religion-id="${
                  religion.id
                }"
              >
                <span>
                  ${religion.icon}
                </span>

                <strong>
                  ${religion.name}
                </strong>
              </button>
            `
          ).join("")}
        </div>

        <button
          type="button"
          class="religion-private-option"
          id="private-belief"
        >
          <span>
            ${SECULAR_OPTION.icon}
          </span>

          <strong>
            ${SECULAR_OPTION.name}
          </strong>

          <small>
            Recusar o uso eleitoral da religião
          </small>
        </button>
      </section>
    `;

    document
      .querySelectorAll(
        ".religion-option"
      )
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            selectedReligion =
              RELIGIONS.find(
                (religion) =>
                  religion.id ===
                  button.dataset
                    .religionId
              );

            renderQuestion();
          }
        );
      });

    document
      .querySelector(
        "#private-belief"
      )
      .addEventListener(
        "click",
        () => {
          selectedReligion =
            SECULAR_OPTION;

          showResult("secular");
        }
      );
  }

  function renderQuestion() {
    answered = false;

    const question =
      selectedReligion.question;

    app.innerHTML = `
      <section class="screen religion-quiz-screen">
        <header class="religion-quiz-header">
          <div>
            <p class="eyebrow">
              Sabatina ao vivo
            </p>

            <h1>
              ${selectedReligion.icon}
              ${selectedReligion.name}
            </h1>
          </div>

          <div class="religion-timer">
            <strong id="religion-time">
              12
            </strong>

            <small>segundos</small>
          </div>
        </header>

        <div class="religion-time-bar">
          <div
            id="religion-time-progress"
          ></div>
        </div>

        <article class="religion-question">
          <span class="reporter-avatar">
            🎤
          </span>

          <p>${question.text}</p>
        </article>

        <div class="religion-answers">
          ${question.answers
            .map(
              (answer, index) => `
                <button
                  type="button"
                  class="religion-answer"
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
      </section>
    `;

    const startedAt = Date.now();
    const duration = 12000;

    timerId = setInterval(() => {
      const elapsed =
        Date.now() - startedAt;

      const remaining =
        Math.max(
          0,
          duration - elapsed
        );

      const seconds =
        Math.ceil(remaining / 1000);

      const percentage =
        remaining / duration * 100;

      const timeElement =
        document.querySelector(
          "#religion-time"
        );

      const progressElement =
        document.querySelector(
          "#religion-time-progress"
        );

      if (timeElement) {
        timeElement.textContent =
          seconds;
      }

      if (progressElement) {
        progressElement.style.width =
          `${percentage}%`;

        progressElement.classList.toggle(
          "danger",
          seconds <= 4
        );
      }

      if (remaining <= 0) {
        clearInterval(timerId);

        if (!answered) {
          answered = true;
          showResult("timeout");
        }
      }
    }, 100);

    document
      .querySelectorAll(
        ".religion-answer"
      )
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            if (answered) {
              return;
            }

            answered = true;
            clearInterval(timerId);

            const answerIndex =
              Number(
                button.dataset
                  .answerIndex
              );

            const correct =
              answerIndex ===
              question.correctAnswer;

            showResult(
              correct
                ? "correct"
                : "wrong"
            );
          }
        );
      });
  }

  function showResult(status) {
    if (timerId) {
      clearInterval(timerId);
    }

    const effects =
      createEmptyEffects();

    let verdict;
    let title;
    let description;
    let resultClass;
    let resultIcon;

    if (status === "secular") {
      verdict =
        "Estado laico raiz";

      title =
        "Fé não é palanque";

      description =
        "O governante recusou transformar sua crença em propaganda eleitoral.";

      resultClass = "secular";
      resultIcon = "🏛️";

      mergeEffects(effects, {
        indicators: {
          people: 4,
          congress: -4,
          stability: 5
        },

        factions: {
          religiousGroups: -6,
          socialMovements: 5,
          press: 6
        },

        politics: {
          popularParticipation: 3,
          personalism: -5,
          socialPosition: -3
        },

        corruption: -2
      });
    } else {
      mergeEffects(
        effects,
        selectedReligion.effects
      );

      if (status === "correct") {
        verdict =
          "Fiel verdadeiro";

        title =
          "Passou na sabatina";

        description =
          "A resposta convenceu até quem desconfiava que a fé havia surgido junto com a candidatura.";

        resultClass = "correct";
        resultIcon = "😇";

        mergeEffects(effects, {
          indicators: {
            people: 6,
            congress: 2,
            stability: 2
          },

          factions: {
            religiousGroups: 5,
            press: 2
          },

          corruption: -2
        });
      }

      if (status === "wrong") {
        verdict =
          "Convertido eleitoral";

        title =
          "A fé durou até a pergunta";

        description =
          "A resposta errada virou meme e antigos vídeos contraditórios apareceram na imprensa.";

        resultClass = "wrong";
        resultIcon = "🤥";

        mergeEffects(effects, {
          indicators: {
            people: -8,
            congress: -3,
            stability: -3
          },

          factions: {
            religiousGroups: -8,
            press: -7
          },

          politics: {
            personalism: 7
          },

          corruption: 6
        });
      }

      if (status === "timeout") {
        verdict =
          "Em cima do muro espiritual";

        title =
          "O silêncio falou mais";

        description =
          "O governante gastou doze segundos procurando uma resposta que não estava no ponto eletrônico.";

        resultClass = "timeout";
        resultIcon = "😶";

        mergeEffects(effects, {
          indicators: {
            people: -4,
            congress: -2,
            stability: -2
          },

          factions: {
            religiousGroups: -4,
            press: -5
          },

          politics: {
            personalism: 4
          },

          corruption: 3
        });
      }
    }

    app.innerHTML = `
      <section
        class="screen religion-result-screen"
      >
        <div
          class="religion-result-icon ${
            resultClass
          }"
        >
          ${resultIcon}
        </div>

        <p class="eyebrow">
          Veredito da entrevista
        </p>

        <h1>${title}</h1>

        <strong
          class="religion-verdict ${
            resultClass
          }"
        >
          ${verdict}
        </strong>

        <p class="religion-result-text">
          ${description}
        </p>

        <div class="religion-selected">
          <span>
            ${selectedReligion.icon}
          </span>

          <div>
            <small>
              Posição declarada
            </small>

            <strong>
              ${selectedReligion.name}
            </strong>
          </div>
        </div>

        <button
          type="button"
          class="primary-button"
          id="continue-religion"
        >
          Continuar governo
        </button>
      </section>
    `;

    document
      .querySelector(
        "#continue-religion"
      )
      .addEventListener(
        "click",
        () => {
          onComplete({
            religion: {
              id:
                selectedReligion.id,

              name:
                selectedReligion.name,

              icon:
                selectedReligion.icon,

              verdict,
              status
            },

            choice: {
              id:
                `religion-${status}`,

              text:
                selectedReligion.name,

              resultText:
                description,

              effects,

              metadata: {
                religion: {
                  id:
                    selectedReligion.id,

                  verdict,
                  status
                }
              }
            }
          });
        }
      );
  }
}