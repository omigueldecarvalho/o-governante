function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function numberValue(value, fallback = 0) {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
}

function clamp(value, minimum, maximum) {
  return Math.max(
    minimum,
    Math.min(maximum, value)
  );
}

export function isDebugMode() {
  const query = new URLSearchParams(
    window.location.search
  );

  return Boolean(
    import.meta.env?.DEV &&
    query.get("debug") === "1"
  );
}

function getDecisionLabel(decision) {
  const type = decision.type ?? "common";
  const title =
    decision.title ?? decision.id;

  return `[${type}] ${title}`;
}

function createDecisionOptions(decisions) {
  return [...decisions]
    .sort((first, second) =>
      getDecisionLabel(first).localeCompare(
        getDecisionLabel(second),
        "pt-BR"
      )
    )
    .map(
      (decision) => `
        <option value="${escapeHTML(
          decision.id
        )}">
          ${escapeHTML(
            getDecisionLabel(decision)
          )}
        </option>
      `
    )
    .join("");
}

function createEndingOptions(endings) {
  return Object.values(endings)
    .filter(Boolean)
    .map(
      (ending) => `
        <option value="${escapeHTML(
          ending.id
        )}">
          ${escapeHTML(
            `${ending.icon ?? "🏁"} ${
              ending.title ?? ending.id
            }`
          )}
        </option>
      `
    )
    .join("");
}

function createNumberField({
  id,
  label,
  value,
  minimum = 0,
  maximum = 100,
  step = 1
}) {
  return `
    <label class="debug-field" for="${id}">
      <span>${label}</span>

      <input
        type="number"
        id="${id}"
        value="${numberValue(value)}"
        min="${minimum}"
        max="${maximum}"
        step="${step}"
      >
    </label>
  `;
}

function readPanelState(panel) {
  const read = (selector, fallback = 0) =>
    numberValue(
      panel.querySelector(selector)?.value,
      fallback
    );

  return {
    indicators: {
      people: clamp(
        read("#debug-people", 50),
        0,
        100
      ),
      congress: clamp(
        read("#debug-congress", 50),
        0,
        100
      ),
      economy: clamp(
        read("#debug-economy", 50),
        0,
        100
      ),
      stability: clamp(
        read("#debug-stability", 50),
        0,
        100
      )
    },

    corruption: clamp(
      read("#debug-corruption", 0),
      0,
      100
    ),

    personalWealth: Math.max(
      0,
      read("#debug-wealth", 0)
    ),

    government: {
      decisionsTaken: Math.max(
        0,
        Math.round(
          read("#debug-decisions", 0)
        )
      ),
      year: Math.max(
        1,
        Math.round(
          read("#debug-year", 1)
        )
      ),
      month: clamp(
        Math.round(
          read("#debug-month", 1)
        ),
        1,
        12
      )
    }
  };
}

function setPanelMessage(
  panel,
  message,
  tone = "success"
) {
  const status = panel.querySelector(
    "#debug-panel-status"
  );

  if (!status) {
    return;
  }

  status.textContent = message;
  status.dataset.tone = tone;

  window.clearTimeout(
    setPanelMessage.timeoutId
  );

  setPanelMessage.timeoutId =
    window.setTimeout(() => {
      status.textContent = "";
      delete status.dataset.tone;
    }, 2800);
}

function fillStateFields(panel, gameState) {
  const setValue = (selector, value) => {
    const element =
      panel.querySelector(selector);

    if (element) {
      element.value = numberValue(value);
    }
  };

  setValue(
    "#debug-people",
    gameState?.indicators?.people ?? 50
  );
  setValue(
    "#debug-congress",
    gameState?.indicators?.congress ?? 50
  );
  setValue(
    "#debug-economy",
    gameState?.indicators?.economy ?? 50
  );
  setValue(
    "#debug-stability",
    gameState?.indicators?.stability ?? 50
  );
  setValue(
    "#debug-corruption",
    gameState?.corruption ?? 0
  );
  setValue(
    "#debug-wealth",
    gameState?.player?.personalWealth ?? 0
  );
  setValue(
    "#debug-decisions",
    gameState?.government?.decisionsTaken ?? 0
  );
  setValue(
    "#debug-year",
    gameState?.government?.year ?? 1
  );
  setValue(
    "#debug-month",
    gameState?.government?.month ?? 1
  );
}

function filterDecisionOptions(panel) {
  const search = String(
    panel.querySelector(
      "#debug-decision-search"
    )?.value ?? ""
  )
    .trim()
    .toLocaleLowerCase("pt-BR");

  const select = panel.querySelector(
    "#debug-decision-select"
  );

  if (!select) {
    return;
  }

  let firstVisibleOption = null;

  [...select.options].forEach(
    (option, index) => {
      if (index === 0) {
        return;
      }

      const visible =
        !search ||
        option.textContent
          .toLocaleLowerCase("pt-BR")
          .includes(search) ||
        option.value
          .toLocaleLowerCase("pt-BR")
          .includes(search);

      option.hidden = !visible;

      if (visible && !firstVisibleOption) {
        firstVisibleOption = option;
      }
    }
  );

  if (
    select.selectedOptions[0]?.hidden &&
    firstVisibleOption
  ) {
    select.value = firstVisibleOption.value;
  }
}

export function destroyDebugPanel() {
  const root = document.querySelector(
    "#game-debug-root"
  );

  root?.debugAbortController?.abort();
  root?.remove();

  document.body.classList.remove(
    "game-debug-enabled"
  );
}

export function installDebugPanel({
  getGameState,
  decisions = [],
  endings = {},
  onOpenDecision,
  onApplyState,
  onResetUsedDecisions,
  onForceEnding,
  onClearSave,
  onGoHome
} = {}) {
  if (!isDebugMode()) {
    destroyDebugPanel();
    return null;
  }

  destroyDebugPanel();

  const gameState =
    typeof getGameState === "function"
      ? getGameState()
      : null;

  const root = document.createElement("div");
  root.id = "game-debug-root";
  root.className = "game-debug-root";
  root.debugAbortController =
    new AbortController();

  root.innerHTML = `
    <button
      type="button"
      class="game-debug-trigger"
      id="open-game-debug"
      aria-label="Abrir painel de testes"
      aria-expanded="false"
    >
      🧪
    </button>

    <aside
      class="game-debug-panel"
      id="game-debug-panel"
      aria-hidden="true"
    >
      <header class="game-debug-header">
        <div>
          <small>Ambiente de desenvolvimento</small>
          <h2>Painel de testes</h2>
        </div>

        <button
          type="button"
          id="close-game-debug"
          aria-label="Fechar painel"
        >
          ✕
        </button>
      </header>

      <div class="game-debug-body">
        <section class="debug-section">
          <div class="debug-section-title">
            <span>🎲</span>
            <h3>Abrir evento</h3>
          </div>

          <label class="debug-field">
            <span>Pesquisar</span>
            <input
              type="search"
              id="debug-decision-search"
              placeholder="Nome, tipo ou ID"
            >
          </label>

          <label class="debug-field">
            <span>Decisão ou minigame</span>
            <select id="debug-decision-select">
              <option value="">
                Selecione um evento
              </option>
              ${createDecisionOptions(decisions)}
            </select>
          </label>

          <button
            type="button"
            class="debug-primary-button"
            id="debug-open-decision"
          >
            Abrir evento selecionado
          </button>
        </section>

        <section class="debug-section">
          <div class="debug-section-title">
            <span>📊</span>
            <h3>Estado da partida</h3>
          </div>

          <div class="debug-fields-grid">
            ${createNumberField({
              id: "debug-people",
              label: "Povo",
              value: gameState?.indicators?.people ?? 50
            })}

            ${createNumberField({
              id: "debug-congress",
              label: "Congresso",
              value: gameState?.indicators?.congress ?? 50
            })}

            ${createNumberField({
              id: "debug-economy",
              label: "Economia",
              value: gameState?.indicators?.economy ?? 50
            })}

            ${createNumberField({
              id: "debug-stability",
              label: "Estabilidade",
              value: gameState?.indicators?.stability ?? 50
            })}

            ${createNumberField({
              id: "debug-corruption",
              label: "Corrupção",
              value: gameState?.corruption ?? 0
            })}

            ${createNumberField({
              id: "debug-wealth",
              label: "Patrimônio",
              value:
                gameState?.player?.personalWealth ?? 0,
              maximum: 999999999,
              step: 10000
            })}

            ${createNumberField({
              id: "debug-decisions",
              label: "Decisões",
              value:
                gameState?.government?.decisionsTaken ?? 0,
              maximum: 999
            })}

            ${createNumberField({
              id: "debug-year",
              label: "Ano",
              value: gameState?.government?.year ?? 1,
              minimum: 1,
              maximum: 99
            })}

            ${createNumberField({
              id: "debug-month",
              label: "Mês",
              value: gameState?.government?.month ?? 1,
              minimum: 1,
              maximum: 12
            })}
          </div>

          <div class="debug-action-grid">
            <button
              type="button"
              class="debug-primary-button"
              id="debug-apply-state"
            >
              Aplicar valores
            </button>

            <button
              type="button"
              class="debug-secondary-button"
              id="debug-refresh-state"
            >
              Recarregar valores
            </button>
          </div>
        </section>

        <section class="debug-section">
          <div class="debug-section-title">
            <span>🏁</span>
            <h3>Finais</h3>
          </div>

          <label class="debug-field">
            <span>Final do jogo</span>
            <select id="debug-ending-select">
              <option value="">
                Selecione um final
              </option>
              ${createEndingOptions(endings)}
            </select>
          </label>

          <button
            type="button"
            class="debug-danger-button"
            id="debug-force-ending"
          >
            Forçar final selecionado
          </button>
        </section>

        <section class="debug-section">
          <div class="debug-section-title">
            <span>🧹</span>
            <h3>Manutenção</h3>
          </div>

          <div class="debug-action-grid">
            <button
              type="button"
              class="debug-secondary-button"
              id="debug-reset-used"
            >
              Liberar todos os eventos
            </button>

            <button
              type="button"
              class="debug-secondary-button"
              id="debug-go-home"
            >
              Voltar ao início
            </button>

            <button
              type="button"
              class="debug-danger-button"
              id="debug-clear-save"
            >
              Apagar save atual
            </button>
          </div>
        </section>

        <p
          class="debug-panel-status"
          id="debug-panel-status"
          role="status"
          aria-live="polite"
        ></p>
      </div>
    </aside>
  `;

  document.body.appendChild(root);
  document.body.classList.add(
    "game-debug-enabled"
  );

  const trigger = root.querySelector(
    "#open-game-debug"
  );
  const panel = root.querySelector(
    "#game-debug-panel"
  );
  const closeButton = root.querySelector(
    "#close-game-debug"
  );

  function setPanelOpen(open) {
    panel.classList.toggle("open", open);
    panel.setAttribute(
      "aria-hidden",
      String(!open)
    );
    trigger.setAttribute(
      "aria-expanded",
      String(open)
    );

    if (open) {
      const latestState =
        typeof getGameState === "function"
          ? getGameState()
          : null;

      fillStateFields(panel, latestState);
    }
  }

  trigger.addEventListener("click", () => {
    setPanelOpen(
      !panel.classList.contains("open")
    );
  });

  closeButton.addEventListener(
    "click",
    () => setPanelOpen(false)
  );

  panel
    .querySelector("#debug-decision-search")
    ?.addEventListener(
      "input",
      () => filterDecisionOptions(panel)
    );

  panel
    .querySelector("#debug-open-decision")
    ?.addEventListener("click", () => {
      const decisionId = panel.querySelector(
        "#debug-decision-select"
      )?.value;

      if (!decisionId) {
        setPanelMessage(
          panel,
          "Selecione um evento.",
          "error"
        );
        return;
      }

      if (
        typeof onOpenDecision !== "function"
      ) {
        setPanelMessage(
          panel,
          "Callback de evento não configurado.",
          "error"
        );
        return;
      }

      onOpenDecision(decisionId);
      setPanelOpen(false);
    });

  panel
    .querySelector("#debug-apply-state")
    ?.addEventListener("click", () => {
      if (
        typeof onApplyState !== "function"
      ) {
        setPanelMessage(
          panel,
          "Callback de estado não configurado.",
          "error"
        );
        return;
      }

      onApplyState(
        readPanelState(panel)
      );

      setPanelMessage(
        panel,
        "Estado atualizado."
      );
    });

  panel
    .querySelector("#debug-refresh-state")
    ?.addEventListener("click", () => {
      const latestState =
        typeof getGameState === "function"
          ? getGameState()
          : null;

      fillStateFields(panel, latestState);
      setPanelMessage(
        panel,
        "Valores recarregados."
      );
    });

  panel
    .querySelector("#debug-force-ending")
    ?.addEventListener("click", () => {
      const endingId = panel.querySelector(
        "#debug-ending-select"
      )?.value;

      if (!endingId) {
        setPanelMessage(
          panel,
          "Selecione um final.",
          "error"
        );
        return;
      }

      if (
        typeof onForceEnding !== "function"
      ) {
        setPanelMessage(
          panel,
          "Callback de final não configurado.",
          "error"
        );
        return;
      }

      onForceEnding(endingId);
      setPanelOpen(false);
    });

  panel
    .querySelector("#debug-reset-used")
    ?.addEventListener("click", () => {
      onResetUsedDecisions?.();
      setPanelMessage(
        panel,
        "Todos os eventos foram liberados."
      );
    });

  panel
    .querySelector("#debug-go-home")
    ?.addEventListener("click", () => {
      onGoHome?.();
      setPanelOpen(false);
    });

  panel
    .querySelector("#debug-clear-save")
    ?.addEventListener("click", () => {
      const confirmed = window.confirm(
        "Apagar o save atual? Esta ação não poderá ser desfeita."
      );

      if (!confirmed) {
        return;
      }

      onClearSave?.();
      setPanelOpen(false);
    });

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        panel.classList.contains("open")
      ) {
        setPanelOpen(false);
      }
    },
    { signal: root.debugAbortController.signal }
  );

  return root;
}
