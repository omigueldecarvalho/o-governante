import { IDEOLOGIES } from "../config/ideologies.js";
import { ENDINGS } from "../data/endings.js";

function escapeHTML(value) {
  const element = document.createElement("div");

  element.textContent = String(value ?? "");

  return element.innerHTML;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value ?? 0);
}

function getIdeologyName(ideologyId) {
  const ideology = IDEOLOGIES.find(
    (item) => item.id === ideologyId
  );

  return ideology?.name ?? "Não identificada";
}

function getEnding(endingId) {
  return Object.values(ENDINGS).find(
    (ending) => ending.id === endingId
  );
}

function formatGovernmentTime(government) {
  const totalMonths =
    government.decisionsTaken ?? 0;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) {
    return `${months} ${months === 1 ? "mês" : "meses"}`;
  }

  if (months === 0) {
    return `${years} ${years === 1 ? "ano" : "anos"}`;
  }

  return `${years} ${years === 1 ? "ano" : "anos"} e ${months} meses`;
}

function formatDate(value) {
  if (!value) {
    return "Data indisponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function createIndicator(
  icon,
  name,
  value,
  inverted = false
) {
  const numericValue = Number(value ?? 0);

  let statusClass = "medium";

  if (inverted) {
    if (numericValue <= 25) {
      statusClass = "good";
    } else if (numericValue >= 70) {
      statusClass = "bad";
    }
  } else if (numericValue >= 70) {
    statusClass = "good";
  } else if (numericValue <= 25) {
    statusClass = "bad";
  }

  return `
    <div class="history-indicator ${statusClass}">
      <span>${icon}</span>

      <small>${name}</small>

      <strong>${numericValue}</strong>
    </div>
  `;
}

function createGovernmentCard(record) {
  const ending = getEnding(record.ending);

  const leaderName = escapeHTML(
    record.player.name
  );

  const partyName = escapeHTML(
    record.player.partyName
  );

  const partyAcronym = escapeHTML(
    record.player.partyAcronym
  );

  return `
    <article class="government-history-card">
      <header class="history-card-header">
        <div>
          <span class="history-ending-icon">
            ${ending?.icon ?? "🏛️"}
          </span>

          <div>
            <h2>${leaderName}</h2>

            <p>
              ${partyName} — ${partyAcronym}
            </p>
          </div>
        </div>

        <span class="history-ideology">
          ${getIdeologyName(
            record.player.ideology
          )}
        </span>
      </header>

      <div class="history-ending">
        <small>Fim do governo</small>

        <strong>
          ${ending?.title ?? "Governo encerrado"}
        </strong>
      </div>

      <div class="history-information">
        <div>
          <small>Tempo no poder</small>

          <strong>
            ${formatGovernmentTime(
              record.government
            )}
          </strong>
        </div>

        <div>
          <small>Patrimônio</small>

          <strong class="history-wealth">
            ${formatCurrency(
              record.player.personalWealth
            )}
          </strong>
        </div>
      </div>

      <div class="history-indicators">
        ${createIndicator(
          "👥",
          "Povo",
          record.indicators.people
        )}

        ${createIndicator(
          "🏛️",
          "Congresso",
          record.indicators.congress
        )}

        ${createIndicator(
          "💰",
          "Economia",
          record.indicators.economy
        )}

        ${createIndicator(
          "🛡️",
          "Estabilidade",
          record.indicators.stability
        )}

        ${createIndicator(
          "⚠️",
          "Corrupção",
          record.corruption,
          true
        )}
      </div>

      <footer class="history-card-footer">
        Encerrado em ${formatDate(record.endedAt)}
      </footer>
    </article>
  `;
}

export function renderGovernmentHistory({
  history,
  onBack,
  onClear
}) {
  const app = document.querySelector("#app");

  const cards = history
    .map(createGovernmentCard)
    .join("");

  app.innerHTML = `
    <section class="screen history-screen">
      <button
        type="button"
        class="back-button"
        id="back-from-history"
      >
        ← Voltar
      </button>

      <header class="history-header">
        <p class="eyebrow">
          Arquivo nacional
        </p>

        <h1>Governos anteriores</h1>

        <p class="subtitle">
          Conheça o legado deixado por cada
          governante.
        </p>
      </header>

      ${
        history.length
          ? `
            <div class="government-history-list">
              ${cards}
            </div>

            <button
              type="button"
              class="danger-button"
              id="clear-history"
            >
              Apagar histórico
            </button>
          `
          : `
            <article class="empty-history">
              <span>📂</span>

              <h2>Nenhum governo registrado</h2>

              <p>
                Os governos encerrados aparecerão
                aqui.
              </p>
            </article>
          `
      }
    </section>
  `;

  document
    .querySelector("#back-from-history")
    .addEventListener("click", onBack);

  const clearButton = document.querySelector(
    "#clear-history"
  );

  if (clearButton) {
    clearButton.addEventListener(
      "click",
      onClear
    );
  }
}