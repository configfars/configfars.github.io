"use strict";

const IP_API_BASE = "https://ipwho.is/";
const COUNTRY_API_BASE = "https://restcountries.com/v3.1/alpha/";
const DNS_API_BASE = "https://cloudflare-dns.com/dns-query";

const form = document.querySelector("#ip-form");
const ipInput = document.querySelector("#ip-input");
const searchButton = document.querySelector("#search-button");
const myIpButton = document.querySelector("#my-ip-button");
const copyButton = document.querySelector("#copy-button");
const resultElement = document.querySelector("#result");
const resultIp = document.querySelector("#result-ip");
const infoGrid = document.querySelector("#info-grid");
const securityGrid = document.querySelector("#security-grid");
const statusElement = document.querySelector("#status");
const rawOutput = document.querySelector("#raw-output");
const osmLink = document.querySelector("#osm-link");

let map = null;
let mapMarker = null;
let lastResult = null;

const INFO_FIELDS = [
  { key: "ip", label: "آدرس IP", ltr: true },
  { key: "type", label: "نوع IP", ltr: true },
  { key: "country", label: "کشور" },
  { key: "countryCode", label: "کد کشور", ltr: true },
  { key: "continent", label: "قاره" },
  { key: "city", label: "شهر" },
  { key: "region", label: "استان / Region" },
  { key: "postal", label: "کد پستی", ltr: true },
  { key: "latitude", label: "Latitude", ltr: true },
  { key: "longitude", label: "Longitude", ltr: true },
  { key: "timezone", label: "منطقه زمانی", ltr: true },
  { key: "utc", label: "اختلاف UTC", ltr: true },
  { key: "isp", label: "ISP", ltr: true },
  { key: "organization", label: "Organization", ltr: true },
  { key: "asn", label: "ASN", ltr: true },
  { key: "domain", label: "دامنه شبکه", ltr: true },
  { key: "currency", label: "واحد پول" },
  { key: "languages", label: "زبان‌های کشور" },
  { key: "callingCode", label: "پیش‌شماره کشور", ltr: true },
  { key: "reverseDns", label: "Reverse DNS", ltr: true }
];

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await scanIp(ipInput.value);
});

myIpButton.addEventListener("click", async () => {
  ipInput.value = "";
  await scanIp("");
});

copyButton.addEventListener("click", copyResult);

async function scanIp(input) {
  const ip = input.trim();

  if (ip && !isValidIp(ip)) {
    showStatus(
      "آدرس واردشده IPv4 یا IPv6 معتبر نیست.",
      "error"
    );
    return;
  }

  setLoading(true);
  showStatus("در حال دریافت و تحلیل اطلاعات IP...", "loading");
  resultElement.classList.add("hidden");

  try {
    const endpoint = ip
      ? `${IP_API_BASE}${encodeURIComponent(ip)}`
      : IP_API_BASE;

    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`خطای HTTP: ${response.status}`);
    }

    const geoData = await response.json();

    if (geoData.success === false) {
      throw new Error(geoData.message || "IP پیدا نشد.");
    }

    const [countryData, reverseDns] = await Promise.all([
      fetchCountryData(geoData.country_code),
      fetchReverseDns(geoData.ip)
    ]);

    const normalizedData = normalizeResult(
      geoData,
      countryData,
      reverseDns
    );

    lastResult = normalizedData;

    renderResult(normalizedData);
    rawOutput.textContent = JSON.stringify(
      {
        ipGeolocation: geoData,
        country: countryData,
        reverseDns
      },
      null,
      2
    );

    resultElement.classList.remove("hidden");
    showStatus("اطلاعات IP با موفقیت دریافت شد.", "success");

    window.setTimeout(() => {
      resultElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  } catch (error) {
    console.error(error);

    showStatus(
      error.message ||
        "دریافت اطلاعات ناموفق بود. کمی بعد دوباره تلاش کنید.",
      "error"
    );
  } finally {
    setLoading(false);
  }
}

async function fetchCountryData(countryCode) {
  if (!countryCode) {
    return null;
  }

  try {
    const fields = [
      "languages",
      "currencies",
      "flags",
      "idd"
    ].join(",");

    const response = await fetch(
      `${COUNTRY_API_BASE}${encodeURIComponent(countryCode)}` +
        `?fields=${fields}`,
      {
        headers: {
          Accept: "application/json"
        }
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn("Country API failed:", error);
    return null;
  }
}

async function fetchReverseDns(ip) {
  if (!ip) {
    return null;
  }

  try {
    const reverseName = createReverseDnsName(ip);

    if (!reverseName) {
      return null;
    }

    const url =
      `${DNS_API_BASE}?name=${encodeURIComponent(reverseName)}` +
      "&type=PTR";

    const response = await fetch(url, {
      headers: {
        Accept: "application/dns-json"
      }
    });

    if (!response.ok) {
      return null;
    }

    const dnsData = await response.json();

    if (!Array.isArray(dnsData.Answer)) {
      return null;
    }

    const ptrRecords = dnsData.Answer
      .filter((answer) => answer.type === 12 && answer.data)
      .map((answer) => answer.data.replace(/\.$/, ""));

    return ptrRecords.length > 0
      ? ptrRecords.join(", ")
      : null;
  } catch (error) {
    console.warn("Reverse DNS failed:", error);
    return null;
  }
}

function normalizeResult(geo, countryData, reverseDns) {
  const countryLanguages = countryData?.languages
    ? Object.values(countryData.languages).join("، ")
    : null;

  const countryCurrencies = countryData?.currencies
    ? Object.entries(countryData.currencies)
        .map(([code, currency]) => {
          const name = currency.name || code;
          const symbol = currency.symbol
            ? ` (${currency.symbol})`
            : "";

          return `${name}${symbol} - ${code}`;
        })
        .join("، ")
    : null;

  const geoCurrency = geo.currency
    ? [
        geo.currency.name,
        geo.currency.symbol,
        geo.currency.code
      ]
        .filter(Boolean)
        .join(" - ")
    : null;

  const callingCode = getCallingCode(
    countryData,
    geo.calling_code
  );

  return {
    ip: geo.ip,
    type: geo.type,
    country: geo.country,
    countryCode: geo.country_code,
    continent: geo.continent,
    city: geo.city,
    region: geo.region,
    postal: geo.postal,
    latitude: geo.latitude,
    longitude: geo.longitude,
    timezone: geo.timezone?.id,
    utc: geo.timezone?.utc,
    isp: geo.connection?.isp,
    organization: geo.connection?.org,
    asn: formatAsn(geo.connection?.asn),
    domain: geo.connection?.domain,
    currency: countryCurrencies || geoCurrency,
    languages: countryLanguages,
    callingCode,
    reverseDns,
    flag:
      countryData?.flags?.svg ||
      countryData?.flags?.png ||
      geo.flag?.img ||
      null,
    security: {
      vpn: getBoolean(geo.security?.vpn),
      proxy: getBoolean(geo.security?.proxy),
      tor: getBoolean(geo.security?.tor),
      hosting: getBoolean(
        geo.security?.hosting ??
        geo.security?.hosting_provider
      )
    },
    raw: geo
  };
}

function renderResult(data) {
  resultIp.textContent = data.ip || "نامشخص";
  infoGrid.replaceChildren();

  for (const field of INFO_FIELDS) {
    const card = document.createElement("article");
    card.className = "info-card";

    const label = document.createElement("span");
    label.className = "info-card__label";
    label.textContent = field.label;

    const value = document.createElement("div");
    value.className =
      `info-card__value${field.ltr ? " ltr" : ""}`;

    if (field.key === "country" && data.flag) {
      const flag = document.createElement("img");
      flag.className = "country-flag";
      flag.src = data.flag;
      flag.alt = data.country
        ? `پرچم ${data.country}`
        : "پرچم کشور";
      flag.loading = "lazy";

      value.append(flag);
    }

    const valueText = document.createElement("span");
    valueText.textContent = displayValue(data[field.key]);
    value.append(valueText);

    card.append(label, value);
    infoGrid.append(card);
  }

  renderSecurity(data.security);
  renderMap(data.latitude, data.longitude, data);
}

function renderSecurity(security) {
  const items = [
    { label: "VPN", value: security.vpn },
    { label: "Proxy", value: security.proxy },
    { label: "Tor", value: security.tor },
    { label: "Hosting / Datacenter", value: security.hosting }
  ];

  securityGrid.replaceChildren();

  for (const item of items) {
    const element = document.createElement("div");
    element.className = "security-item";

    const label = document.createElement("span");
    label.textContent = item.label;

    const value = document.createElement("span");
    value.className = "security-value";

    if (item.value === true) {
      value.textContent = "شناسایی شد";
      value.classList.add("danger");
    } else if (item.value === false) {
      value.textContent = "شناسایی نشد";
      value.classList.add("safe");
    } else {
      value.textContent = "نامشخص";
      value.classList.add("unknown");
    }

    element.append(label, value);
    securityGrid.append(element);
  }
}

function renderMap(latitude, longitude, data) {
  const lat = Number(latitude);
  const lon = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    osmLink.classList.add("hidden");
    return;
  }

  if (typeof L === "undefined") {
    showStatus(
      "اطلاعات دریافت شد، اما کتابخانه نقشه بارگذاری نشد.",
      "error"
    );
    return;
  }

  if (!map) {
    map = L.map("map", {
      scrollWheelZoom: false
    }).setView([lat, lon], 10);

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">' +
          "OpenStreetMap</a> contributors"
      }
    ).addTo(map);
  } else {
    map.setView([lat, lon], 10);
  }

  if (mapMarker) {
    mapMarker.remove();
  }

  mapMarker = L.marker([lat, lon]).addTo(map);

  const popup = [
    data.ip,
    data.city,
    data.region,
    data.country
  ]
    .filter(Boolean)
    .join(" - ");

  mapMarker.bindPopup(escapeHtml(popup)).openPopup();

  osmLink.href =
    `https://www.openstreetmap.org/?mlat=${lat}` +
    `&mlon=${lon}#map=10/${lat}/${lon}`;

  osmLink.classList.remove("hidden");

  window.setTimeout(() => {
    map.invalidateSize();
  }, 150);
}

async function copyResult() {
  if (!lastResult) {
    return;
  }

  const lines = INFO_FIELDS.map((field) => {
    return `${field.label}: ${displayValue(lastResult[field.key])}`;
  });

  lines.push(
    `VPN: ${securityText(lastResult.security.vpn)}`,
    `Proxy: ${securityText(lastResult.security.proxy)}`,
    `Tor: ${securityText(lastResult.security.tor)}`,
    `Hosting: ${securityText(lastResult.security.hosting)}`
  );

  try {
    await navigator.clipboard.writeText(lines.join("\n"));

    const oldText = copyButton.textContent;
    copyButton.textContent = "کپی شد";

    window.setTimeout(() => {
      copyButton.textContent = oldText;
    }, 1500);
  } catch (error) {
    showStatus(
      "مرورگر اجازه کپی خودکار را نداد.",
      "error"
    );
  }
}

function createReverseDnsName(ip) {
  if (isValidIpv4(ip)) {
    return `${ip.split(".").reverse().join(".")}.in-addr.arpa`;
  }

  if (isValidIpv6(ip)) {
    const expanded = expandIpv6(ip);

    if (!expanded) {
      return null;
    }

    const nibbles = expanded
      .replaceAll(":", "")
      .split("")
      .reverse()
      .join(".");

    return `${nibbles}.ip6.arpa`;
  }

  return null;
}

function expandIpv6(ip) {
  let address = ip.toLowerCase().split("%")[0];

  if (address.includes(".")) {
    const lastColon = address.lastIndexOf(":");
    const ipv4Part = address.slice(lastColon + 1);

    if (!isValidIpv4(ipv4Part)) {
      return null;
    }

    const octets = ipv4Part.split(".").map(Number);
    const firstGroup = (
      (octets[0] << 8) |
      octets[1]
    ).toString(16);

    const secondGroup = (
      (octets[2] << 8) |
      octets[3]
    ).toString(16);

    address =
      `${address.slice(0, lastColon)}:${firstGroup}:${secondGroup}`;
  }

  const halves = address.split("::");

  if (halves.length > 2) {
    return null;
  }

  const left = halves[0]
    ? halves[0].split(":").filter(Boolean)
    : [];

  const right = halves[1]
    ? halves[1].split(":").filter(Boolean)
    : [];

  if (halves.length === 1 && left.length !== 8) {
    return null;
  }

  const missingGroups = 8 - left.length - right.length;

  if (
    missingGroups < 0 ||
    (halves.length === 2 && missingGroups < 1)
  ) {
    return null;
  }

  const groups = [
    ...left,
    ...Array(missingGroups).fill("0"),
    ...right
  ];

  if (
    groups.length !== 8 ||
    groups.some((group) => !/^[0-9a-f]{1,4}$/i.test(group))
  ) {
    return null;
  }

  return groups
    .map((group) => group.padStart(4, "0"))
    .join(":");
}

function isValidIp(ip) {
  return isValidIpv4(ip) || isValidIpv6(ip);
}

function isValidIpv4(ip) {
  const parts = ip.split(".");

  if (parts.length !== 4) {
    return false;
  }

  return parts.every((part) => {
    if (!/^\d{1,3}$/.test(part)) {
      return false;
    }

    if (part.length > 1 && part.startsWith("0")) {
      return false;
    }

    const number = Number(part);
    return number >= 0 && number <= 255;
  });
}

function isValidIpv6(ip) {
  if (
    !ip.includes(":") ||
    !/^[0-9a-f:.%]+$/i.test(ip)
  ) {
    return false;
  }

  return expandIpv6(ip) !== null;
}

function getCallingCode(countryData, fallback) {
  const root = countryData?.idd?.root;
  const suffixes = countryData?.idd?.suffixes;

  if (root && Array.isArray(suffixes) && suffixes.length > 0) {
    return suffixes
      .slice(0, 5)
      .map((suffix) => `${root}${suffix}`)
      .join("، ");
  }

  return fallback || null;
}

function getBoolean(value) {
  return typeof value === "boolean" ? value : null;
}

function formatAsn(asn) {
  if (asn === null || asn === undefined || asn === "") {
    return null;
  }

  const value = String(asn);
  return value.toUpperCase().startsWith("AS")
    ? value
    : `AS\${value}`;
}

function displayValue(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "ارائه نشده";
  }

  return String(value);
}

function securityText(value) {
  if (value === true) {
    return "شناسایی شد";
  }

  if (value === false) {
    return "شناسایی نشد";
  }

  return "نامشخص";
}

function showStatus(message, type) {
  statusElement.textContent = message;
  statusElement.className = `status visible ${type}`;
}

function setLoading(loading) {
  searchButton.disabled = loading;
  myIpButton.disabled = loading;
  ipInput.disabled = loading;

  searchButton.textContent = loading
    ? "در حال بررسی..."
    : "بررسی IP";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
