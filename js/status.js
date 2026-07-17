export const STORAGE_KEY = "awayStatus";

export const DEFAULT_STATUS = Object.freeze({
  enabled: false,
  person: "",
  type: "vacation",
  startDate: "",
  returnDate: "",
  message: "",
  alternateContact: "",
  language: "auto",
  createdBy: "",
  updatedAt: "",
});

export function normalizeStatus(value = {}) {
  const source = value && typeof value === "object" ? value : {};
  return {
    ...DEFAULT_STATUS,
    enabled: source.enabled === true,
    person: clean(source.person, 80),
    type: ["vacation", "away", "business", "sick", "custom"].includes(source.type)
      ? source.type
      : DEFAULT_STATUS.type,
    startDate: validDate(source.startDate) ? source.startDate : "",
    returnDate: validDate(source.returnDate) ? source.returnDate : "",
    message: clean(source.message, 500),
    alternateContact: clean(source.alternateContact, 200),
    language: ["auto", "es", "ca", "en"].includes(source.language)
      ? source.language
      : DEFAULT_STATUS.language,
    createdBy: clean(source.createdBy, 64),
    updatedAt: typeof source.updatedAt === "string" ? source.updatedAt : "",
  };
}

export function isActive(status, now = new Date()) {
  const value = normalizeStatus(status);
  if (!value.enabled) return false;

  const today = localDateKey(now);
  if (value.startDate && today < value.startDate) return false;
  // The person is considered back and available on returnDate.
  if (value.returnDate && today >= value.returnDate) return false;
  return true;
}

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDate(dateKey, locale = "en") {
  if (!validDate(dateKey)) return "";
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(year, month - 1, day));
}

function validDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}
