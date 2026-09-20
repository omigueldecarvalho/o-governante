import {
  ACHIEVEMENTS
} from "../data/achievements.js";

export function ensureAchievementState(
  gameState
) {
  gameState.achievements ??= {
    unlocked: [],
    history: []
  };

  if (
    !Array.isArray(
      gameState.achievements
        .unlocked
    )
  ) {
    gameState.achievements
      .unlocked = [];
  }

  if (
    !Array.isArray(
      gameState.achievements
        .history
    )
  ) {
    gameState.achievements
      .history = [];
  }

  return gameState.achievements;
}

export function checkAchievements(
  gameState
) {
  const state =
    ensureAchievementState(
      gameState
    );

  const newlyUnlocked = [];

  ACHIEVEMENTS.forEach(
    (achievement) => {
      if (
        state.unlocked.includes(
          achievement.id
        )
      ) {
        return;
      }

      let unlocked = false;

      try {
        unlocked =
          achievement.condition(
            gameState
          );
      } catch (error) {
        console.error(
          `Erro na conquista ${achievement.id}:`,
          error
        );
      }

      if (!unlocked) {
        return;
      }

      state.unlocked.push(
        achievement.id
      );

      const record = {
        id:
          achievement.id,

        icon:
          achievement.icon,

        name:
          achievement.name,

        description:
          achievement.description,

        decision:
          gameState.government
            ?.decisionsTaken ?? 0,

        year:
          gameState.government
            ?.year ?? 1,

        month:
          gameState.government
            ?.month ?? 1,

        unlockedAt:
          new Date().toISOString()
      };

      state.history.push(
        record
      );

      newlyUnlocked.push(
        record
      );
    }
  );

  return newlyUnlocked;
}

export function getAchievementProgress(
  gameState
) {
  const state =
    ensureAchievementState(
      gameState
    );

  return {
    unlocked:
      state.unlocked.length,

    total:
      ACHIEVEMENTS.length,

    percentage:
      Math.round(
        state.unlocked.length /
          ACHIEVEMENTS.length *
          100
      )
  };
}