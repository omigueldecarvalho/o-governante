import { GAME_CONFIG } from "../config/game-config.js";
import { IDEOLOGIES } from "../config/ideologies.js";

import {
  renderNationalFlag
} from "./national-flag.js";

function escapeHTML(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

export function renderHomeScreen({
  onStart,
  onResume,
  onHistory,
  hasSavedGame
}) {
  const app = document.querySelector("#app");

  app.innerHTML = `
    <section class="screen home-screen">
      <div class="game-symbol">🏛️</div>

      <p class="eyebrow">
        Um jogo de escolhas
      </p>

      <h1>${GAME_CONFIG.name}</h1>

      <p class="subtitle">
        ${GAME_CONFIG.subtitle}
      </p>

      <p class="introduction">
        Você chegou ao cargo mais poderoso do país.
        Agora precisará lidar com o povo, o Congresso,
        a economia e as próprias ambições.
      </p>

      ${
        hasSavedGame
          ? `
            <button
              type="button"
              class="primary-button"
              id="resume-game"
            >
              Continuar governo
            </button>
          `
          : ""
      }

      <button
        type="button"
        class="${
          hasSavedGame
            ? "secondary-button"
            : "primary-button"
        }"
        id="start-game"
      >
        ${
          hasSavedGame
            ? "Iniciar nova eleição"
            : "Iniciar candidatura"
        }
      </button>

      <button
        type="button"
        class="secondary-button"
        id="government-history"
      >
        Histórico de governos
      </button>
    </section>
  `;

  const startButton = document.querySelector(
    "#start-game"
  );

  const resumeButton = document.querySelector(
    "#resume-game"
  );

  const historyButton = document.querySelector(
    "#government-history"
  );

  if (startButton && typeof onStart === "function") {
    startButton.addEventListener(
      "click",
      onStart
    );
  }

  if (
    resumeButton &&
    typeof onResume === "function"
  ) {
    resumeButton.addEventListener(
      "click",
      onResume
    );
  }

  if (
    historyButton &&
    typeof onHistory === "function"
  ) {
    historyButton.addEventListener(
      "click",
      onHistory
    );
  }
}

export function renderCreateLeaderScreen({
  onSubmit,
  onBack
}) {
  const app = document.querySelector("#app");

  const ideologyOptions = IDEOLOGIES.map(
    (ideology) => `
      <option value="${ideology.id}">
        ${ideology.name}
      </option>
    `
  ).join("");

  app.innerHTML = `
    <section class="screen form-screen">
      <button
        type="button"
        class="back-button"
        id="back-button"
        aria-label="Voltar"
      >
        ← Voltar
      </button>

      <div class="form-header">
        <p class="eyebrow">
          Eleições nacionais
        </p>

        <h1>Crie seu governante</h1>

        <p class="subtitle">
          Seu discurso abre portas. Suas decisões
          mostrarão quem você realmente é.
        </p>
      </div>

      <form id="leader-form">
        <div class="form-group">
          <label for="leader-name">
            Nome do governante
          </label>

          <input
            type="text"
            id="leader-name"
            name="name"
            placeholder="Ex.: Miguel Carvalho"
            maxlength="40"
            required
          />
        </div>

        <div class="form-group">
          <label for="party-name">
            Nome do partido
          </label>

          <input
            type="text"
            id="party-name"
            name="partyName"
            placeholder="Ex.: Partido Popular Nacional"
            maxlength="50"
            required
          />
        </div>

        <div class="form-group">
          <label for="party-acronym">
            Sigla do partido
          </label>

          <input
            type="text"
            id="party-acronym"
            name="partyAcronym"
            placeholder="Ex.: PPN"
            maxlength="8"
            required
          />
        </div>

        <div class="form-group">
          <label for="candidate-number">
            Número do candidato
          </label>

          <input
            type="text"
            id="candidate-number"
            name="candidateNumber"
            placeholder="Ex.: 13"
            inputmode="numeric"
            pattern="[0-9]{2}"
            maxlength="2"
            required
          />
        </div>

        <div class="form-group">
          <label for="ideology">
            Posição política
          </label>

          <select
            id="ideology"
            name="ideology"
            required
          >
            <option value="">
              Selecione uma posição
            </option>

            ${ideologyOptions}
          </select>
        </div>

        <article
          class="ideology-description"
          id="ideology-description"
        >
          Selecione uma posição para visualizar
          suas características.
        </article>

        <button
          type="submit"
          class="primary-button"
        >
          Disputar a eleição
        </button>
      </form>
    </section>
  `;

  const form = document.querySelector(
    "#leader-form"
  );

  const ideologySelect =
    document.querySelector("#ideology");

  const description = document.querySelector(
    "#ideology-description"
  );

  const candidateNumberInput =
    document.querySelector(
      "#candidate-number"
    );

  candidateNumberInput?.addEventListener(
    "input",
    () => {
      candidateNumberInput.value =
        candidateNumberInput.value
          .replace(/\D/g, "")
          .slice(0, 2);
    }
  );

  ideologySelect?.addEventListener(
    "change",
    (event) => {
      const selectedIdeology =
        IDEOLOGIES.find(
          (ideology) =>
            ideology.id ===
            event.target.value
        );

      description.textContent =
        selectedIdeology
          ? selectedIdeology.description
          : "Selecione uma posição para visualizar suas características.";
    }
  );

  form?.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const formData = new FormData(form);

      const candidateNumber =
        formData
          .get("candidateNumber")
          .trim();

      if (!/^\d{2}$/.test(candidateNumber)) {
        window.alert(
          "O número do candidato deve possuir dois dígitos."
        );

        return;
      }

      onSubmit({
        name:
          formData.get("name").trim(),

        partyName:
          formData
            .get("partyName")
            .trim(),

        partyAcronym:
          formData
            .get("partyAcronym")
            .trim()
            .toUpperCase(),

        candidateNumber,

        ideology:
          formData.get("ideology")
      });
    }
  );

  document
    .querySelector("#back-button")
    ?.addEventListener(
      "click",
      onBack
    );
}

export function renderGovernmentScreen(
  gameState,
  onRestart,
  onContinue
) {
  const app = document.querySelector("#app");

  const ideology = IDEOLOGIES.find(
    (item) =>
      item.id ===
      gameState.player.initialIdeology
  );

  const playerName = escapeHTML(
    gameState.player.name
  );

  const partyName = escapeHTML(
    gameState.player.partyName
  );

  const partyAcronym = escapeHTML(
    gameState.player.partyAcronym
  );

  app.innerHTML = `
    <section class="screen government-screen">
      <div class="government-header">
        <p class="eyebrow">
          Posse presidencial
        </p>

        <h1>Presidente ${playerName}</h1>

        <p class="subtitle">
          ${partyName} — ${partyAcronym}
        </p>

        <span class="ideology-badge">
          ${
            ideology?.name ??
            "Sem posição definida"
          }
        </span>
      </div>

      ${renderNationalFlag(
  gameState.country?.flag,
  "header"
)}

      <div class="indicators-grid">
        ${createIndicator(
          "👥",
          "Povo",
          gameState.indicators.people
        )}

        ${createIndicator(
          "🏛️",
          "Congresso",
          gameState.indicators.congress
        )}

        ${createIndicator(
          "💰",
          "Economia",
          gameState.indicators.economy
        )}

        ${createIndicator(
          "🛡️",
          "Estabilidade",
          gameState.indicators.stability
        )}

        ${createIndicator(
          "⚠️",
          "Corrupção",
          gameState.corruption
        )}

        <article class="indicator-card">
          <span class="indicator-icon">
            💼
          </span>

          <div>
            <span class="indicator-name">
              Patrimônio
            </span>

            <strong class="wealth-value">
              ${formatCurrency(
                gameState.player.personalWealth
              )}
            </strong>
          </div>
        </article>
      </div>

      <article class="possession-message">
        <span class="character-avatar">
          🎖️
        </span>

        <div>
          <strong>
            Presidente do Congresso
          </strong>

          <p>
            Parabéns pela vitória, presidente.
            Esperamos que esteja preparado para
            cumprir suas promessas.
          </p>
        </div>
      </article>

      <button
        type="button"
        class="primary-button"
        id="continue-game"
      >
        Iniciar governo
      </button>

      <button
        type="button"
        class="secondary-button"
        id="restart-game"
      >
        Criar outro governante
      </button>
    </section>
  `;

  const continueButton = document.querySelector(
    "#continue-game"
  );

  const restartButton = document.querySelector(
    "#restart-game"
  );

  if (
    continueButton &&
    typeof onContinue === "function"
  ) {
    continueButton.addEventListener(
      "click",
      onContinue
    );
  }

  if (
    restartButton &&
    typeof onRestart === "function"
  ) {
    restartButton.addEventListener(
      "click",
      onRestart
    );
  }
}

function createIndicator(icon, name, value) {
  const safeValue = Math.max(
    0,
    Math.min(100, Number(value))
  );

  return `
    <article class="indicator-card">
      <span class="indicator-icon">${icon}</span>

      <div class="indicator-content">
        <div class="indicator-information">
          <span class="indicator-name">${name}</span>
          <strong>${safeValue}</strong>
        </div>

        <div class="indicator-track">
          <div
            class="indicator-progress"
            style="width: ${safeValue}%"
          ></div>
        </div>
      </div>
    </article>
  `;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value);
}