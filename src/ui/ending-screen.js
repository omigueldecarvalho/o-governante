import { IDEOLOGIES } from "../config/ideologies.js";

import {
  renderNationalFlag
} from "./national-flag.js";

import {
  calculateFinalIdeology,
  calculatePoliticalCoherence,
  generateEpithet,
  getIndicatorLabel
} from "../game/political-analysis.js";

import {
  createFinalReport
} from "../game/endings-engine.js";


import {
  downloadEndingCard,
  shareEndingCard
} from "./ending-share.js";

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value ?? 0);
}

function createTranslatedIndicator({
  icon,
  name,
  key,
  value
}) {
  return `
    <article class="translated-indicator">
      <div>
        <span>${icon}</span>

        <div>
          <small>${name}</small>
          <strong>${value}</strong>
        </div>
      </div>

      <p>
        ${getIndicatorLabel(key, value)}
      </p>
    </article>
  `;
}

export function renderEndingScreen({
  gameState,
  ending,
  onRestart,
  onHome
}) {
  const app =
    document.querySelector(
      "#app"
    );

  if (!app) {
    console.error(
      "Elemento #app não encontrado."
    );

    return;
  }

  const finalReport =
    gameState.finalReport ??
    createFinalReport(
      gameState,
      ending
    );

  /*
   * Derrota na eleição inicial:
   * não possui relatório de governo.
   */
  if (
    ending.id ===
    "initial-election-defeat"
  ) {
    app.innerHTML = `
      <section class="screen ending-screen">
        <div class="ending-icon">
          ${ending.icon}
        </div>

        <p class="eyebrow">
          Fim da campanha
        </p>

        <h1>${ending.title}</h1>

        ${renderNationalFlag(
          gameState.country?.flag,
          "ending"
        )}

        <p class="ending-description">
          ${ending.description}
        </p>

        <button
          type="button"
          class="primary-button"
          id="restart-after-ending"
        >
          Tentar outra eleição
        </button>

        <button
          type="button"
          class="secondary-button"
          id="return-home"
        >
          Voltar à tela inicial
        </button>
      </section>
    `;

    document
      .querySelector(
        "#restart-after-ending"
      )
      ?.addEventListener(
        "click",
        () => {
          if (
            typeof onRestart ===
            "function"
          ) {
            onRestart();
          }
        }
      );

    document
      .querySelector(
        "#return-home"
      )
      ?.addEventListener(
        "click",
        () => {
          if (
            typeof onHome ===
            "function"
          ) {
            onHome();
          }
        }
      );

    return;
  }

  const finalIdeology =
    calculateFinalIdeology(
      gameState
    );

  const coherence =
    calculatePoliticalCoherence(
      gameState,
      finalIdeology
    );

  const epithet =
    generateEpithet(
      gameState,
      finalIdeology
    );

  const initialIdeology =
    IDEOLOGIES.find(
      (ideology) =>
        ideology.id ===
        gameState.player
          .initialIdeology
    );

  const decisionsTaken =
    finalReport.government
      ?.decisionsTaken ?? 0;

  const durationLabel =
    finalReport.government
      ?.durationLabel ??
    "Tempo desconhecido";

  console.log(
    "Ideologia final:",
    finalIdeology
  );

  console.log(
    "Coerência política:",
    coherence
  );

  console.log(
    "Alcunha:",
    epithet
  );

  app.innerHTML = `
    <section class="screen ending-screen">
      <div class="ending-icon">
        ${ending.icon}
      </div>

      <p class="eyebrow">
        Fim de governo
      </p>

      <h1>${ending.title}</h1>

      <p class="ending-description">
        ${ending.description}
      </p>

      <article class="political-result">
        <p class="eyebrow">
          Como a história o conhecerá
        </p>

        <h2>${epithet}</h2>

        <div class="ideology-comparison">
          <div>
            <small>
              Ideologia prometida
            </small>

            <strong>
              ${
                initialIdeology?.name ??
                "Indefinida"
              }
            </strong>
          </div>

          <span class="ideology-arrow">
            →
          </span>

          <div>
            <small>
              Ideologia do governo
            </small>

            <strong>
              ${finalIdeology.name}
            </strong>
          </div>
        </div>

        <p class="final-ideology-description">
          ${finalIdeology.description}
        </p>

        <div class="coherence-result">
          <strong>
            ${coherence.title}
          </strong>

          <p>
            ${coherence.description}
          </p>
        </div>
      </article>

      <section class="government-evaluation">
        <p class="eyebrow">
          Avaliação do governo
        </p>

        <div class="translated-indicators">
          ${createTranslatedIndicator({
            icon: "👥",
            name: "Povo",
            key: "people",
            value:
              gameState.indicators
                .people
          })}

          ${createTranslatedIndicator({
            icon: "🏛️",
            name: "Congresso",
            key: "congress",
            value:
              gameState.indicators
                .congress
          })}

          ${createTranslatedIndicator({
            icon: "💰",
            name: "Economia",
            key: "economy",
            value:
              gameState.indicators
                .economy
          })}

          ${createTranslatedIndicator({
            icon: "🛡️",
            name: "Estabilidade",
            key: "stability",
            value:
              gameState.indicators
                .stability
          })}

          ${createTranslatedIndicator({
            icon: "⚠️",
            name: "Corrupção",
            key: "corruption",
            value:
              gameState.corruption
          })}
        </div>
      </section>

      <div class="ending-summary">
        <article>
          <small>
            Tempo no poder
          </small>

          <strong>
            ${durationLabel}
          </strong>
        </article>

        <article>
          <small>
            Decisões tomadas
          </small>

          <strong>
            ${decisionsTaken}
          </strong>
        </article>

        <article>
          <small>
            Corrupção
          </small>

          <strong>
            ${gameState.corruption}
          </strong>
        </article>

        <article>
          <small>
            Patrimônio pessoal
          </small>

          <strong>
            ${formatCurrency(
              gameState.player
                .personalWealth
            )}
          </strong>
        </article>
      </div>

      <div class="ending-share-actions">
        <button
          type="button"
          class="primary-button"
          id="share-ending"
        >
          📤 Compartilhar resultado
        </button>

        <button
          type="button"
          class="secondary-button"
          id="download-ending"
        >
          💾 Baixar imagem
        </button>
      </div>

      <button
        type="button"
        class="primary-button"
        id="restart-after-ending"
      >
        Jogar novamente
      </button>

      <button
        type="button"
        class="secondary-button"
        id="return-home"
      >
        Voltar à tela inicial
      </button>
    </section>
  `;

  const shareButton =
    document.querySelector(
      "#share-ending"
    );

  const downloadButton =
    document.querySelector(
      "#download-ending"
    );

  const restartButton =
    document.querySelector(
      "#restart-after-ending"
    );

  const homeButton =
    document.querySelector(
      "#return-home"
    );

  /*
   * Compartilhar
   */
  shareButton?.addEventListener(
    "click",
    async () => {
      const originalText =
        shareButton.textContent;

      shareButton.disabled = true;

      shareButton.textContent =
        "Gerando imagem...";

      try {
        const result =
          await shareEndingCard(
            gameState
          );

        console.log(
          "Compartilhamento:",
          result
        );
      } catch (error) {
        console.error(
          "Erro ao compartilhar:",
          error
        );

        window.alert(
          "Não foi possível compartilhar o resultado."
        );
      } finally {
        shareButton.disabled = false;

        shareButton.textContent =
          originalText;
      }
    }
  );

  /*
   * Baixar imagem
   */
  downloadButton?.addEventListener(
    "click",
    async () => {
      const originalText =
        downloadButton.textContent;

      downloadButton.disabled =
        true;

      downloadButton.textContent =
        "Gerando imagem...";

      try {
        const result =
          await downloadEndingCard(
            gameState
          );

        console.log(
          "Download:",
          result
        );
      } catch (error) {
        console.error(
          "Erro ao baixar imagem:",
          error
        );

        window.alert(
          "Não foi possível gerar a imagem do governo."
        );
      } finally {
        downloadButton.disabled =
          false;

        downloadButton.textContent =
          originalText;
      }
    }
  );

  if (
    restartButton &&
    typeof onRestart === "function"
  ) {
    restartButton.addEventListener(
      "click",
      onRestart
    );
  }

  if (
    homeButton &&
    typeof onHome === "function"
  ) {
    homeButton.addEventListener(
      "click",
      onHome
    );
  }
}