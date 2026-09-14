import {
  calculateFinalIdeology,
  generateEpithet,
  getIndicatorLabel
} from "../game/political-analysis.js";

import {
  renderNationalFlag
} from "./national-flag.js";

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value ?? 0);
}

function getHeadline(gameState) {
  const indicators = gameState.indicators;
  const corruption = gameState.corruption;
  const wealth =
    gameState.player.personalWealth;

  const authoritarianism =
    gameState.politicalProfile
      ?.authoritarianism ?? 0;

  if (
    corruption >= 50 &&
    wealth >= 1000000
  ) {
    return {
      title:
        "Presidente enriquece misteriosamente durante o mandato",

      subtitle:
        "Assessoria afirma que todo o patrimônio veio de palestras e investimentos."
    };
  }

  

  if (authoritarianism >= 50) {
    return {
      title:
        "Governo amplia poderes e promete que é apenas temporário",

      subtitle:
        "Especialistas lembram que tudo costuma começar dessa forma."
    };
  }

  if (indicators.people <= 30) {
    return {
      title:
        "Popularidade do governo procura novo fundo do poço",

      subtitle:
        "Presidente afirma que as pesquisas não refletem o sentimento das ruas."
    };
  }

  if (indicators.economy <= 30) {
    return {
      title:
        "Economia entra em modo de sobrevivência",

      subtitle:
        "Ministro garante que os números negativos são positivos quando analisados corretamente."
    };
  }

  if (indicators.congress <= 30) {
    return {
      title:
        "Congresso descobre que não gosta do presidente",

      subtitle:
        "Pedidos de impeachment já são utilizados como peso de papel."
    };
  }

  if (indicators.stability <= 30) {
    return {
      title:
        "Instituições passam mais uma semana por um fio",

      subtitle:
        "O fio, segundo o governo, continua perfeitamente resistente."
    };
  }

  if (indicators.economy >= 75) {
    return {
      title:
        "Economia cresce e governo reivindica até a chuva",

      subtitle:
        "Palácio afirma que o bom momento é resultado direto da liderança presidencial."
    };
  }

  if (indicators.people >= 75) {
    return {
      title:
        "Presidente se transforma em fenômeno popular",

      subtitle:
        "Aliados já discutem como colocar seu nome em praças, pontes e merendas."
    };
  }

  return {
    title:
      "Governo sobrevive a mais um ano sem destruir o país",

    subtitle:
      "Analistas classificam o resultado como surpreendentemente aceitável."
  };
}

function createReportIndicator(
  icon,
  name,
  key,
  value
) {
  return `
    <article class="annual-indicator">
      <span>${icon}</span>

      <div>
        <small>${name}</small>
        <strong>${value}</strong>

        <p>
          ${getIndicatorLabel(key, value)}
        </p>
      </div>
    </article>
  `;
}

export function renderAnnualReport({
  gameState,
  year,
  onContinue
}) {
  const app = document.querySelector("#app");

  const currentIdeology =
    calculateFinalIdeology(gameState);

  const epithet = generateEpithet(
    gameState,
    currentIdeology
  );

  const headline = getHeadline(gameState);

  app.innerHTML = `
    <section class="screen annual-report-screen">
      <article class="newspaper">
        <header class="newspaper-header">
          <div>
            <span>Edição especial</span>
            <span>Ano ${year}</span>
          </div>

          <h1>A Voz da República</h1>

          ${renderNationalFlag(
  gameState.country?.flag,
  "report"
)}
          <p>
            Informação quase independente
          </p>
        </header>

        <section class="newspaper-headline">
          <p class="eyebrow">
            Balanço do governo
          </p>

          <h2>${headline.title}</h2>

          <p>${headline.subtitle}</p>
        </section>

        <section class="current-president">
          <span>🏛️</span>

          <div>
            <small>
              Como o presidente está sendo chamado
            </small>

            <strong>${epithet}</strong>
          </div>
        </section>

        <div class="annual-ideology">
          <small>Ideologia atual do governo</small>

          <strong>
            ${currentIdeology.name}
          </strong>
        </div>

        <div class="annual-indicators">
          ${createReportIndicator(
            "👥",
            "Povo",
            "people",
            gameState.indicators.people
          )}

          ${createReportIndicator(
            "🏛️",
            "Congresso",
            "congress",
            gameState.indicators.congress
          )}

          ${createReportIndicator(
            "💰",
            "Economia",
            "economy",
            gameState.indicators.economy
          )}

          ${createReportIndicator(
            "🛡️",
            "Estabilidade",
            "stability",
            gameState.indicators.stability
          )}

          ${createReportIndicator(
            "⚠️",
            "Corrupção",
            "corruption",
            gameState.corruption
          )}
        </div>

        <footer class="newspaper-footer">
          <div>
            <small>Patrimônio presidencial</small>

            <strong>
              ${formatCurrency(
                gameState.player.personalWealth
              )}
            </strong>
          </div>

          <div>
            <small>Decisões tomadas</small>

            <strong>
              ${
                gameState.government
                  .decisionsTaken
              }
            </strong>
          </div>
        </footer>
      </article>

      <button
        type="button"
        class="primary-button"
        id="continue-annual-report"
      >
        Iniciar o próximo ano
      </button>
    </section>
  `;

  document
    .querySelector(
      "#continue-annual-report"
    )
    ?.addEventListener(
      "click",
      onContinue
    );
}