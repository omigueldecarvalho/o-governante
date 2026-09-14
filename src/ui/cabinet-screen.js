function createEmptyEffects() {
  return {
    indicators: {},
    politics: {},
    factions: {},
    country: {},
    corruption: 0,
    personalWealth: 0
  };
}

function mergeGroup(target, source = {}) {
  Object.entries(source).forEach(
    ([key, value]) => {
      target[key] =
        (target[key] ?? 0) + value;
    }
  );
}

function mergeEffects(target, source) {
  mergeGroup(
    target.indicators,
    source.indicators
  );

  mergeGroup(
    target.politics,
    source.politics
  );

  mergeGroup(
    target.factions,
    source.factions
  );

  mergeGroup(
    target.country,
    source.country
  );

  target.corruption +=
    source.corruption ?? 0;

  target.personalWealth +=
    source.personalWealth ?? 0;
}

export function renderCabinetScreen({
  gameState,
  decision,
  onComplete
}) {
  const app = document.querySelector("#app");
  const selectedCandidates = [];

  const candidatesHTML = decision.candidates
    .map(
      (candidate) => `
        <button
          type="button"
          class="cabinet-candidate"
          data-candidate-id="${candidate.id}"
        >
          <span class="candidate-icon">
            ${candidate.icon}
          </span>

          <div>
            <strong>${candidate.name}</strong>
            <small>${candidate.role}</small>

            <p>
              ${candidate.description}
            </p>
          </div>

          <span class="candidate-selection">
            Selecionar
          </span>
        </button>
      `
    )
    .join("");

  app.innerHTML = `
    <section class="screen cabinet-screen">
      <header class="cabinet-header">
        <div>
          <p class="eyebrow">
            Formação do governo
          </p>

          <h1>${decision.title}</h1>

          <p>${decision.description}</p>
        </div>

        <strong id="cabinet-counter">
          0/3
        </strong>
      </header>

      <div class="cabinet-candidates">
        ${candidatesHTML}
      </div>

      <button
        type="button"
        class="primary-button"
        id="confirm-cabinet"
        disabled
      >
        Nomear ministros
      </button>
    </section>
  `;

  const counter = document.querySelector(
    "#cabinet-counter"
  );

  const confirmButton = document.querySelector(
    "#confirm-cabinet"
  );

  document
    .querySelectorAll(".cabinet-candidate")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const candidateId =
          button.dataset.candidateId;

        const selectedIndex =
          selectedCandidates.findIndex(
            (item) => item.id === candidateId
          );

        if (selectedIndex >= 0) {
          selectedCandidates.splice(
            selectedIndex,
            1
          );

          button.classList.remove("selected");

          button.querySelector(
            ".candidate-selection"
          ).textContent = "Selecionar";
        } else {
          if (selectedCandidates.length >= 3) {
            return;
          }

          const candidate =
            decision.candidates.find(
              (item) =>
                item.id === candidateId
            );

          selectedCandidates.push(candidate);

          button.classList.add("selected");

          button.querySelector(
            ".candidate-selection"
          ).textContent = "Nomeado";
        }

        counter.textContent =
          `${selectedCandidates.length}/3`;

        confirmButton.disabled =
          selectedCandidates.length !== 3;
      });
    });

  confirmButton.addEventListener(
    "click",
    () => {
      if (selectedCandidates.length !== 3) {
        return;
      }

      const accumulatedEffects =
        createEmptyEffects();

      selectedCandidates.forEach(
        (candidate) => {
          mergeEffects(
            accumulatedEffects,
            candidate.effects
          );
        }
      );

      const selectedNames = selectedCandidates
        .map((candidate) => candidate.name)
        .join(", ");

      onComplete({
        id: "cabinet-formation-result",

        text:
          "Nomear a equipe ministerial",

        resultText:
          `${selectedNames} assumiram os principais cargos do governo. A nova equipe já começou a disputar espaço e influência.`,

        effects: accumulatedEffects,

        cabinet: selectedCandidates.map(
          (candidate) => ({
            id: candidate.id,
            name: candidate.name,
            role: candidate.role
          })
        )
      });
    }
  );
}