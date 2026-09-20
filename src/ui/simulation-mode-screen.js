const QUESTIONS = [
  {
    id: "priority",

    title:
      "Qual será a prioridade do governo?",

    options: [
      {
        id: "social",
        icon: "👥",
        title: "Reduzir desigualdade",

        description:
          "Fortalecer serviços públicos e programas sociais.",

        effects: {
          indicators: {
            people: 8,
            economy: -3
          },

          country: {
            inequality: -6,
            publicServices: 5
          },

          politics: {
            economicPosition: -6,
            popularParticipation: 4
          }
        }
      },

      {
        id: "economy",
        icon: "📈",
        title: "Fazer a economia crescer",

        description:
          "Priorizar empresas, investimentos e confiança do mercado.",

        effects: {
          indicators: {
            economy: 8,
            people: -2
          },

          factions: {
            business: 7,
            unions: -3
          },

          politics: {
            economicPosition: 6
          }
        }
      },

      {
        id: "order",
        icon: "🛡️",
        title: "Restaurar a ordem",

        description:
          "Reforçar autoridade, segurança e estabilidade.",

        effects: {
          indicators: {
            stability: 8,
            people: -3
          },

          factions: {
            military: 7
          },

          politics: {
            authoritarianism: 7
          }
        }
      },

      {
        id: "wealth",
        icon: "💼",
        title: "Enriquecer discretamente",

        description:
          "Aproveitar as oportunidades oferecidas pelo cargo.",

        effects: {
          corruption: 12,
          personalWealth: 500000,

          politics: {
            personalism: 6
          },

          image: {
            scrutiny: 5
          }
        }
      }
    ]
  },

  {
    id: "congress",

    title:
      "Como lidará com o Congresso?",

    options: [
      {
        id: "dialogue",
        icon: "🤝",
        title: "Negociar",

        description:
          "Conversar até todo mundo acreditar que venceu.",

        effects: {
          indicators: {
            congress: 7,
            stability: 3
          },

          politics: {
            popularParticipation: 2,
            personalism: -2
          }
        }
      },

      {
        id: "independent",
        icon: "🧍",
        title: "Governar sozinho",

        description:
          "Recusar acordos e confiar na popularidade.",

        effects: {
          indicators: {
            people: 4,
            congress: -8,
            stability: -2
          },

          politics: {
            personalism: 5
          }
        }
      },

      {
        id: "positions",
        icon: "🪑",
        title: "Distribuir cargos",

        description:
          "Transformar ministérios em argumentos políticos.",

        effects: {
          indicators: {
            congress: 12,
            stability: 4
          },

          corruption: 7,

          politics: {
            personalism: 5
          }
        }
      },

      {
        id: "pressure",
        icon: "📸",
        title: "Pressionar parlamentares",

        description:
          "Usar investigações, ameaças e fotografias estrategicamente cortadas.",

        effects: {
          indicators: {
            congress: 5,
            stability: -5
          },

          corruption: 4,

          politics: {
            authoritarianism: 8,
            personalism: 5
          }
        }
      }
    ]
  },

  {
    id: "press",

    title:
      "Como será sua relação com a imprensa?",

    options: [
      {
        id: "transparent",
        icon: "🔎",
        title: "Transparência",

        description:
          "Divulgar dados antes que alguém precise vazar.",

        effects: {
          indicators: {
            people: 3,
            stability: 2
          },

          factions: {
            press: 10
          },

          corruption: -5,

          image: {
            humility: 3,
            scrutiny: -3
          }
        }
      },

      {
        id: "institutional",
        icon: "🎙️",
        title: "Comunicação institucional",

        description:
          "Falar bastante sem necessariamente responder.",

        effects: {
          indicators: {
            stability: 4
          },

          factions: {
            press: 4
          }
        }
      },

      {
        id: "attack",
        icon: "🥊",
        title: "Atacar jornalistas",

        description:
          "Se a notícia é ruim, o problema deve ser quem noticiou.",

        effects: {
          indicators: {
            people: 2,
            stability: -3
          },

          factions: {
            press: -12
          },

          politics: {
            authoritarianism: 6,
            personalism: 4
          }
        }
      },

      {
        id: "friendly",
        icon: "💸",
        title: "Comprar alguns amigos",

        description:
          "Investir em publicidade nos veículos mais compreensivos.",

        effects: {
          indicators: {
            stability: 3
          },

          factions: {
            press: 6
          },

          corruption: 8
        }
      }
    ]
  },

  {
    id: "legacy",

    title:
      "Como deseja ser lembrado?",

    options: [
      {
        id: "people",
        icon: "❤️",
        title: "Pelo povo",

        description:
          "Ser lembrado em músicas, camisetas e nomes de avenida.",

        effects: {
          indicators: {
            people: 6
          },

          politics: {
            popularParticipation: 6
          }
        }
      },

      {
        id: "economy",
        icon: "💹",
        title: "Pela economia",

        description:
          "Entregar gráficos que apontem preferencialmente para cima.",

        effects: {
          indicators: {
            economy: 6
          },

          factions: {
            business: 4
          },

          politics: {
            economicPosition: 4
          }
        }
      },

      {
        id: "authority",
        icon: "🦅",
        title: "Pela autoridade",

        description:
          "Fazer o país respeitar o governo ou pelo menos temê-lo.",

        effects: {
          indicators: {
            stability: 6
          },

          factions: {
            military: 4
          },

          politics: {
            authoritarianism: 6
          }
        }
      },

      {
        id: "patrimony",
        icon: "💎",
        title: "Pelo patrimônio",

        description:
          "Construir um legado que possa ser registrado em cartório.",

        effects: {
          corruption: 6,
          personalWealth: 250000,

          image: {
            ostentation: 5,
            scrutiny: 4
          }
        }
      }
    ]
  }
];

function createEmptyEffects() {
  return {
    indicators: {},
    factions: {},
    country: {},
    politics: {},
    image: {},
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
        (target[key] ?? 0) +
        value;
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

  mergeGroup(
    target.image,
    source.image
  );

  target.corruption +=
    source.corruption ?? 0;

  target.personalWealth +=
    source.personalWealth ?? 0;
}

export function renderGameModeScreen({
  onSelect,
  onBack
}) {
  const app =
    document.querySelector(
      "#app"
    );

  app.innerHTML = `
    <section class="screen game-mode-screen">
      <p class="eyebrow">
        Formato da partida
      </p>

      <h1>Como deseja governar?</h1>

      <p class="subtitle">
        Os dois modos utilizam as mesmas
        decisões, ideologias e finais.
      </p>

      <div class="game-mode-options">
        <button
          type="button"
          class="game-mode-card"
          data-game-mode="classic"
        >
          <span class="game-mode-icon">
            🏛️
          </span>

          <strong>
            Mandato Completo
          </strong>

          <p>
            Experiência completa, com
            decisões mensais, eventos e
            consequências de longo prazo.
          </p>

          <small>
            48 decisões por mandato
          </small>
        </button>

        <button
          type="button"
          class="game-mode-card recommended"
          data-game-mode="simulation"
        >
          <span class="game-mode-badge">
            Partida rápida
          </span>

          <span class="game-mode-icon">
            ⚡
          </span>

          <strong>
            Simulação Expressa
          </strong>

          <p>
             Cinco decisões representam os
  principais momentos do governo.
  Sem campanha, eleição ou etapas
  intermediárias.
          </p>

          <small>
            5 decisões · aproximadamente 5 minutos
          </small>
        </button>
      </div>

      <button
        type="button"
        class="secondary-button"
        id="back-from-game-mode"
      >
        Voltar
      </button>
    </section>
  `;

  document
    .querySelectorAll(
      "[data-game-mode]"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          onSelect?.(
            button.dataset.gameMode
          );
        }
      );
    });

  document
    .querySelector(
      "#back-from-game-mode"
    )
    ?.addEventListener(
      "click",
      onBack
    );
}

export function renderSimulationProfileScreen({
  onComplete,
  onBack
}) {
  const app =
    document.querySelector(
      "#app"
    );

  const questionsHTML =
    QUESTIONS.map(
      (question, index) => `
        <fieldset class="simulation-question">
          <legend>
            <span>
              ${index + 1}
            </span>

            ${question.title}
          </legend>

          <div class="simulation-options">
            ${question.options
              .map(
                (option) => `
                  <label class="simulation-option">
                    <input
                      type="radio"
                      name="${question.id}"
                      value="${option.id}"
                    >

                    <span class="simulation-option-content">
                      <span class="simulation-option-icon">
                        ${option.icon}
                      </span>

                      <strong>
                        ${option.title}
                      </strong>

                      <small>
                        ${option.description}
                      </small>
                    </span>
                  </label>
                `
              )
              .join("")}
          </div>
        </fieldset>
      `
    ).join("");

  app.innerHTML = `
    <section class="screen simulation-profile-screen">
      <p class="eyebrow">
        Simulação Expressa
      </p>

      <h1>Defina seu estilo de governo</h1>

      <p class="subtitle">
        Suas respostas concedem pequenos
        bônus iniciais, mas não determinam
        o resultado da partida.
      </p>

      <form id="simulation-profile-form">
        ${questionsHTML}

        <p
          class="form-error"
          id="simulation-form-error"
          hidden
        >
          Responda todas as perguntas.
        </p>

        <button
          type="submit"
          class="primary-button"
        >
          Iniciar simulação
        </button>

        <button
          type="button"
          class="secondary-button"
          id="back-from-simulation"
        >
          Voltar
        </button>
      </form>
    </section>
  `;

  const form =
    document.querySelector(
      "#simulation-profile-form"
    );

  const errorElement =
    document.querySelector(
      "#simulation-form-error"
    );

  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const formData =
        new FormData(form);

      const answers = {};
      const effects =
        createEmptyEffects();

      const allAnswered =
        QUESTIONS.every(
          (question) =>
            formData.has(
              question.id
            )
        );

      if (!allAnswered) {
        errorElement.hidden =
          false;

        return;
      }

      errorElement.hidden = true;

      QUESTIONS.forEach(
        (question) => {
          const answerId =
            formData.get(
              question.id
            );

          const option =
            question.options.find(
              (item) =>
                item.id ===
                answerId
            );

          answers[question.id] =
            answerId;

          mergeEffects(
            effects,
            option.effects
          );
        }
      );

      onComplete?.({
        answers,
        effects
      });
    }
  );

  document
    .querySelector(
      "#back-from-simulation"
    )
    ?.addEventListener(
      "click",
      onBack
    );
}