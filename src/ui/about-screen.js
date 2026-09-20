import {
  PROJECT_INFO
} from "../config/project-info.js";

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createSocialLinks() {
  const availableLinks =
    PROJECT_INFO.socialLinks.filter(
      (social) =>
        typeof social.url === "string" &&
        social.url.trim() !== ""
    );

  if (availableLinks.length === 0) {
    return `
      <p class="about-empty-text">
        As redes sociais serão divulgadas em breve.
      </p>
    `;
  }

  return availableLinks
    .map(
      (social) => `
        <a
          class="about-social-link"
          href="${escapeHTML(social.url)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span aria-hidden="true">
            ${social.icon}
          </span>

          <strong>
            ${escapeHTML(social.label)}
          </strong>

          <span aria-hidden="true">↗</span>
        </a>
      `
    )
    .join("");
}

function createSupportContent() {
  const pixKey =
    PROJECT_INFO.support.pixKey.trim();

  if (!pixKey) {
    return `
      <div class="about-support-pending">
        <span aria-hidden="true">🌱</span>

        <div>
          <strong>Apoio em preparação</strong>

          <p>
            A chave Pix do projeto será disponibilizada
            em breve.
          </p>
        </div>
      </div>
    `;
  }

  return `
    <div class="about-pix-layout">
      <div class="about-qr-wrapper">
        <img
          id="about-pix-qr"
          class="about-pix-qr"
          src="${escapeHTML(
            PROJECT_INFO.support.qrCodePath
          )}"
          alt="QR Code para apoiar O Governante via Pix"
        >

        <div
          class="about-qr-fallback"
          id="about-qr-fallback"
          hidden
        >
          <span>📱</span>
          <small>Use a chave Pix</small>
        </div>
      </div>

      <div class="about-pix-information">
        <small>Chave Pix</small>

        <code id="about-pix-key">
          ${escapeHTML(pixKey)}
        </code>

        <button
          type="button"
          class="primary-button about-copy-pix"
          id="copy-about-pix"
        >
          📋 Copiar chave Pix
        </button>

        <p
          class="about-copy-status"
          id="about-copy-status"
          role="status"
          aria-live="polite"
        ></p>
      </div>
    </div>
  `;
}

async function copyText(value) {
  if (
    navigator.clipboard &&
    window.isSecureContext
  ) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea =
    document.createElement("textarea");

  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";

  document.body.appendChild(textArea);
  textArea.select();

  const copied =
    document.execCommand("copy");

  textArea.remove();

  if (!copied) {
    throw new Error(
      "Não foi possível copiar a chave Pix."
    );
  }
}

export function renderAboutScreen({
  onBack
} = {}) {
  const app =
    document.querySelector("#app");

  if (!app) {
    console.error(
      "Elemento #app não encontrado."
    );
    return;
  }

  app.innerHTML = `
    <section class="screen about-screen">
      <header class="about-hero">
        <div class="about-hero-icon">🏛️</div>

        <div>
          <p class="eyebrow">
            Sobre o projeto
          </p>

          <h1>${escapeHTML(PROJECT_INFO.name)}</h1>

          <p class="about-version">
            Versão ${escapeHTML(PROJECT_INFO.version)}
          </p>
        </div>
      </header>

      <article class="about-card about-project-card">
        <span class="about-card-icon">🎮</span>

        <div>
          <h2>Governar parecia fácil</h2>

          <p>
            ${escapeHTML(PROJECT_INFO.description)}
          </p>
        </div>
      </article>

      <article class="about-card about-credits-card">
        <span class="about-card-icon">🛠️</span>

        <div>
          <p class="eyebrow">Créditos</p>

          <h2>${escapeHTML(
            PROJECT_INFO.creator.name
          )}</h2>

          <p>
            ${escapeHTML(
              PROJECT_INFO.creator.credit
            )}
          </p>
        </div>
      </article>

      <section class="about-section">
        <div class="about-section-heading">
          <span>🔗</span>

          <div>
            <p class="eyebrow">Acompanhe</p>
            <h2>Redes do projeto</h2>
          </div>
        </div>

        <div class="about-social-grid">
          ${createSocialLinks()}
        </div>
      </section>

      <section class="about-section about-support-section">
        <div class="about-section-heading">
          <span>💚</span>

          <div>
            <p class="eyebrow">Apoie o projeto</p>
            <h2>Mantenha o país funcionando</h2>
          </div>
        </div>

        <p class="about-support-message">
          ${escapeHTML(
            PROJECT_INFO.support.message
          )}
        </p>

        ${createSupportContent()}
      </section>

      <details class="about-disclaimer">
        <summary>
          Aviso sobre sátira e personagens
        </summary>

        <p>
          ${escapeHTML(PROJECT_INFO.disclaimer)}
        </p>
      </details>

      <button
        type="button"
        class="secondary-button about-back-button"
        id="return-from-about"
      >
        ← Voltar à tela inicial
      </button>
    </section>
  `;

  document
    .querySelector("#return-from-about")
    ?.addEventListener("click", () => {
      if (typeof onBack === "function") {
        onBack();
      }
    });

  const pixKey =
    PROJECT_INFO.support.pixKey.trim();

  const copyButton =
    document.querySelector(
      "#copy-about-pix"
    );

  const copyStatus =
    document.querySelector(
      "#about-copy-status"
    );

  copyButton?.addEventListener(
    "click",
    async () => {
      copyButton.disabled = true;

      try {
        await copyText(pixKey);

        copyButton.textContent =
          "✅ Chave copiada";

        if (copyStatus) {
          copyStatus.textContent =
            "Chave Pix copiada para a área de transferência.";
        }
      } catch (error) {
        console.error(error);

        copyButton.textContent =
          "Não foi possível copiar";

        if (copyStatus) {
          copyStatus.textContent =
            "Selecione e copie a chave exibida acima.";
        }
      } finally {
        window.setTimeout(() => {
          copyButton.disabled = false;
          copyButton.textContent =
            "📋 Copiar chave Pix";
        }, 2200);
      }
    }
  );

  const qrImage =
    document.querySelector(
      "#about-pix-qr"
    );

  qrImage?.addEventListener(
    "error",
    () => {
      qrImage.hidden = true;

      const fallback =
        document.querySelector(
          "#about-qr-fallback"
        );

      if (fallback) {
        fallback.hidden = false;
      }
    }
  );
}
