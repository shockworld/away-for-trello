import { languageFor, t as translate } from "./i18n.js?v=8";
import { formatDate, isActive, normalizeStatus, STORAGE_KEY } from "./status.js?v=8";

const ICON = new URL("../images/board-icon-v9.svg", import.meta.url).href;
const SETTINGS = new URL("../settings.html?v=8", import.meta.url).href;
const NOTICE = new URL("../notice.html?v=8", import.meta.url).href;

if (window.self !== window.top) document.body.classList.add("embedded");

function openSettings(t) {
  return t.popup({ title: "Away for Trello", url: SETTINGS, height: 610 });
}

function openNotice(t) {
  return t.popup({ title: "Away for Trello", url: NOTICE, height: 420 });
}

async function boardButtons(t) {
  const raw = await t.get("board", "shared", STORAGE_KEY, {});
  const status = normalizeStatus(raw);
  const language = languageFor(status.language);

  if (!isActive(status)) {
    if (!t.memberCanWriteToModel("board")) return [];
    return [{
      icon: ICON,
      text: translate("setAvailability", language),
      callback: openSettings,
      condition: "edit",
    }];
  }

  const label = translate(status.type, language);
  return [{
    icon: ICON,
    text: `${status.person}: ${label}`,
    callback: openNotice,
  }];
}

async function cardBadges(t) {
  const raw = await t.get("board", "shared", STORAGE_KEY, {});
  const status = normalizeStatus(raw);
  if (!isActive(status)) return [];
  if (!await shouldShowOnCard(t, status)) return [];

  const language = languageFor(status.language);
  const icon = {
    vacation: "🏖️",
    away: "⏳",
    business: "✈️",
    sick: "🤒",
    custom: "⛔",
  }[status.type];
  const returnDate = formatBadgeDate(status.returnDate, language);

  return [{
    text: `${icon} ${status.person}${returnDate ? ` ↩ ${returnDate}` : ""}`,
    color: status.type === "sick" ? "red" : "orange",
  }];
}

function formatBadgeDate(dateKey, language) {
  if (!dateKey) return "";
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat(language, {
    day: "numeric",
    month: "short",
  }).format(new Date(year, month - 1, day)).replaceAll(".", "");
}

async function shouldShowOnCard(t, status) {
  if (status.cardScope !== "assigned") return true;
  if (!status.createdBy) return false;
  const card = await t.card("members");
  return (card.members || []).some((member) => member.id === status.createdBy);
}

async function cardDetailBadges(t) {
  const raw = await t.get("board", "shared", STORAGE_KEY, {});
  const status = normalizeStatus(raw);
  if (!isActive(status)) return [];
  if (!await shouldShowOnCard(t, status)) return [];

  const language = languageFor(status.language);
  const label = translate(status.type, language);
  const returnDate = formatDate(status.returnDate, language);
  const returns = returnDate
    ? ` · ${translate("returns", language, { date: returnDate })}`
    : "";

  return [{
    title: translate("noticeTitle", language),
    text: `🏖️ ${status.person}: ${label}${returns}`,
    color: status.type === "sick" ? "red" : "orange",
    callback: openNotice,
  }];
}

window.TrelloPowerUp.initialize({
  "board-buttons": boardButtons,
  "card-badges": cardBadges,
  "card-detail-badges": cardDetailBadges,
  "show-settings": openSettings,
});
