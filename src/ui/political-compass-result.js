function clamp(
  value,
  minimum = 0,
  maximum = 100
) {
  return Math.max(
    minimum,
    Math.min(
      maximum,
      Number(value ?? 0)
    )
  );
}

function getResultValue(
  result,
  key,
  fallback = 50
) {
  const value =
    result.percentages?.[key] ??
    result.profile?.[key] ??
    result[key];

  return clamp(
    value ?? fallback
  );
}

function createResultBar({
  icon,
  label,
  value,
  leftLabel,
  rightLabel
}) {
  return `
    <article class="compass-result-axis">
      <header>
        <span>
          ${icon} ${label}
        </span>

        <strong>${value}%</strong>
      </header>

      <div class="compass-axis-bar">
        <div
          class="compass-axis-marker"
          style="left: ${value}%"
        ></div>
      </div>

      <footer>
        <small>${leftLabel}</small>
        <small>${rightLabel}</small>
      </footer>
    </article>
  `;
}

export function renderPoliticalCompassResult({
  result,
  onUseInGame,
  onRestart,
  onShare,
  onDownload,
  onHome
}) {
  const app =
    document.querySelector("#app");

  if (!app) {
    console.error(
      "Elemento #app não encontrado."
    );

    return;
  }

  if (!result) {
    console.error(
      "Resultado da bússola não recebido."
    );

    return;
  }

  const ideologyName =
    result.ideology?.name ??
    result.ideologyName ??
    result.name ??
    "Orientação indefinida";

  const ideologyDescription =
    result.ideology?.description ??
    result.description ??
    "Suas respostas formaram uma combinação política difícil de explicar até para o Congresso.";

  const epithet =
    result.epithet ??
    result.title ??
    "O Eleitor Misterioso";

  const economicPosition =
    getResultValue(
      result,
      "economicPosition"
    );

  const socialPosition =
    getResultValue(
      result,
      "socialPosition"
    );

  const authoritarianism =
    getResultValue(
      result,
      "authoritarianism"
    );

  const popularParticipation =
    getResultValue(
      result,
      "popularParticipation"
    );

  const personalism =
    getResultValue(
      result,
      "personalism"
    );

  app.innerHTML = `
    <section
      class="screen political-compass-result-screen"
    >
      <header class="compass-result-header">
        <div class="compass-result-icon">
          🧭
        </div>

        <p class="eyebrow">
          Bússola do Governante
        </p>

        <h1>
          ${ideologyName}
        </h1>

        <p class="compass-result-epithet">
          “${epithet}”
        </p>

        <p class="subtitle">
          ${ideologyDescription}
        </p>
      </header>

      <section class="compass-result-profile">
        <p class="eyebrow">
          Seu perfil político
        </p>

        ${createResultBar({
          icon: "💰",
          label: "Economia",
          value: economicPosition,
          leftLabel: "Esquerda",
          rightLabel: "Direita"
        })}

        ${createResultBar({
          icon: "🌈",
          label: "Costumes",
          value: socialPosition,
          leftLabel: "Progressista",
          rightLabel: "Conservador"
        })}

        ${createResultBar({
          icon: "⚖️",
          label: "Autoridade",
          value: authoritarianism,
          leftLabel: "Libertário",
          rightLabel: "Autoritário"
        })}

        ${createResultBar({
          icon: "🗳️",
          label: "Participação",
          value: popularParticipation,
          leftLabel: "Representativa",
          rightLabel: "Direta"
        })}

        ${createResultBar({
          icon: "🏛️",
          label: "Poder",
          value: personalism,
          leftLabel: "Instituições",
          rightLabel: "Líder forte"
        })}
      </section>

      <article class="compass-disclaimer">
        <span>🧪</span>

        <p>
          Este teste é uma sátira política
          e não possui finalidade científica,
          psicológica ou eleitoral.
        </p>
      </article>

      <div class="compass-result-actions">
        <button
          type="button"
          class="primary-button"
          id="use-compass-result"
        >
          Usar esta ideologia no jogo
        </button>

        <button
          type="button"
          class="secondary-button"
          id="share-compass-result"
        >
          📤 Compartilhar resultado
        </button>

        <button
          type="button"
          class="secondary-button"
          id="download-compass-result"
        >
          💾 Baixar imagem
        </button>

        <button
          type="button"
          class="secondary-button"
          id="restart-compass"
        >
          Refazer teste
        </button>

        <button
          type="button"
          class="secondary-button"
          id="return-compass-home"
        >
          Voltar ao início
        </button>
      </div>
    </section>
  `;

  const useButton =
    document.querySelector(
      "#use-compass-result"
    );

  const shareButton =
    document.querySelector(
      "#share-compass-result"
    );

  const downloadButton =
    document.querySelector(
      "#download-compass-result"
    );

  const restartButton =
    document.querySelector(
      "#restart-compass"
    );

  const homeButton =
    document.querySelector(
      "#return-compass-home"
    );

  if (
    useButton &&
    typeof onUseInGame === "function"
  ) {
    useButton.addEventListener(
      "click",
      onUseInGame
    );
  }

  if (
    shareButton &&
    typeof onShare === "function"
  ) {
    shareButton.addEventListener(
      "click",
      async () => {
        shareButton.disabled = true;
        shareButton.textContent =
          "Gerando resultado...";

        try {
          await onShare(result);
        } finally {
          shareButton.disabled = false;
          shareButton.textContent =
            "📤 Compartilhar resultado";
        }
      }
    );
  }

  if (
    downloadButton &&
    typeof onDownload === "function"
  ) {
    downloadButton.addEventListener(
      "click",
      async () => {
        downloadButton.disabled = true;
        downloadButton.textContent =
          "Gerando imagem...";

        try {
          await onDownload(result);
        } finally {
          downloadButton.disabled =
            false;

          downloadButton.textContent =
            "💾 Baixar imagem";
        }
      }
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