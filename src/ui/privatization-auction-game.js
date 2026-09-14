const COMPANIES = [
  {
    id: "national-energy",
    icon: "⚡",
    name: "Energia Nacional",
    sector: "Energia",
    estimatedValue: 20,

    offers: [
      {
        buyer: "Global Power",
        value: 22,
        icon: "🌎",
        corruption: 0,
        personalWealth: 0
      },

      {
        buyer: "Consórcio dos Amigos",
        value: 14,
        icon: "🤝",
        corruption: 10,
        personalWealth: 800000
      },

      {
        buyer: "Fundo Futuro",
        value: 19,
        icon: "📊",
        corruption: 2,
        personalWealth: 0
      }
    ]
  },

  {
    id: "people-bank",
    icon: "🏦",
    name: "Banco do Povo",
    sector: "Financeiro",
    estimatedValue: 30,

    offers: [
      {
        buyer: "Bank of Everywhere",
        value: 32,
        icon: "💳",
        corruption: 0,
        personalWealth: 0
      },

      {
        buyer: "Banco do Cunhado",
        value: 20,
        icon: "👨‍👩‍👧‍👦",
        corruption: 15,
        personalWealth: 1200000
      },

      {
        buyer: "Cooperativa Nacional",
        value: 27,
        icon: "🤲",
        corruption: 0,
        personalWealth: 0
      }
    ]
  },

  {
    id: "national-telecom",
    icon: "📡",
    name: "Telecom Nacional",
    sector: "Comunicações",
    estimatedValue: 12,

    offers: [
      {
        buyer: "Connect International",
        value: 14,
        icon: "📶",
        corruption: 0,
        personalWealth: 0
      },

      {
        buyer: "Comunicações Laranjeira",
        value: 8,
        icon: "🍊",
        corruption: 12,
        personalWealth: 650000
      },

      {
        buyer: "Fundo dos Trabalhadores",
        value: 11,
        icon: "✊",
        corruption: 0,
        personalWealth: 0
      }
    ]
  }
];

function shuffle(items) {
  return [...items].sort(
    () => Math.random() - 0.5
  );
}

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

function mergeEffects(target, source = {}) {
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

function getSaleEffects(company, offer) {
  const saleRatio =
    offer.value / company.estimatedValue;

  const economyEffect = Math.round(
    saleRatio * 8
  );

  const suspiciousSale =
    offer.corruption >= 10;

  return {
    indicators: {
      people: suspiciousSale ? -5 : -2,
      congress: suspiciousSale ? 5 : 2,
      economy: economyEffect,
      stability: suspiciousSale ? -3 : 1
    },

    politics: {
      economicPosition: 12,
      socialPosition: 1,
      authoritarianism: 0,
      popularParticipation: -5,
      personalism:
        suspiciousSale ? 8 : 2
    },

    factions: {
      military: 0,
      business: 10,
      unions: -7,
      socialMovements: -6,
      religiousGroups: 0,
      press: suspiciousSale ? -5 : 1
    },

    country: {
      inequality: 3,
      publicServices: -3,
      environment: 0
    },

    corruption: offer.corruption,
    personalWealth: offer.personalWealth
  };
}

function getStateCompanyEffects() {
  return {
    indicators: {
      people: 4,
      congress: -2,
      economy: -2,
      stability: 2
    },

    politics: {
      economicPosition: -8,
      socialPosition: -2,
      authoritarianism: 0,
      popularParticipation: 3,
      personalism: 0
    },

    factions: {
      military: 0,
      business: -5,
      unions: 7,
      socialMovements: 5,
      religiousGroups: 0,
      press: 1
    },

    country: {
      inequality: -2,
      publicServices: 3,
      environment: 0
    },

    corruption: 0,
    personalWealth: 0
  };
}

function getFutureEffect(results) {
  const suspiciousSales =
    results.filter(
      (result) =>
        result.action === "sold" &&
        result.corruption >= 10
    );

  if (suspiciousSales.length === 0) {
    return null;
  }

  return {
    afterMonths: 3,

    message:
      "A imprensa descobriu que empresas públicas foram vendidas abaixo do valor para compradores ligados ao governo.",

    effects: {
      indicators: {
        people:
          suspiciousSales.length * -8,

        congress:
          suspiciousSales.length * -4,

        economy:
          suspiciousSales.length * -3,

        stability:
          suspiciousSales.length * -6
      },

      factions: {
        press:
          suspiciousSales.length * -8,

        unions:
          suspiciousSales.length * -5
      },

      corruption:
        suspiciousSales.length * 10
    }
  };
}

function getResultText(results) {
  const soldCompanies = results.filter(
    (result) => result.action === "sold"
  );

  const stateCompanies = results.filter(
    (result) => result.action === "state"
  );

  const suspiciousSales =
    soldCompanies.filter(
      (result) => result.corruption >= 10
    );

  if (suspiciousSales.length >= 2) {
    return "O governo arrecadou bilhões e, por absoluta coincidência, o presidente também ficou mais rico.";
  }

  if (soldCompanies.length === 3) {
    return "Todas as empresas foram privatizadas. O ministro declarou que agora até o Palácio pode receber propostas.";
  }

  if (stateCompanies.length === 3) {
    return "Todas as empresas permaneceram públicas. Empresários chamaram o resultado de tragédia nacional.";
  }

  return `O governo privatizou ${soldCompanies.length} empresas e manteve ${stateCompanies.length} sob controle estatal.`;
}

export function renderPrivatizationAuction({
  gameState,
  decision,
  onComplete
}) {
  const app = document.querySelector("#app");

  const companies = COMPANIES.map(
    (company) => ({
      ...company,
      offers: shuffle(company.offers)
    })
  );

  const effects = createEmptyEffects();
  const results = [];

  let companyIndex = 0;
  let offerIndex = 0;
  let offerTime = 5;
  let offerTimer = null;
  let locked = false;
  let finished = false;

  function formatBillions(value) {
    return `R$ ${value} bi`;
  }

  function renderCurrentCompany() {
    if (companyIndex >= companies.length) {
      finishAuction();
      return;
    }

    window.clearInterval(offerTimer);

    locked = false;
    offerTime = 5;

    const company = companies[companyIndex];
    const offer = company.offers[offerIndex];

    app.innerHTML = `
      <section class="screen auction-screen">
        <header class="auction-header">
          <div>
            <p class="eyebrow">
              Leilão presidencial
            </p>

            <h1>${decision.title}</h1>
          </div>

          <strong>
            ${companyIndex + 1}/${companies.length}
          </strong>
        </header>

        <article class="auction-company">
          <span>${company.icon}</span>

          <h2>${company.name}</h2>

          <small>${company.sector}</small>

          <div class="estimated-value">
            <small>Valor estimado</small>

            <strong>
              ${formatBillions(
                company.estimatedValue
              )}
            </strong>
          </div>
        </article>

        <article class="current-offer">
          <div class="offer-buyer">
            <span>${offer.icon}</span>

            <div>
              <small>Comprador</small>
              <strong>${offer.buyer}</strong>
            </div>
          </div>

          <div class="offer-value">
            <small>Oferta atual</small>

            <strong>
              ${formatBillions(offer.value)}
            </strong>
          </div>

          ${
            offer.personalWealth > 0
              ? `
                <div class="secret-commission">
                  🤫 Comissão pessoal incluída
                </div>
              `
              : ""
          }
        </article>

        <div class="offer-timer">
          <div
            id="offer-timer-progress"
            style="width: 100%"
          ></div>
        </div>

        <p class="offer-expiration">
          Oferta expira em
          <strong id="offer-time">5</strong>
          segundos
        </p>

        <div class="auction-actions">
          <button
            type="button"
            class="primary-button"
            id="accept-offer"
          >
            Aceitar oferta
          </button>

          <button
            type="button"
            class="secondary-button"
            id="next-offer"
          >
            Esperar outra
          </button>

          <button
            type="button"
            class="secondary-button"
            id="keep-state"
          >
            Manter estatal
          </button>
        </div>
      </section>
    `;

    document
      .querySelector("#accept-offer")
      ?.addEventListener(
        "click",
        acceptOffer
      );

    document
      .querySelector("#next-offer")
      ?.addEventListener(
        "click",
        nextOffer
      );

    document
      .querySelector("#keep-state")
      ?.addEventListener(
        "click",
        keepStateCompany
      );

    startOfferTimer();
  }

  function startOfferTimer() {
    offerTimer = window.setInterval(() => {
      offerTime -= 1;

      const timeElement =
        document.querySelector(
          "#offer-time"
        );

      const progressElement =
        document.querySelector(
          "#offer-timer-progress"
        );

      if (timeElement) {
        timeElement.textContent =
          offerTime;
      }

      if (progressElement) {
        progressElement.style.width =
          `${offerTime / 5 * 100}%`;
      }

      if (offerTime <= 0) {
        nextOffer();
      }
    }, 1000);
  }

  function acceptOffer() {
    if (locked || finished) {
      return;
    }

    locked = true;
    window.clearInterval(offerTimer);

    const company = companies[companyIndex];
    const offer = company.offers[offerIndex];

    mergeEffects(
      effects,
      getSaleEffects(company, offer)
    );

    results.push({
      companyId: company.id,
      companyName: company.name,
      action: "sold",
      buyer: offer.buyer,
      value: offer.value,
      corruption: offer.corruption,
      personalWealth:
        offer.personalWealth
    });

    companyIndex += 1;
    offerIndex = 0;

    renderCurrentCompany();
  }

  function nextOffer() {
    if (locked || finished) {
      return;
    }

    window.clearInterval(offerTimer);

    const company = companies[companyIndex];

    offerIndex += 1;

    if (offerIndex >= company.offers.length) {
      keepStateCompany();
      return;
    }

    renderCurrentCompany();
  }

  function keepStateCompany() {
    if (locked || finished) {
      return;
    }

    locked = true;
    window.clearInterval(offerTimer);

    const company = companies[companyIndex];

    mergeEffects(
      effects,
      getStateCompanyEffects()
    );

    results.push({
      companyId: company.id,
      companyName: company.name,
      action: "state"
    });

    companyIndex += 1;
    offerIndex = 0;

    renderCurrentCompany();
  }

  function finishAuction() {
    if (finished) {
      return;
    }

    finished = true;
    window.clearInterval(offerTimer);

    const sold = results.filter(
      (result) => result.action === "sold"
    ).length;

    const state = results.length - sold;

    const raisedValue = results
      .filter(
        (result) => result.action === "sold"
      )
      .reduce(
        (total, result) =>
          total + result.value,
        0
      );

    const personalGain = results.reduce(
      (total, result) =>
        total +
        (result.personalWealth ?? 0),
      0
    );

    app.innerHTML = `
      <section class="screen auction-result-screen">
        <div class="auction-result-icon">
          🔨
        </div>

        <p class="eyebrow">
          Leilão encerrado
        </p>

        <h1>
          O martelo foi batido
        </h1>

        <div class="auction-summary">
          <article>
            <strong>${sold}</strong>
            <small>Privatizadas</small>
          </article>

          <article>
            <strong>${state}</strong>
            <small>Estatais</small>
          </article>

          <article>
            <strong>
              ${formatBillions(raisedValue)}
            </strong>

            <small>Arrecadados</small>
          </article>

          <article>
            <strong>
              ${new Intl.NumberFormat(
                "pt-BR",
                {
                  style: "currency",
                  currency: "BRL",
                  maximumFractionDigits: 0
                }
              ).format(personalGain)}
            </strong>

            <small>Comissões pessoais</small>
          </article>
        </div>

        <button
          type="button"
          class="primary-button"
          id="finish-auction"
        >
          Ver repercussão
        </button>
      </section>
    `;

    document
      .querySelector("#finish-auction")
      ?.addEventListener("click", () => {
        onComplete({
          id: "privatization-auction-result",
          text:
            "Concluir o leilão das estatais",

          resultText:
            getResultText(results),

          effects,

          futureEffect:
            getFutureEffect(results),

          privatizationAuction: {
            results,
            raisedValue,
            personalGain
          }
        });
      });
  }

  renderCurrentCompany();
}