import {
  FOOTBALL_TEAMS
} from "../data/football-teams.js";

export function renderFootballTeamScreen({
  onComplete
}) {
  const app = document.querySelector("#app");

  let selectedTeam = null;

  const teamsHTML = FOOTBALL_TEAMS.map(
    (team) => `
      <button
        type="button"
        class="football-team-card"
        data-team-id="${team.id}"
      >
        <span class="football-team-icon">
          ${team.icon}
        </span>

        <div>
          <strong>${team.name}</strong>

          <small>${team.nickname}</small>

          <p>${team.description}</p>
        </div>

        <span class="football-team-status">
          Escolher
        </span>
      </button>
    `
  ).join("");

  app.innerHTML = `
    <section class="screen football-screen">
      <header class="football-header">
        <p class="eyebrow">
          Entrevista de campanha
        </p>

        <h1>Para qual time você torce?</h1>

        <p>
          A resposta certamente não afetará
          nenhuma decisão política importante.
        </p>
      </header>

      <div class="football-teams">
        ${teamsHTML}
      </div>

      <button
        type="button"
        class="primary-button"
        id="confirm-football-team"
        disabled
      >
        Confirmar time
      </button>
    </section>
  `;

  const confirmButton =
    document.querySelector(
      "#confirm-football-team"
    );

  document
    .querySelectorAll(
      ".football-team-card"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          const teamId =
            button.dataset.teamId;

          selectedTeam =
            FOOTBALL_TEAMS.find(
              (team) => team.id === teamId
            );

          document
            .querySelectorAll(
              ".football-team-card"
            )
            .forEach((card) => {
              card.classList.remove(
                "selected"
              );

              card.querySelector(
                ".football-team-status"
              ).textContent = "Escolher";
            });

          button.classList.add("selected");

          button.querySelector(
            ".football-team-status"
          ).textContent = "Meu time";

          confirmButton.disabled = false;
        }
      );
    });

  confirmButton?.addEventListener(
    "click",
    () => {
      if (!selectedTeam) {
        return;
      }

      onComplete(selectedTeam);
    }
  );
}