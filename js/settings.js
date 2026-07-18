import { languageFor, t, translatePage } from "./i18n.js?v=8";
import { DEFAULT_STATUS, normalizeStatus, STORAGE_KEY } from "./status.js?v=8";

const trello = window.TrelloPowerUp.iframe();
const form = document.querySelector("form");
const feedback = document.querySelector("#feedback");
const fields = [...form.elements];
let status = { ...DEFAULT_STATUS };
let language = languageFor();
let currentMember = {};

init();

async function init() {
  try {
    status = normalizeStatus(await trello.get("board", "shared", STORAGE_KEY, {}));
    currentMember = await trello.member("id", "fullName").catch(() => ({}));
    if (!status.person) status.person = currentMember.fullName || "";
    language = languageFor(status.language);
    populate(status);
    translatePage(language);

    const canWrite = trello.memberCanWriteToModel("board");
    fields.forEach((field) => { field.disabled = !canWrite; });
    if (!canWrite) showFeedback(t("readOnly", language), "info");
  } catch (error) {
    showFeedback(error.message || "Unable to load settings.", "error");
  } finally {
    trello.sizeTo("#content").catch(() => {});
  }
}

function populate(value) {
  form.enabled.checked = value.enabled;
  form.person.value = value.person;
  form.type.value = value.type;
  form.startDate.value = value.startDate;
  form.returnDate.value = value.returnDate;
  form.message.value = value.message;
  form.alternateContact.value = value.alternateContact;
  form.cardScope.value = value.cardScope;
  form.language.value = value.language;
}

form.language.addEventListener("change", () => {
  language = languageFor(form.language.value);
  translatePage(language);
  trello.sizeTo("#content").catch(() => {});
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  feedback.hidden = true;

  if (!trello.memberCanWriteToModel("board")) {
    showFeedback(t("readOnly", language), "error");
    return;
  }

  const value = normalizeStatus({
    enabled: form.enabled.checked,
    person: form.person.value,
    type: form.type.value,
    startDate: form.startDate.value,
    returnDate: form.returnDate.value,
    message: form.message.value,
    alternateContact: form.alternateContact.value,
    cardScope: form.cardScope.value,
    language: form.language.value,
    createdBy: status.createdBy || currentMember.id || "",
    updatedAt: new Date().toISOString(),
  });

  if (value.enabled && !value.person) {
    showFeedback(t("requiredName", language), "error");
    form.person.focus();
    return;
  }
  if (value.startDate && value.returnDate && value.returnDate <= value.startDate) {
    showFeedback(t("invalidDates", language), "error");
    form.returnDate.focus();
    return;
  }

  try {
    await trello.set("board", "shared", STORAGE_KEY, value);
    showFeedback(t("saved", language), "success");
    await trello.notifyParent("done");
  } catch (error) {
    showFeedback(error.message || "Unable to save the notice.", "error");
  }
});

function showFeedback(message, kind) {
  feedback.textContent = message;
  feedback.className = `feedback ${kind}`;
  feedback.hidden = false;
  trello.sizeTo("#content").catch(() => {});
}
