export function renderLawScreen({
  gameState,
  decision,
  onChoice
}) {
  const app = document.querySelector("#app");

  let selectedChoice = null;

  const optionsHTML = decision.choices
    .map(
      (choice) => `
        <button
          type="button"
          class="law-option"
          data-choice-id="${choice.id}"
        >
          <strong>${choice.text}</strong>

          <span>
            ${choice.optionDescription}
          </span>
        </button>
      `
    )
    .join("");

  app.innerHTML = `
    <section class="screen law-screen">
      <header class="game-status">
        <div>
          <small>Mandato</small>

          <strong>
            Ano ${gameState.government.year}
            · Mês ${gameState.government.month}
          </strong>
        </div>

        <span class="law-status">
          📜 Poder legislativo
        </span>
      </header>

      <div class="law-heading">
        <p class="eyebrow">
          ${decision.category}
        </p>

        <h1>${decision.title}</h1>

        <p>${decision.description}</p>
      </div>

      <div class="law-options">
        ${optionsHTML}
      </div>

      <form id="law-form">
        <div class="form-group">
          <label for="law-name">
            Nome da lei
          </label>

          <input
            type="text"
            id="law-name"
            maxlength="60"
            placeholder="Ex.: Lei da Salvação Nacional"
            required
          />
        </div>

        <div class="form-group">
          <label for="law-reason">
            Justificativa oficial
          </label>

          <textarea
            id="law-reason"
            maxlength="220"
            placeholder="Explique ao país por que essa lei é necessária..."
            required
          ></textarea>
        </div>

        <p
          class="law-selection-message"
          id="law-selection-message"
        >
          Selecione uma medida antes de sancionar.
        </p>

        <button
          type="submit"
          class="primary-button"
          id="approve-law"
          disabled
        >
          Sancionar lei
        </button>
      </form>
    </section>
  `;

  const optionButtons =
    document.querySelectorAll(".law-option");

  const approveButton =
    document.querySelector("#approve-law");

  const selectionMessage =
    document.querySelector(
      "#law-selection-message"
    );

  optionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const choiceId =
        button.dataset.choiceId;

      selectedChoice = decision.choices.find(
        (choice) => choice.id === choiceId
      );

      optionButtons.forEach((item) => {
        item.classList.remove("selected");
      });

      button.classList.add("selected");

      selectionMessage.textContent =
        `Medida selecionada: ${selectedChoice.text}`;

      approveButton.disabled = false;
    });
  });

  document
    .querySelector("#law-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      if (!selectedChoice) {
        return;
      }

      const lawName = document
        .querySelector("#law-name")
        .value
        .trim();

      const lawReason = document
        .querySelector("#law-reason")
        .value
        .trim();

      if (!lawName || !lawReason) {
        return;
      }

      onChoice({
        ...selectedChoice,

        law: {
          name: lawName,
          reason: lawReason
        }
      });
    });
}