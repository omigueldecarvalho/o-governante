function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createApprovalChangeHTML(
  change
) {
  if (change > 0) {
    return `
      <span class="approval-change positive">
        ▲ ${change} pontos
      </span>
    `;
  }

  if (change < 0) {
    return `
      <span class="approval-change negative">
        ▼ ${Math.abs(change)} pontos
      </span>
    `;
  }

  return `
    <span class="approval-change neutral">
      ● Sem alteração
    </span>
  `;
}

export function renderNationFeed({
  gameState,
  entry,
  onContinue
}) {
  const app =
    document.querySelector("#app");

  if (!entry) {
    console.error(
      "Entrada do Feed da Nação não recebida."
    );

    onContinue?.();
    return;
  }

  const headline =
    entry.headline ?? {};

  const reactions =
    entry.reactions ?? [];

  app.innerHTML = `
    <section class="screen nation-feed-screen">
      <header class="nation-feed-header">
        <div>
          <p class="eyebrow">
            Repercussão nacional
          </p>

          <h1>
            Feed da Nação
          </h1>

          <p>
            Ano ${entry.year}
            · Mês ${entry.month}
            · Após ${entry.decision}
            decisões
          </p>
        </div>

        <div class="live-badge">
          <span></span>
          AO VIVO
        </div>
      </header>

      <div class="nation-feed-layout">
        <article class="newspaper-card">
          <header>
            <span>
              ${headline.icon ?? "📰"}
            </span>

            <div>
              <small>
                Edição extraordinária
              </small>

              <strong>
                ${escapeHTML(
                  headline.outlet ??
                    "Jornal Nacionalista"
                )}
              </strong>
            </div>
          </header>

          <div class="newspaper-content">
            <h2>
              ${escapeHTML(
                headline.headline ??
                  "Governo vira notícia novamente"
              )}
            </h2>

            <p>
              ${escapeHTML(
                headline.subtitle ??
                  "A população aguarda explicações."
              )}
            </p>
          </div>

          <footer>
            <span>
              Política
            </span>

            <span>
              Governo
            </span>

            <span>
              Confusão
            </span>
          </footer>
        </article>

        <aside class="approval-poll-card">
          <header>
            <div>
              <small>
                Pesquisa Data-Papel
              </small>

              <h2>
                Aprovação do governo
              </h2>
            </div>

            <span>📊</span>
          </header>

          <div class="approval-number">
            <strong>
              ${entry.approval}%
            </strong>

            ${createApprovalChangeHTML(
              entry.approvalChange
            )}
          </div>

          <div class="approval-track">
            <div
              style="width: ${entry.approval}%"
            ></div>
          </div>

          <div class="approval-scale">
            <span>0%</span>
            <span>100%</span>
          </div>

          <p>
            Margem de erro: o suficiente
            para todos comemorarem.
          </p>
        </aside>
      </div>

      <section class="trending-section">
        <div class="trending-icon">
          🔥
        </div>

        <div>
          <small>
            Assunto mais comentado
          </small>

          <strong>
            ${escapeHTML(
              entry.hashtag
            )}
          </strong>
        </div>

        <span class="trending-position">
          #1
        </span>
      </section>

      <section class="social-reactions">
        <header>
          <h2>
            O país está comentando
          </h2>

          <span>
            comentários verificados*
          </span>
        </header>

        <div class="social-reactions-list">
          ${reactions
            .map(
              (reaction) => `
                <article class="social-reaction">
                  <span class="reaction-avatar">
                    ${reaction.avatar}
                  </span>

                  <div>
                    <strong>
                      ${escapeHTML(
                        reaction.user
                      )}
                    </strong>

                    <p>
                      ${escapeHTML(
                        reaction.text
                      )}
                    </p>

                    <footer>
                      <span>♡ Curtir</span>
                      <span>↗ Compartilhar</span>
                    </footer>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>

        <small class="feed-disclaimer">
          * Verificados por ninguém.
        </small>
      </section>

      <button
        type="button"
        class="primary-button"
        id="continue-after-feed"
      >
        Voltar ao governo
      </button>
    </section>
  `;

  document
    .querySelector(
      "#continue-after-feed"
    )
    ?.addEventListener(
      "click",
      () => {
        onContinue?.();
      }
    );
}