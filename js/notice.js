import { languageFor, t, translatePage } from "./i18n.js?v=5";
import { formatDate, isActive, normalizeStatus, STORAGE_KEY } from "./status.js?v=5";

const trello = window.TrelloPowerUp.iframe({ helpfulStacks: true });
const content = document.querySelector("#notice-content");
const settingsUrl = new URL("../settings.html?v=5", import.meta.url).href;

init();

async function init() {
  try {
    const status = normalizeStatus(await trello.get("board", "shared", STORAGE_KEY, {}));
    const language = languageFor(status.language);
    translatePage(language);

    if (!isActive(status)) {
      content.innerHTML = `<p class="empty">${escapeHtml(t("disabled", language))}</p>`;
      return;
    }

    document.querySelector("#notice-person").textContent = status.person;
    document.querySelector("#notice-status").textContent = t(status.type, language);
    setOptional("#notice-start", status.startDate && t("starts", language, {
      date: formatDate(status.startDate, language),
    }));
    setOptional("#notice-return", status.returnDate && t("returns", language, {
      date: formatDate(status.returnDate, language),
    }));
    setOptional("#notice-message", status.message);

    const contact = document.querySelector("#notice-contact");
    if (status.alternateContact) {
      contact.hidden = false;
      contact.querySelector("dd").textContent = status.alternateContact;
    }

    const member = await trello.member("id").catch(() => ({}));
    const canEditLegacyNotice = !status.createdBy && trello.memberCanWriteToModel("board");
    if ((status.createdBy && member.id === status.createdBy) || canEditLegacyNotice) {
      document.querySelector("#notice-actions").hidden = false;
      document.querySelector("#edit-notice").addEventListener("click", (event) => trello.popup({
        title: t("settingsTitle", language),
        url: settingsUrl,
        height: 610,
        mouseEvent: event,
      }));
    }
  } catch (error) {
    content.innerHTML = `<p class="feedback error">${escapeHtml(error.message || "Unable to load notice.")}</p>`;
  } finally {
    trello.sizeTo("#content").catch(() => {});
  }
}

function setOptional(selector, value) {
  const element = document.querySelector(selector);
  if (value) {
    element.textContent = value;
    element.hidden = false;
  }
}

function escapeHtml(value) {
  const node = document.createElement("span");
  node.textContent = value;
  return node.innerHTML;
}
