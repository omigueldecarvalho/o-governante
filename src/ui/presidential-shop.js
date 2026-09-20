import {
  PRESIDENTIAL_SHOP_ITEMS,
  SHOP_CATEGORIES
} from "../data/presidential-shop.js";

import {
  ensureFinancialState,
  getFinancialSummary,
  registerPurchase
} from "../game/finance-engine.js";

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatCurrency(value) {
  return Number(value ?? 0)
    .toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    );
}

function meetsRequirements(
  gameState,
  item
) {
  const requirements =
    item.requirements ?? {};

  const minimumCorruption =
    requirements.minimumCorruption ?? 0;

  return (
    Number(
      gameState.corruption ?? 0
    ) >= minimumCorruption
  );
}

export function renderPresidentialShop({
  gameState,
  onPurchase,
  onClose
}) {
  ensureFinancialState(gameState);

  document
    .querySelector(
      "#presidential-shop-overlay"
    )
    ?.remove();

  let selectedCategory = "all";
  let messageTimeout = null;

  const overlay =
    document.createElement("div");

  overlay.id =
    "presidential-shop-overlay";

  overlay.className =
    "presidential-shop-overlay";

  overlay.innerHTML = `
    <section class="presidential-shop-modal">
      <header class="shop-header">
        <div>
          <p class="eyebrow">
            Consumo no Planalto
          </p>

          <h1>
            Shopping Presidencial
          </h1>

          <p>
            Gaste seu salário, forme patrimônio
            e tente não chamar atenção demais.
          </p>
        </div>

        <button
          type="button"
          class="shop-close-button"
          id="close-presidential-shop"
          aria-label="Fechar shopping"
        >
          ✕
        </button>
      </header>

      <div class="shop-financial-summary">
        <article>
          <small>Saldo disponível</small>

          <strong id="shop-current-balance">
            ${formatCurrency(
              gameState.player
                .personalWealth
            )}
          </strong>
        </article>

        <article>
          <small>Bens adquiridos</small>

          <strong id="shop-assets-count">
            0
          </strong>
        </article>

        <article>
          <small>Patrimônio suspeito</small>

          <strong
            id="shop-unexplained-wealth"
          >
            R$ 0,00
          </strong>
        </article>
      </div>

      <nav
        class="shop-categories"
        id="shop-categories"
      >
        <button
          type="button"
          class="shop-category active"
          data-category="all"
        >
          🛍️ Todos
        </button>

        ${Object.entries(
          SHOP_CATEGORIES
        )
          .map(
            ([categoryId, category]) => `
              <button
                type="button"
                class="shop-category"
                data-category="${categoryId}"
              >
                ${category.icon}

                ${escapeHTML(
                  category.label
                )}
              </button>
            `
          )
          .join("")}
      </nav>

      <div
        class="shop-message"
        id="shop-message"
      ></div>

      <div
        class="shop-products"
        id="shop-products"
      ></div>

      <footer class="shop-footer">
        <p>
          Bens, presentes e favores poderão
          ser utilizados por jornalistas,
          investigadores e adversários.
        </p>

        <button
          type="button"
          class="primary-button"
          id="finish-shopping"
        >
          Voltar ao governo
        </button>
      </footer>
    </section>
  `;

  document.body.appendChild(
    overlay
  );

  const productsElement =
    overlay.querySelector(
      "#shop-products"
    );

  const messageElement =
    overlay.querySelector(
      "#shop-message"
    );

  function updateSummary() {
    const summary =
      getFinancialSummary(
        gameState
      );

    overlay.querySelector(
      "#shop-current-balance"
    ).textContent =
      formatCurrency(
        summary.balance
      );

    overlay.querySelector(
      "#shop-assets-count"
    ).textContent =
      summary.assetsCount;

    overlay.querySelector(
      "#shop-unexplained-wealth"
    ).textContent =
      formatCurrency(
        summary.unexplainedWealth
      );
  }

  function showMessage(
    message,
    type = "success"
  ) {
    window.clearTimeout(
      messageTimeout
    );

    messageElement.innerHTML = `
      <div class="
        shop-feedback
        ${type}
      ">
        ${escapeHTML(message)}
      </div>
    `;

    messageTimeout =
      window.setTimeout(() => {
        messageElement.innerHTML = "";
      }, 4000);
  }

  function renderProducts() {
    const purchasedIds =
      gameState.player.finances
        .assets.map(
          (asset) => asset.id
        );

    const visibleItems =
      PRESIDENTIAL_SHOP_ITEMS.filter(
        (item) =>
          selectedCategory === "all" ||
          item.category ===
            selectedCategory
      );

    productsElement.innerHTML =
      visibleItems
        .map((item) => {
          const purchased =
            purchasedIds.includes(
              item.id
            );

          const unlocked =
            meetsRequirements(
              gameState,
              item
            );

          const canAfford =
            gameState.player
              .personalWealth >=
            item.price;

          let buttonText =
            "Comprar";

          if (purchased) {
            buttonText =
              "Já adquirido";
          } else if (!unlocked) {
            buttonText =
              "Bloqueado";
          } else if (!canAfford) {
            buttonText =
              "Saldo insuficiente";
          } else if (
            item.price === 0
          ) {
            buttonText =
              "Aceitar presente";
          }

          const minimumCorruption =
            item.requirements
              ?.minimumCorruption;

          return `
            <article class="
              shop-product
              ${
                purchased
                  ? "purchased"
                  : ""
              }
              ${
                !unlocked
                  ? "locked"
                  : ""
              }
            ">
              <div class="shop-product-icon">
                ${item.icon}
              </div>

              <div class="shop-product-content">
                <small>
                  ${
                    SHOP_CATEGORIES[
                      item.category
                    ]?.label ??
                    item.category
                  }
                </small>

                <h2>
                  ${escapeHTML(
                    item.name
                  )}
                </h2>

                <p>
                  ${escapeHTML(
                    item.description
                  )}
                </p>

                ${
                  !unlocked &&
                  minimumCorruption
                    ? `
                      <span class="shop-requirement">
                        🔒 Disponível com
                        corrupção ${minimumCorruption}
                      </span>
                    `
                    : ""
                }
              </div>

              <div class="shop-product-purchase">
                <strong>
                  ${
                    item.price === 0
                      ? "Presente"
                      : formatCurrency(
                          item.price
                        )
                  }
                </strong>

                <button
                  type="button"
                  class="shop-buy-button"
                  data-item-id="${item.id}"
                  ${
                    purchased ||
                    !unlocked ||
                    !canAfford
                      ? "disabled"
                      : ""
                  }
                >
                  ${buttonText}
                </button>
              </div>
            </article>
          `;
        })
        .join("");

    productsElement
      .querySelectorAll(
        ".shop-buy-button"
      )
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            purchaseItem(
              button.dataset.itemId
            );
          }
        );
      });
  }

  function purchaseItem(itemId) {
    const item =
      PRESIDENTIAL_SHOP_ITEMS.find(
        (shopItem) =>
          shopItem.id === itemId
      );

    if (!item) {
      showMessage(
        "Produto não encontrado.",
        "error"
      );

      return;
    }

    const result =
      registerPurchase(
        gameState,
        item
      );

    if (!result.success) {
      const messages = {
        "insufficient-funds":
          "O salário presidencial ainda não cobre essa compra.",

        "already-purchased":
          "Esse item já faz parte do patrimônio presidencial."
      };

      showMessage(
        messages[result.reason] ??
          "Não foi possível concluir a compra.",
        "error"
      );

      return;
    }

    if (
      typeof onPurchase ===
      "function"
    ) {
      onPurchase({
        gameState,
        item,
        result
      });
    }

    updateSummary();
    renderProducts();

    showMessage(
      item.purchaseMessage ??
        `${item.name} foi adquirido.`
    );
  }

  function selectCategory(
    categoryId
  ) {
    selectedCategory =
      categoryId;

    overlay
      .querySelectorAll(
        ".shop-category"
      )
      .forEach((button) => {
        button.classList.toggle(
          "active",
          button.dataset.category ===
            categoryId
        );
      });

    renderProducts();
  }

  function closeShop() {
    window.clearTimeout(
      messageTimeout
    );

    document.removeEventListener(
      "keydown",
      handleEscape
    );

    overlay.remove();

    if (
      typeof onClose === "function"
    ) {
      onClose();
    }
  }

  function handleEscape(event) {
    if (event.key === "Escape") {
      closeShop();
    }
  }

  overlay
    .querySelectorAll(
      ".shop-category"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          selectCategory(
            button.dataset.category
          );
        }
      );
    });

  overlay
    .querySelector(
      "#close-presidential-shop"
    )
    .addEventListener(
      "click",
      closeShop
    );

  overlay
    .querySelector(
      "#finish-shopping"
    )
    .addEventListener(
      "click",
      closeShop
    );

  overlay.addEventListener(
    "click",
    (event) => {
      if (event.target === overlay) {
        closeShop();
      }
    }
  );

  document.addEventListener(
    "keydown",
    handleEscape
  );

  updateSummary();
  renderProducts();
}