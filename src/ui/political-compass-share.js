const IMAGE_WIDTH = 1080;
const IMAGE_HEIGHT = 1350;

function createCanvas() {
  const canvas =
    document.createElement("canvas");

  canvas.width = IMAGE_WIDTH;
  canvas.height = IMAGE_HEIGHT;

  return canvas;
}

function roundRectangle(
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

  context.closePath();
}

function drawBackground(
  context
) {
  const gradient =
    context.createLinearGradient(
      0,
      0,
      IMAGE_WIDTH,
      IMAGE_HEIGHT
    );

  gradient.addColorStop(
    0,
    "#142a1d"
  );

  gradient.addColorStop(
    0.55,
    "#0c1c13"
  );

  gradient.addColorStop(
    1,
    "#07110b"
  );

  context.fillStyle = gradient;

  context.fillRect(
    0,
    0,
    IMAGE_WIDTH,
    IMAGE_HEIGHT
  );

  const glow =
    context.createRadialGradient(
      850,
      180,
      10,
      850,
      180,
      500
    );

  glow.addColorStop(
    0,
    "rgba(79, 220, 125, 0.22)"
  );

  glow.addColorStop(
    1,
    "rgba(79, 220, 125, 0)"
  );

  context.fillStyle = glow;

  context.fillRect(
    0,
    0,
    IMAGE_WIDTH,
    IMAGE_HEIGHT
  );
}

function drawWrappedText({
  context,
  text,
  x,
  y,
  maximumWidth,
  lineHeight,
  maximumLines = 4
}) {
  const words =
    String(text ?? "").split(" ");

  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine =
      currentLine
        ? `${currentLine} ${word}`
        : word;

    const width =
      context.measureText(
        testLine
      ).width;

    if (
      width > maximumWidth &&
      currentLine
    ) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
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

  visibleLines.forEach(
    (line, index) => {
      let visibleLine = line;

      if (
        index ===
          maximumLines - 1 &&
        lines.length > maximumLines
      ) {
        visibleLine =
          `${visibleLine}…`;
      }

      context.fillText(
        visibleLine,
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

function clampPercentage(
  value
) {
  return Math.max(
    0,
    Math.min(
      100,
      Number(value ?? 50)
    )
  );
}

function drawAxis({
  context,
  label,
  value,
  leftLabel,
  rightLabel,
  y
}) {
  const safeValue =
    clampPercentage(value);

  const x = 110;
  const width = 860;

  context.fillStyle = "#edf8f0";
  context.font =
    "700 29px Arial, sans-serif";

  context.textAlign = "left";

  context.fillText(
    label,
    x,
    y
  );

  context.fillStyle = "#50df80";
  context.textAlign = "right";

  context.fillText(
    `${safeValue}%`,
    x + width,
    y
  );

  const barY = y + 28;

  const gradient =
    context.createLinearGradient(
      x,
      barY,
      x + width,
      barY
    );

  gradient.addColorStop(
    0,
    "#3f8cff"
  );

  gradient.addColorStop(
    0.5,
    "#d7ddd9"
  );

  gradient.addColorStop(
    1,
    "#ef6262"
  );

  context.fillStyle = gradient;

  roundRectangle(
    context,
    x,
    barY,
    width,
    14,
    7
  );

  context.fill();

  const markerX =
    x +
    width *
      (safeValue / 100);

  context.beginPath();

  context.arc(
    markerX,
    barY + 7,
    16,
    0,
    Math.PI * 2
  );

  context.fillStyle = "#ffffff";
  context.fill();

  context.lineWidth = 6;
  context.strokeStyle = "#0a1710";
  context.stroke();

  context.font =
    "500 21px Arial, sans-serif";

  context.fillStyle = "#899d8f";
  context.textAlign = "left";

  context.fillText(
    leftLabel,
    x,
    barY + 54
  );

  context.textAlign = "right";

  context.fillText(
    rightLabel,
    x + width,
    barY + 54
  );
}

function createShareText(
  result
) {
  const ideologyName =
    result.ideology?.name ??
    result.ideologyName ??
    "Orientação indefinida";

  const epithet =
    result.epithet ??
    "O Eleitor Misterioso";

  return [
    "🧭 Bússola do Governante",
    "",
    `Minha orientação política: ${ideologyName}`,
    `“${epithet}”`,
    "",
    "Descubra também a sua orientação política em O Governante."
  ].join("\n");
}

function createFileName(
  result
) {
  const ideologyName =
    result.ideology?.name ??
    result.ideologyName ??
    "resultado";

  const normalizedName =
    ideologyName
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-|-$/g,
        ""
      );

  return (
    `bussola-do-governante-${normalizedName}.png`
  );
}

export function createPoliticalCompassImage(
  result
) {
  return new Promise(
    (resolve, reject) => {
      try {
        const canvas =
          createCanvas();

        const context =
          canvas.getContext("2d");

        if (!context) {
          reject(
            new Error(
              "Não foi possível criar a imagem."
            )
          );

          return;
        }

        drawBackground(context);

        context.fillStyle =
          "rgba(255, 255, 255, 0.035)";

        context.strokeStyle =
          "rgba(79, 220, 125, 0.22)";

        context.lineWidth = 2;

        roundRectangle(
          context,
          55,
          55,
          970,
          1240,
          42
        );

        context.fill();
        context.stroke();

        context.textAlign = "center";

        context.fillStyle = "#50df80";

        context.font =
          "800 27px Arial, sans-serif";

        context.fillText(
          "BÚSSOLA DO GOVERNANTE",
          IMAGE_WIDTH / 2,
          130
        );

        context.font =
          "500 72px Arial, sans-serif";

        context.fillStyle = "#ffffff";

        context.fillText(
          "🧭",
          IMAGE_WIDTH / 2,
          225
        );

        const ideologyName =
          result.ideology?.name ??
          result.ideologyName ??
          "Orientação indefinida";

        context.font =
          "900 67px Arial, sans-serif";

        context.fillStyle = "#f5fff8";

        const ideologyBottom =
          drawWrappedText({
            context,
            text: ideologyName,
            x: IMAGE_WIDTH / 2,
            y: 320,
            maximumWidth: 820,
            lineHeight: 73,
            maximumLines: 2
          });

        context.fillStyle = "#50df80";

        context.font =
          "700 29px Arial, sans-serif";

        const epithet =
          result.epithet ??
          "O Eleitor Misterioso";

        const epithetBottom =
          drawWrappedText({
            context,
            text: `“${epithet}”`,
            x: IMAGE_WIDTH / 2,
            y: ideologyBottom + 20,
            maximumWidth: 790,
            lineHeight: 38,
            maximumLines: 2
          });

        context.textAlign = "left";

        const percentages =
          result.percentages ?? {};

        let axisY =
          Math.max(
            530,
            epithetBottom + 45
          );

        drawAxis({
          context,
          label: "💰 Economia",
          value:
            percentages
              .economicPosition,
          leftLabel: "Esquerda",
          rightLabel: "Direita",
          y: axisY
        });

        axisY += 142;

        drawAxis({
          context,
          label: "🌈 Costumes",
          value:
            percentages
              .socialPosition,
          leftLabel: "Progressista",
          rightLabel: "Conservador",
          y: axisY
        });

        axisY += 142;

        drawAxis({
          context,
          label: "⚖️ Autoridade",
          value:
            percentages
              .authoritarianism,
          leftLabel: "Democrático",
          rightLabel: "Autoritário",
          y: axisY
        });

        axisY += 142;

        drawAxis({
          context,
          label: "🗳️ Participação",
          value:
            percentages
              .popularParticipation,
          leftLabel: "Representativa",
          rightLabel: "Direta",
          y: axisY
        });

        context.textAlign = "center";
        context.fillStyle = "#809388";

        context.font =
          "500 22px Arial, sans-serif";

        context.fillText(
          "Este teste é uma sátira política e não possui finalidade científica.",
          IMAGE_WIDTH / 2,
          1190
        );

        context.fillStyle = "#50df80";

        context.font =
          "800 26px Arial, sans-serif";

        context.fillText(
          "Faça o seu teste em O Governante",
          IMAGE_WIDTH / 2,
          1245
        );

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
      } catch (error) {
        reject(error);
      }
    }
  );
}

export async function downloadPoliticalCompassResult(
  result
) {
  const blob =
    await createPoliticalCompassImage(
      result
    );

  const imageUrl =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = imageUrl;

  link.download =
    createFileName(result);

  document.body.appendChild(link);

  link.click();
  link.remove();

  setTimeout(
    () => {
      URL.revokeObjectURL(
        imageUrl
      );
    },
    1000
  );
}

export async function sharePoliticalCompassResult(
  result
) {
  const blob =
    await createPoliticalCompassImage(
      result
    );

  const file = new File(
    [blob],
    createFileName(result),
    {
      type: "image/png"
    }
  );

  const shareData = {
    title:
      "Bússola do Governante",

    text:
      createShareText(result),

    files: [file]
  };

  if (
    navigator.share &&
    (
      !navigator.canShare ||
      navigator.canShare({
        files: [file]
      })
    )
  ) {
    try {
      await navigator.share(
        shareData
      );

      return {
        shared: true,
        fallback: false
      };
    } catch (error) {
      if (
        error?.name ===
        "AbortError"
      ) {
        return {
          shared: false,
          cancelled: true
        };
      }

      console.warn(
        "Compartilhamento nativo indisponível:",
        error
      );
    }
  }

  /*
   * Em navegadores sem compartilhamento
   * de arquivos, copia o texto e baixa
   * a imagem.
   */
  try {
    await navigator.clipboard.writeText(
      createShareText(result)
    );
  } catch (error) {
    console.warn(
      "Não foi possível copiar o texto:",
      error
    );
  }

  await downloadPoliticalCompassResult(
    result
  );

  window.alert(
    "Seu navegador não permite compartilhar a imagem diretamente. O texto foi copiado e a imagem foi baixada para você compartilhar."
  );

  return {
    shared: false,
    fallback: true
  };
}