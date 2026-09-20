function createFinalChoice(score, total) {
  const percentage =
    total > 0
      ? Math.round((score / total) * 100)
      : 0;

  if (percentage >= 80) {
    return {
      id: "deepfake-center-excellent",

      text: "Central eficiente",

      resultText:
        "A central desmontou boatos sem fabricar novas mentiras. Até os adversários tiveram dificuldade para contestar o relatório.",

      effects: {
        indicators: {
          people: 8,
          congress: -2,
          stability: 5
        },

        country: {
          pressFreedom: 5
        },

        politics: {
          authoritarianism: -3
        },

        corruption: -2,
        personalWealth: 0
      }
    };
  }

  if (percentage >= 50) {
    return {
      id: "deepfake-center-average",

      text: "Central confusa",

      resultText:
        "Alguns boatos foram desmentidos, mas a equipe também publicou classificações precipitadas.",

      effects: {
        indicators: {
          people: 2,
          congress: -1,
          stability: -1
        },

        country: {
          pressFreedom: 1
        },

        corruption: 0,
        personalWealth: 0
      }
    };
  }

  return {
    id: "deepfake-center-failed",

    text: "A central virou fábrica de boatos",

    resultText:
      "Na tentativa de combater desinformação, o governo publicou informações sem verificar. A oposição agora chama a central de Ministério da Verdade.",

    effects: {
      indicators: {
        people: -8,
        congress: -6,
        stability: -5
      },

      country: {
        pressFreedom: -5
      },

      politics: {
        authoritarianism: 5
      },

      corruption: 3,
      personalWealth: 0
    }
  };
}