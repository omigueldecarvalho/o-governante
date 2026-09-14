function escapeHTML(value = "") {
  const element =
    document.createElement("div");

  element.textContent = String(value);

  return element.innerHTML;
}

function isValidFlagImage(image) {
  return (
    typeof image === "string" &&
    image.startsWith("data:image/")
  );
}

export function renderNationalFlag(
  flag,
  variant = "default"
) {
  if (
    !flag ||
    !isValidFlagImage(flag.image)
  ) {
    return "";
  }

  const motto = flag.motto?.trim();

  return `
    <figure
      class="national-flag national-flag--${variant}"
    >
      <div class="national-flag-frame">
        <img
          src="${flag.image}"
          alt="Bandeira criada pelo governante"
          class="national-flag-image"
        />
      </div>

      ${
        motto
          ? `
            <figcaption>
              “${escapeHTML(motto)}”
            </figcaption>
          `
          : ""
      }
    </figure>
  `;
}

export function getGovernmentFlag(
  government
) {
  return (
    government?.flag ??
    government?.country?.flag ??
    null
  );
}