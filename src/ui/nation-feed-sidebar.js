function numberOrZero(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function getApprovalClass(
  approval
) {
  const value =
    numberOrZero(approval);

  if (value >= 70) {
    return "positive";
  }

  if (value <= 35) {
    return "negative";
  }

  return "neutral";
}

function createApprovalChange(
  change
) {
  const value =
    numberOrZero(change);

  if (value > 0) {
    return `
      <span class="feed-change positive">
        ▲ ${value}
      </span>
    `;
  }

  if (value < 0) {
    return `
      <span class="feed-change negative">
        ▼ ${Math.abs(value)}
      </span>
    `;
  }

  return `
    <span class="feed-change neutral">
      — 0
    </span>
  `;
}

function createEmptyFeed() {
  return `
    <div class="nation-feed-empty">
      <span>📡</span>

      <strong>
        Aguardando movimentações
      </strong>

      <p>
        A imprensa ainda está esperando
        o governo fazer alguma coisa.
      </p>
    </div>
  `;
}

function createReaction(
  reaction
) {
  return `
    <article class="feed-reaction">
      <span class="feed-avatar">
        ${reaction.avatar ?? "👤"}
      </span>

      <div>
        <strong>
          ${reaction.user ??
          "@cidadao"}
        </strong>

        <p>
          ${reaction.text ??
          "A população está acompanhando."}
        </p>
      </div>
    </article>
  `;
}


function createRivalResult(
  result
) {
  if (!result) {
    return "";
  }

  return `
    <div class="rival-response-result ${
      result.success
        ? "success"
        : "failure"
    }">
      <strong>
        ${result.icon}
        ${result.title}
      </strong>

      <p>
        ${result.message}
      </p>
    </div>
  `;
}

function createRivalAppearance(
  rival
) {
  if (!rival) {
    return "";
  }

  const popularityChange =
    Number(
      rival.popularityChange ?? 0
    );

  let changeHTML = "";

  if (popularityChange > 0) {
    changeHTML = `
      <span class="rival-change positive">
        ▲ ${popularityChange}
      </span>
    `;
  } else if (
    popularityChange < 0
  ) {
    changeHTML = `
      <span class="rival-change negative">
        ▼ ${Math.abs(
          popularityChange
        )}
      </span>
    `;
  }

  return `
    <article class="feed-rival-card">
      <header>
        <span class="feed-rival-avatar">
          ${rival.icon ?? "🎙️"}
        </span>

        <div>
          <small>
            Adversário político
          </small>

          <strong>
            ${rival.name}
          </strong>

          <span>
            ${rival.nickname}
          </span>
        </div>
      </header>

      <blockquote>
        “${rival.phrase}”
      </blockquote>

      ${
        rival.responded
          ? createRivalResult(
              rival.result
            )
          : `
            <div class="rival-actions">
              <button
                type="button"
                data-rival-response="ignore"
              >
                🙄 Ignorar
              </button>

              <button
                type="button"
                data-rival-response="rebut"
              >
                🔥 Rebater
              </button>

              <button
                type="button"
                data-rival-response="investigate"
              >
                🕵️ Investigar
              </button>
            </div>
          `
      }

      <footer>
        <span>
          Popularidade:
          <strong>
            ${rival.popularity}%
          </strong>
        </span>

        ${changeHTML}
      </footer>
    </article>
  `;
}

function createFeedContent(
  entry
) {
  const headline =
    entry?.headline ?? {};

  const reactions =
    Array.isArray(
      entry?.reactions
    )
      ? entry.reactions
      : [];

  const approval =
    Math.max(
      0,
      Math.min(
        100,
        numberOrZero(
          entry?.approval
        )
      )
    );

  const approvalClass =
    getApprovalClass(
      approval
    );

  return `
    <div class="nation-feed-live">
      <span class="live-dot"></span>
      AO VIVO
    </div>

    <article class="feed-headline-card">
      <div class="feed-outlet">
        <span>
          ${headline.icon ?? "📰"}
        </span>

        <strong>
          ${headline.outlet ??
          "Imprensa Nacional"}
        </strong>
      </div>

      <h3>
        ${headline.headline ??
        "Governo movimenta o país"}
      </h3>

      <p>
        ${headline.subtitle ?? ""}
      </p>
    </article>

${createRivalAppearance(
  entry?.rival
)}

<article class="feed-poll-card">
      <div>
        <small>
          Pesquisa Data-Papel
        </small>

        <strong>
          Aprovação do governo
        </strong>
      </div>

      <div class="feed-approval-value">
        <strong class="${approvalClass}">
          ${approval}%
        </strong>

        ${createApprovalChange(
          entry?.approvalChange
        )}
      </div>

      <div class="feed-approval-bar">
        <div
          class="${approvalClass}"
          style="width: ${approval}%"
        ></div>
      </div>
    </article>

    <div class="feed-trending">
      <small>
        Assunto do momento
      </small>

      <strong>
        ${entry?.hashtag ??
        "#OGovernante"}
      </strong>
    </div>

    <div class="feed-reactions">
      ${
        reactions.length > 0
          ? reactions
              .map(createReaction)
              .join("")
          : `
            <p class="feed-no-reactions">
              A internet ainda está
              preparando sua opinião.
            </p>
          `
      }
    </div>
  `;
}

export function renderNationFeedSidebar(
  gameState,
  onRivalResponse
) {
  let sidebar =
    document.querySelector(
      "#nation-feed-sidebar"
    );

  /*
   * Preserva o estado recolhido
   * durante as atualizações.
   */
  const wasCollapsed =
    sidebar?.classList.contains(
      "collapsed"
    ) ?? false;

  if (!sidebar) {
    sidebar =
      document.createElement(
        "aside"
      );

    sidebar.id =
      "nation-feed-sidebar";

    sidebar.className =
      "nation-feed-sidebar";

    document.body.appendChild(
      sidebar
    );
  }

  const history =
    Array.isArray(
      gameState?.government
        ?.nationFeed
        ?.history
    )
      ? gameState.government
          .nationFeed.history
      : [];

  const latestEntry =
    history[
      history.length - 1
    ];

  sidebar.innerHTML = `
    <header class="nation-feed-header">
      <div>
        <p class="eyebrow">
          Reação nacional
        </p>

        <h2>Feed da Nação</h2>
      </div>

    <button
  type="button"
  id="toggle-nation-feed"
  aria-label="${
    wasCollapsed
      ? "Abrir feed"
      : "Recolher feed"
  }"
>
  <span class="feed-toggle-icon">
    ${wasCollapsed
      ? "📰"
      : "×"}
  </span>

  <span class="feed-toggle-text">
    ${wasCollapsed
      ? "Feed da Nação"
      : ""}
  </span>
</button>
    </header>

    <div class="nation-feed-content">
      ${
        latestEntry
          ? createFeedContent(
              latestEntry
            )
          : createEmptyFeed()
      }
    </div>
  `;

  sidebar.classList.toggle(
    "collapsed",
    wasCollapsed
  );

   const toggleButton =
    sidebar.querySelector(
      "#toggle-nation-feed"
    );

  toggleButton?.addEventListener(
    "click",
    () => {
      const isCollapsed =
        sidebar.classList.toggle(
          "collapsed"
        );

      toggleButton.innerHTML =
        isCollapsed
          ? `
            <span class="feed-toggle-icon">
              📰
            </span>

            <span class="feed-toggle-text">
              Feed da Nação
            </span>
          `
          : `
            <span class="feed-toggle-icon">
              ×
            </span>
          `;

      toggleButton.setAttribute(
        "aria-label",
        isCollapsed
          ? "Abrir feed"
          : "Recolher feed"
      );
    }
  );

  /*
   * Delegação dos cliques.
   *
   * Funciona mesmo que o conteúdo
   * interno seja atualizado.
   */
  sidebar.onclick = (event) => {
      const eventTarget =
        event.target;

      if (
        !(eventTarget instanceof Element)
      ) {
        return;
      }

      const button =
        eventTarget.closest(
          "[data-rival-response]"
        );

      if (!button) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const responseId =
        button.getAttribute(
          "data-rival-response"
        );

      console.log(
        "Resposta ao rival:",
        responseId
      );

      if (
        typeof onRivalResponse !==
        "function"
      ) {
        console.error(
          "handleRivalResponse não foi passado para renderNationFeedSidebar."
        );

        return;
      }

      if (
        latestEntry?.rival
          ?.responded
      ) {
        return;
      }

      /*
       * Impede clique duplo enquanto
       * processa a resposta.
       */
      sidebar
        .querySelectorAll(
          "[data-rival-response]"
        )
        .forEach(
          (rivalButton) => {
            rivalButton.disabled =
              true;
          }
        );

      try {
        const responseResult =
          onRivalResponse(
            responseId,
            latestEntry
          );

        /*
         * Também aceita callbacks
         * assíncronos. Se houver erro,
         * libera os botões novamente.
         */
        if (
          responseResult &&
          typeof responseResult.then ===
            "function"
        ) {
          responseResult.catch(
            (error) => {
              console.error(
                "Erro ao responder ao rival:",
                error
              );

              sidebar
                .querySelectorAll(
                  "[data-rival-response]"
                )
                .forEach(
                  (rivalButton) => {
                    rivalButton.disabled =
                      false;
                  }
                );
            }
          );
        }
      } catch (error) {
        console.error(
          "Erro ao responder ao rival:",
          error
        );

        sidebar
          .querySelectorAll(
            "[data-rival-response]"
          )
          .forEach(
            (rivalButton) => {
              rivalButton.disabled =
                false;
            }
          );
      }
    };

  document.body.classList.add(
    "nation-feed-visible"
  );
}

export function removeNationFeedSidebar() {
  const sidebar =
    document.querySelector(
      "#nation-feed-sidebar"
    );

  if (sidebar) {
    sidebar.remove();
  }

  document.body.classList.remove(
    "nation-feed-visible"
  );
}
