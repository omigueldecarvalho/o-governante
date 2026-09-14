const PURPOSES = {
  people: {
    icon: "✊",
    name: "Representar o povo",
    resultText:
      "A nova bandeira foi apresentada como símbolo de participação popular.",

    effects: {
      indicators: {
        people: 8,
        congress: -2,
        stability: 1
      },

      factions: {
        unions: 5,
        socialMovements: 7,
        business: -3
      },

      politics: {
        economicPosition: -3,
        popularParticipation: 6
      }
    }
  },

  market: {
    icon: "📈",
    name: "Celebrar o progresso",
    resultText:
      "O governo apresentou a bandeira como símbolo de prosperidade e liberdade econômica.",

    effects: {
      indicators: {
        people: 2,
        economy: 7,
        congress: 3
      },

      factions: {
        business: 8,
        unions: -4
      },

      politics: {
        economicPosition: 6
      }
    }
  },

  order: {
    icon: "🛡️",
    name: "Exaltar a ordem",
    resultText:
      "A nova bandeira foi apresentada em uma cerimônia cercada por militares.",

    effects: {
      indicators: {
        people: -4,
        congress: 3,
        stability: 9
      },

      factions: {
        military: 10,
        socialMovements: -6
      },

      politics: {
        authoritarianism: 7,
        popularParticipation: -4
      }
    }
  },

  leader: {
    icon: "👑",
    name: "Celebrar minha liderança",
    resultText:
      "A nova bandeira deixou historiadores em dúvida se ainda representava o país ou apenas seu governante.",

    effects: {
      indicators: {
        people: -3,
        congress: -4,
        stability: 3
      },

      factions: {
        military: 4,
        press: -8
      },

      politics: {
        authoritarianism: 8,
        personalism: 12
      },

      corruption: 4
    }
  }
};

const COLORS = [
  "#1f7a3f",
  "#f4d03f",
  "#2455a4",
  "#d93636",
  "#111111",
  "#ffffff",
  "#8e44ad",
  "#f28c28"
];

const COLOR_EFFECTS = {
  "#1f7a3f": {
    country: { environment: 4 },
    factions: { socialMovements: 2 }
  },

  "#f4d03f": {
    indicators: { economy: 3 },
    factions: { business: 2 }
  },

  "#2455a4": {
    indicators: { stability: 2 },
    politics: { economicPosition: 2 }
  },

  "#d93636": {
    factions: {
      unions: 3,
      socialMovements: 3,
      business: -2
    },
    politics: { economicPosition: -3 }
  },

  "#111111": {
    indicators: { stability: 3, people: -2 },
    politics: { authoritarianism: 3 }
  },

  "#ffffff": {
    indicators: { people: 1 }
  },

  "#8e44ad": {
    indicators: { people: 2 },
    politics: { popularParticipation: 2 }
  },

  "#f28c28": {
    factions: { religiousGroups: 3 },
    indicators: { congress: 2 }
  }
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

function mergeGroup(target, source = {}) {
  Object.entries(source).forEach(([key, value]) => {
    target[key] = (target[key] ?? 0) + value;
  });
}

function mergeEffects(target, source = {}) {
  mergeGroup(target.indicators, source.indicators);
  mergeGroup(target.factions, source.factions);
  mergeGroup(target.country, source.country);
  mergeGroup(target.politics, source.politics);

  target.corruption += source.corruption ?? 0;
  target.personalWealth += source.personalWealth ?? 0;
}

function escapeHTML(value = "") {
  const element = document.createElement("div");
  element.textContent = String(value);
  return element.innerHTML;
}

export function renderFlagDesigner({
  gameState,
  decision,
  onComplete
}) {
  const app = document.querySelector("#app");

  let selectedPurpose = "people";
  let selectedTool = "brush";
  let selectedColor = COLORS[0];

  let drawing = false;
  let startX = 0;
  let startY = 0;
  let shapeSnapshot = null;

  const history = [];
  const colorUsage = {};

  app.innerHTML = `
    <section class="screen flag-designer-screen">
      <header class="flag-designer-header">
        <div>
          <p class="eyebrow">Identidade nacional</p>
          <h1>${escapeHTML(decision.title)}</h1>
        </div>

        <span class="flag-header-icon">🏳️</span>
      </header>

      <p class="flag-short-description">
        Escolha o propósito e desenhe um novo símbolo para a nação.
      </p>

      <div class="flag-purpose-grid">
        ${Object.entries(PURPOSES)
          .map(
            ([id, purpose]) => `
              <button
                type="button"
                class="flag-purpose ${
                  id === selectedPurpose ? "selected" : ""
                }"
                data-purpose="${id}"
              >
                <span>${purpose.icon}</span>
                <small>${purpose.name}</small>
              </button>
            `
          )
          .join("")}
      </div>

      <div class="flag-workspace">
        <div class="flag-toolbar">
          <button
            type="button"
            class="flag-tool selected"
            data-tool="brush"
            title="Pincel"
          >
            🖌️
          </button>

          <button
            type="button"
            class="flag-tool"
            data-tool="rectangle"
            title="Retângulo"
          >
            ▰
          </button>

          <button
            type="button"
            class="flag-tool"
            data-tool="circle"
            title="Círculo"
          >
            ●
          </button>

          <button
            type="button"
            class="flag-tool"
            data-tool="eraser"
            title="Borracha"
          >
            🧽
          </button>

          <button
            type="button"
            id="undo-flag"
            title="Desfazer"
          >
            ↩️
          </button>

          <button
            type="button"
            id="clear-flag"
            title="Limpar"
          >
            🗑️
          </button>
        </div>

        <canvas
          id="flag-canvas"
          width="600"
          height="360"
        ></canvas>

        <div class="flag-colors">
          ${COLORS.map(
            (color, index) => `
              <button
                type="button"
                class="flag-color ${
                  index === 0 ? "selected" : ""
                }"
                data-color="${color}"
                style="background: ${color}"
                aria-label="Selecionar cor ${color}"
              ></button>
            `
          ).join("")}
        </div>
      </div>

      <label class="flag-motto-field">
        <span>Lema nacional</span>

        <input
          type="text"
          id="flag-motto"
          maxlength="45"
          placeholder="Ex.: Ordem, progresso e um cafezinho"
        />
      </label>

      <div class="flag-actions">
        <button
          type="button"
          class="secondary-button"
          id="keep-current-flag"
        >
          Manter bandeira atual
        </button>

        <button
          type="button"
          class="primary-button"
          id="officialize-flag"
        >
          Oficializar nova bandeira
        </button>
      </div>
    </section>
  `;

  const canvas = document.querySelector("#flag-canvas");
  const context = canvas.getContext("2d");

  function createBlankFlag() {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = "#d1d5db";
    context.lineWidth = 2;
    context.strokeRect(
      1,
      1,
      canvas.width - 2,
      canvas.height - 2
    );
  }

  function saveSnapshot() {
    history.push(
      context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      )
    );

    if (history.length > 20) {
      history.shift();
    }
  }

  function getPointerPosition(event) {
    const rectangle =
      canvas.getBoundingClientRect();

    return {
      x:
        (event.clientX - rectangle.left) *
        (canvas.width / rectangle.width),

      y:
        (event.clientY - rectangle.top) *
        (canvas.height / rectangle.height)
    };
  }

  function configureContext() {
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth =
      selectedTool === "eraser" ? 28 : 12;

    context.strokeStyle =
      selectedTool === "eraser"
        ? "#ffffff"
        : selectedColor;

    context.fillStyle = selectedColor;
  }

  function drawShape(currentX, currentY) {
    if (!shapeSnapshot) {
      return;
    }

    context.putImageData(shapeSnapshot, 0, 0);
    configureContext();

    const width = currentX - startX;
    const height = currentY - startY;

    if (selectedTool === "rectangle") {
      context.fillRect(
        startX,
        startY,
        width,
        height
      );
    }

    if (selectedTool === "circle") {
      const centerX = startX + width / 2;
      const centerY = startY + height / 2;

      const radiusX = Math.abs(width / 2);
      const radiusY = Math.abs(height / 2);

      context.beginPath();

      context.ellipse(
        centerX,
        centerY,
        radiusX,
        radiusY,
        0,
        0,
        Math.PI * 2
      );

      context.fill();
    }
  }

  createBlankFlag();

  canvas.addEventListener(
    "pointerdown",
    (event) => {
      event.preventDefault();

      const position =
        getPointerPosition(event);

      saveSnapshot();

      drawing = true;
      startX = position.x;
      startY = position.y;

      canvas.setPointerCapture(
        event.pointerId
      );

      if (selectedTool !== "eraser") {
        colorUsage[selectedColor] =
          (colorUsage[selectedColor] ?? 0) + 1;
      }

      if (
        selectedTool === "rectangle" ||
        selectedTool === "circle"
      ) {
        shapeSnapshot =
          context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );

        return;
      }

      configureContext();
      context.beginPath();
      context.moveTo(position.x, position.y);
      context.lineTo(position.x, position.y);
      context.stroke();
    }
  );

  canvas.addEventListener(
    "pointermove",
    (event) => {
      if (!drawing) {
        return;
      }

      const position =
        getPointerPosition(event);

      if (
        selectedTool === "rectangle" ||
        selectedTool === "circle"
      ) {
        drawShape(position.x, position.y);
        return;
      }

      configureContext();
      context.lineTo(position.x, position.y);
      context.stroke();
    }
  );

  function stopDrawing(event) {
    if (!drawing) {
      return;
    }

    const position =
      getPointerPosition(event);

    if (
      selectedTool === "rectangle" ||
      selectedTool === "circle"
    ) {
      drawShape(position.x, position.y);
    }

    drawing = false;
    shapeSnapshot = null;
    context.closePath();
  }

  canvas.addEventListener(
    "pointerup",
    stopDrawing
  );

  canvas.addEventListener(
    "pointercancel",
    () => {
      drawing = false;
      shapeSnapshot = null;
    }
  );

  document
    .querySelectorAll(".flag-purpose")
    .forEach((button) => {
      button.addEventListener("click", () => {
        selectedPurpose =
          button.dataset.purpose;

        document
          .querySelectorAll(".flag-purpose")
          .forEach((item) => {
            item.classList.toggle(
              "selected",
              item === button
            );
          });
      });
    });

  document
    .querySelectorAll(".flag-tool")
    .forEach((button) => {
      button.addEventListener("click", () => {
        selectedTool = button.dataset.tool;

        document
          .querySelectorAll(".flag-tool")
          .forEach((item) => {
            item.classList.toggle(
              "selected",
              item === button
            );
          });
      });
    });

  document
    .querySelectorAll(".flag-color")
    .forEach((button) => {
      button.addEventListener("click", () => {
        selectedColor =
          button.dataset.color;

        document
          .querySelectorAll(".flag-color")
          .forEach((item) => {
            item.classList.toggle(
              "selected",
              item === button
            );
          });
      });
    });

  document
    .querySelector("#undo-flag")
    .addEventListener("click", () => {
      const previousState = history.pop();

      if (previousState) {
        context.putImageData(
          previousState,
          0,
          0
        );
      }
    });

  document
    .querySelector("#clear-flag")
    .addEventListener("click", () => {
      saveSnapshot();
      createBlankFlag();

      Object.keys(colorUsage).forEach(
        (color) => {
          delete colorUsage[color];
        }
      );
    });

  document
    .querySelector("#keep-current-flag")
    .addEventListener("click", () => {
      onComplete({
        flag: undefined,

        choice: {
          id: "keep-current-flag",
          text: "Manter a bandeira atual",

          resultText:
            "O governo decidiu preservar a bandeira. Tradicionalistas respiraram aliviados e designers perderam um contrato milionário.",

          effects: {
            indicators: {
              people: -1,
              congress: 3,
              stability: 5
            },

            factions: {
              military: 3
            },

            politics: {
              personalism: -2
            },

            corruption: 0,
            personalWealth: 0
          }
        }
      });
    });

  document
    .querySelector("#officialize-flag")
    .addEventListener("click", () => {
      const purpose =
        PURPOSES[selectedPurpose];

      const effects = createEmptyEffects();

      mergeEffects(effects, purpose.effects);

      const dominantColor =
        Object.entries(colorUsage).sort(
          (first, second) =>
            second[1] - first[1]
        )[0]?.[0];

      if (
        dominantColor &&
        COLOR_EFFECTS[dominantColor]
      ) {
        mergeEffects(
          effects,
          COLOR_EFFECTS[dominantColor]
        );
      }

      const motto = document
        .querySelector("#flag-motto")
        .value.trim();

      if (motto.length > 0) {
        effects.indicators.people =
          (effects.indicators.people ?? 0) + 2;
      }

      const image = canvas.toDataURL(
        "image/webp",
        0.72
      );

      onComplete({
        flag: {
          image,
          motto,
          purpose: selectedPurpose,
          dominantColor:
            dominantColor ?? selectedColor,
          createdAtDecision:
            gameState.government.decisions
        },

        choice: {
          id: `create-flag-${selectedPurpose}`,
          text: purpose.name,

          resultText: motto
            ? `${purpose.resultText} Sob ela, o novo lema nacional será: “${motto}”.`
            : `${purpose.resultText} O governo esqueceu apenas de escolher um lema.`,

          effects
        }
      });
    });
}