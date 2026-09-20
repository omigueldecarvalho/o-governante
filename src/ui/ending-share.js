const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1350;

const THEMES = {
  victory: {
    primary: "#5ce784",
    secondary: "#193f28"
  },

  revolution: {
    primary: "#ff5c5c",
    secondary: "#481f21"
  },

  authoritarian: {
    primary: "#f0b84b",
    secondary: "#3d3019"
  },

  corruption: {
    primary: "#d490ff",
    secondary: "#352044"
  },

  defeat: {
    primary: "#ff6868",
    secondary: "#451f24"
  },

  neutral: {
    primary: "#5ce784",
    secondary: "#193f28"
  }
};

function formatCurrency(value) {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    }
  ).format(value ?? 0);
}

function sanitizeFilename(value) {
  return String(
    value ?? "governante"
  )
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /[^a-zA-Z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    )
    .toLowerCase();
}

function roundedRect(
  context,
  x,
  y,
  width,
  height,
  radius
) {
  context.beginPath();

  context.roundRect(
    x,
    y,
    width,
    height,
    radius
  );

  context.fill();
}

function drawWrappedText(
  context,
  text,
  x,
  y,
  maxWidth,
  lineHeight,
  maximumLines = 4
) {
  const words =
    String(text ?? "")
      .split(/\s+/);

  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine =
      currentLine
        ? `${currentLine} ${word}`
        : word;

    if (
      context.measureText(
        testLine
      ).width > maxWidth &&
      currentLine
    ) {
      lines.push(
        currentLine
      );

      currentLine = word;
    } else {
      currentLine =
        testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  const visibleLines =
    lines.slice(
      0,
      maximumLines
    );

  if (
    lines.length >
    maximumLines
  ) {
    const lastIndex =
      visibleLines.length - 1;

    visibleLines[lastIndex] =
      `${visibleLines[
        lastIndex
      ]}…`;
  }

  visibleLines.forEach(
    (line, index) => {
      context.fillText(
        line,
        x,
        y + index * lineHeight
      );
    }
  );

  return (
    y +
    visibleLines.length *
      lineHeight
  );
}

function drawStatCard(
  context,
  {
    x,
    y,
    width,
    label,
    value,
    icon,
    color
  }
) {
  context.fillStyle =
    "rgba(255, 255, 255, 0.055)";

  roundedRect(
    context,
    x,
    y,
    width,
    128,
    20
  );

  context.fillStyle = color;
  context.font =
    "700 26px Arial";

  context.fillText(
    `${icon} ${label}`,
    x + 24,
    y + 38
  );

  context.fillStyle =
    "#ffffff";

  context.font =
    "800 48px Arial";

  context.fillText(
    String(value),
    x + 24,
    y + 96
  );
}

function getReport(
  gameState
) {
  const report =
    gameState.finalReport;

  if (!report) {
    throw new Error(
      "Relatório final não encontrado."
    );
  }

  return report;
}

export async function createEndingCardBlob(
  gameState
) {
  const report =
    getReport(gameState);

  if (!report.elected) {
    throw new Error(
      "O candidato não chegou a tomar posse."
    );
  }

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width =
    CARD_WIDTH;

  canvas.height =
    CARD_HEIGHT;

  const context =
    canvas.getContext("2d");

  const theme =
    THEMES[
      report.ending?.tone
    ] ?? THEMES.neutral;

  /*
   * Fundo
   */
  const background =
    context.createLinearGradient(
      0,
      0,
      CARD_WIDTH,
      CARD_HEIGHT
    );

  background.addColorStop(
    0,
    "#0c1911"
  );

  background.addColorStop(
    0.55,
    "#102419"
  );

  background.addColorStop(
    1,
    theme.secondary
  );

  context.fillStyle =
    background;

  context.fillRect(
    0,
    0,
    CARD_WIDTH,
    CARD_HEIGHT
  );

  /*
   * Decoração superior
   */
  context.fillStyle =
    theme.primary;

  context.fillRect(
    0,
    0,
    CARD_WIDTH,
    14
  );

  context.fillStyle =
    "rgba(255, 255, 255, 0.03)";

  context.beginPath();

  context.arc(
    970,
    120,
    240,
    0,
    Math.PI * 2
  );

  context.fill();

  /*
   * Marca
   */
  context.fillStyle =
    theme.primary;

  context.font =
    "800 25px Arial";

  context.fillText(
    "O GOVERNANTE",
    70,
    72
  );

  context.fillStyle =
    "#8fa096";

  context.font =
    "600 20px Arial";

  context.fillText(
    "RELATÓRIO FINAL DO MANDATO",
    70,
    108
  );

  /*
   * Final
   */
  context.fillStyle =
    "#ffffff";

  context.font =
    "76px Arial";

  context.fillText(
    report.ending?.icon ??
      "🎖️",
    70,
    205
  );

  context.fillStyle =
    theme.primary;

  context.font =
    "800 48px Arial";

  drawWrappedText(
    context,
    report.ending?.title,
    180,
    175,
    790,
    56,
    2
  );

  /*
   * Alcunha
   */
  context.fillStyle =
    "rgba(255, 255, 255, 0.055)";

  roundedRect(
    context,
    70,
    255,
    940,
    170,
    24
  );

  context.fillStyle =
    "#98aa9f";

  context.font =
    "700 21px Arial";

  context.fillText(
    "COMO A HISTÓRIA O CONHECERÁ",
    105,
    302
  );

  context.fillStyle =
    "#ffffff";

  context.font =
    "800 42px Arial";

  drawWrappedText(
    context,
    report.player?.epithet ??
      report.player?.name,
    105,
    356,
    860,
    47,
    2
  );

  /*
   * Ideologia
   */
  context.fillStyle =
    "rgba(255, 255, 255, 0.04)";

  roundedRect(
    context,
    70,
    455,
    940,
    145,
    22
  );

  context.fillStyle =
    "#94a59b";

  context.font =
    "700 20px Arial";

  context.fillText(
    "PROMETEU",
    105,
    500
  );

  context.fillText(
    "ENTREGOU",
    610,
    500
  );

  context.fillStyle =
    "#ffffff";

  context.font =
    "800 29px Arial";

  context.fillText(
    report.ideology
      ?.initialName ??
      "Indefinida",
    105,
    550
  );

  context.fillStyle =
    theme.primary;

  context.fillText(
    report.ideology
      ?.finalName ??
      "Indefinida",
    610,
    550
  );

  context.fillStyle =
    "#708078";

  context.font =
    "700 35px Arial";

  context.fillText(
    "→",
    515,
    550
  );

  /*
   * Indicadores
   */
  const indicators =
    report.indicators ?? {};

  const statWidth = 286;

  drawStatCard(
    context,
    {
      x: 70,
      y: 635,
      width: statWidth,
      label: "Povo",
      value:
        indicators.people ?? 0,
      icon: "👥",
      color: "#5ce784"
    }
  );

  drawStatCard(
    context,
    {
      x: 397,
      y: 635,
      width: statWidth,
      label: "Economia",
      value:
        indicators.economy ?? 0,
      icon: "💰",
      color: "#f5ca5c"
    }
  );

  drawStatCard(
    context,
    {
      x: 724,
      y: 635,
      width: statWidth,
      label: "Estabilidade",
      value:
        indicators.stability ?? 0,
      icon: "🛡️",
      color: "#6aaeff"
    }
  );

  drawStatCard(
    context,
    {
      x: 70,
      y: 780,
      width: statWidth,
      label: "Congresso",
      value:
        indicators.congress ?? 0,
      icon: "🏛️",
      color: "#d3a5ff"
    }
  );

  drawStatCard(
    context,
    {
      x: 397,
      y: 780,
      width: statWidth,
      label: "Corrupção",
      value:
        indicators.corruption ?? 0,
      icon: "⚠️",
      color: "#ff6868"
    }
  );

  drawStatCard(
    context,
    {
      x: 724,
      y: 780,
      width: statWidth,
      label: "Conquistas",
      value:
        report.achievements
          ?.total ?? 0,
      icon: "🏆",
      color: "#ffd66e"
    }
  );

  /*
   * Patrimônio e duração
   */
  context.fillStyle =
    "rgba(0, 0, 0, 0.18)";

  roundedRect(
    context,
    70,
    925,
    940,
    115,
    20
  );

  context.fillStyle =
    "#91a299";

  context.font =
    "700 20px Arial";

  context.fillText(
    "TEMPO NO PODER",
    105,
    968
  );

  context.fillText(
    "PATRIMÔNIO FINAL",
    565,
    968
  );

  context.fillStyle =
    "#ffffff";

  context.font =
    "800 30px Arial";

  context.fillText(
    report.government
      ?.durationLabel ??
      "Desconhecido",
    105,
    1010
  );

  context.fillText(
    formatCurrency(
      report.player
        ?.personalWealth
    ),
    565,
    1010
  );

  /*
   * Frase do final
   */
  context.fillStyle =
    theme.primary;

  context.font =
    "700 20px Arial";

  context.fillText(
    "RESUMO HISTÓRICO",
    70,
    1100
  );

  context.fillStyle =
    "#ffffff";

  context.font =
    "italic 700 29px Arial";

  drawWrappedText(
    context,
    `“${
      report.ending
        ?.sharePhrase ??
      report.ending
        ?.description ??
      ""
    }”`,
    70,
    1145,
    940,
    38,
    3
  );

  /*
   * Rodapé
   */
  context.fillStyle =
    "rgba(255, 255, 255, 0.08)";

  context.fillRect(
    70,
    1270,
    940,
    2
  );

  context.fillStyle =
    "#7f9187";

  context.font =
    "600 20px Arial";

  context.fillText(
    `${report.player?.partyName ?? ""} ${
      report.player?.partyAcronym
        ? `— ${report.player.partyAcronym}`
        : ""
    }`,
    70,
    1310
  );

  context.textAlign =
    "right";

  context.fillStyle =
    theme.primary;

  context.font =
    "800 22px Arial";

  context.fillText(
    "O GOVERNANTE",
    1010,
    1310
  );

  context.textAlign =
    "left";

  return new Promise(
    (resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error(
                "Não foi possível gerar a imagem."
              )
            );

            return;
          }

          resolve(blob);
        },
        "image/png",
        1
      );
    }
  );
}

function downloadBlob(
  blob,
  filename
) {
  const url =
    URL.createObjectURL(
      blob
    );

  const anchor =
    document.createElement(
      "a"
    );

  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(
    anchor
  );

  anchor.click();
  anchor.remove();

  window.setTimeout(
    () => {
      URL.revokeObjectURL(
        url
      );
    },
    1000
  );
}

export async function downloadEndingCard(
  gameState
) {
  const blob =
    await createEndingCardBlob(
      gameState
    );

  const playerName =
    sanitizeFilename(
      gameState.finalReport
        ?.player
        ?.name
    );

  downloadBlob(
    blob,
    `o-governante-${playerName}.png`
  );

  return {
    downloaded: true
  };
}

export async function shareEndingCard(
  gameState
) {
  const blob =
    await createEndingCardBlob(
      gameState
    );

  const report =
    getReport(gameState);

  const playerName =
    sanitizeFilename(
      report.player?.name
    );

  const file =
    new File(
      [blob],
      `o-governante-${playerName}.png`,
      {
        type: "image/png"
      }
    );

  const shareData = {
    title:
      "Meu governo em O Governante",

    text:
      `${report.player?.epithet}. ${report.ending?.sharePhrase}`,

    files: [file]
  };

  const canShareFile =
    typeof navigator.share ===
      "function" &&
    (
      typeof navigator.canShare !==
        "function" ||
      navigator.canShare({
        files: [file]
      })
    );

  if (canShareFile) {
    try {
      await navigator.share(
        shareData
      );

      return {
        shared: true,
        downloaded: false
      };
    } catch (error) {
      /*
       * Cancelar o compartilhamento
       * não deve baixar automaticamente.
       */
      if (
        error.name ===
        "AbortError"
      ) {
        return {
          shared: false,
          downloaded: false,
          cancelled: true
        };
      }

      console.error(
        "Erro ao compartilhar:",
        error
      );
    }
  }

  /*
   * Computadores e navegadores que
   * não compartilham arquivos recebem
   * o download como alternativa.
   */
  downloadBlob(
    blob,
    `o-governante-${playerName}.png`
  );

  return {
    shared: false,
    downloaded: true
  };
}