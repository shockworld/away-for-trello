const translations = {
  en: {
    appName: "Away for Trello",
    setAvailability: "Set availability",
    settingsTitle: "Availability settings",
    noticeTitle: "Availability notice",
    active: "Publish this notice",
    person: "Name",
    personPlaceholder: "e.g. Miki",
    status: "Status",
    vacation: "On vacation",
    away: "Away",
    business: "Business trip",
    sick: "Sick leave",
    custom: "Unavailable",
    startDate: "First day away",
    returnDate: "Back on",
    message: "Message",
    messagePlaceholder: "When will you reply? What should clients know?",
    alternateContact: "Alternative contact",
    alternatePlaceholder: "Name, email, phone, or instructions",
    language: "Display language",
    automatic: "Automatic",
    save: "Save notice",
    saved: "Notice saved.",
    disabled: "No availability notice is active.",
    readOnly: "You can view this notice, but only board members with write access can change it.",
    invalidDates: "The return date must be after the first day away.",
    requiredName: "Add the name of the person who is away.",
    returns: "Back on {date}",
    starts: "Away from {date}",
    alternative: "Alternative contact",
    privacyHint: "This information is shared with everyone who can view the Trello board. Do not enter secrets or sensitive information.",
    footerPrivacy: "Privacy",
    footerSupport: "Support",
  },
  es: {
    appName: "Away for Trello",
    setAvailability: "Configurar disponibilidad",
    settingsTitle: "Configurar disponibilidad",
    noticeTitle: "Aviso de disponibilidad",
    active: "Publicar este aviso",
    person: "Nombre",
    personPlaceholder: "p. ej., Miki",
    status: "Estado",
    vacation: "De vacaciones",
    away: "Ausente",
    business: "Viaje de trabajo",
    sick: "Baja",
    custom: "No disponible",
    startDate: "Primer día de ausencia",
    returnDate: "Fecha de regreso",
    message: "Mensaje",
    messagePlaceholder: "¿Cuándo responderás? ¿Qué deben saber tus clientes?",
    alternateContact: "Contacto alternativo",
    alternatePlaceholder: "Nombre, email, teléfono o instrucciones",
    language: "Idioma del aviso",
    automatic: "Automático",
    save: "Guardar aviso",
    saved: "Aviso guardado.",
    disabled: "No hay ningún aviso de disponibilidad activo.",
    readOnly: "Puedes ver este aviso, pero solo los miembros con permiso de escritura pueden cambiarlo.",
    invalidDates: "La fecha de regreso debe ser posterior al primer día de ausencia.",
    requiredName: "Añade el nombre de la persona ausente.",
    returns: "De vuelta el {date}",
    starts: "Ausente desde el {date}",
    alternative: "Contacto alternativo",
    privacyHint: "Esta información se comparte con todas las personas que pueden ver el tablero de Trello. No incluyas secretos ni datos sensibles.",
    footerPrivacy: "Privacidad",
    footerSupport: "Ayuda",
  },
  ca: {
    appName: "Away for Trello",
    setAvailability: "Configura la disponibilitat",
    settingsTitle: "Configura la disponibilitat",
    noticeTitle: "Avís de disponibilitat",
    active: "Publica aquest avís",
    person: "Nom",
    personPlaceholder: "p. ex., Miki",
    status: "Estat",
    vacation: "De vacances",
    away: "Absent",
    business: "Viatge de feina",
    sick: "Baixa",
    custom: "No disponible",
    startDate: "Primer dia d'absència",
    returnDate: "Data de tornada",
    message: "Missatge",
    messagePlaceholder: "Quan respondràs? Què han de saber els clients?",
    alternateContact: "Contacte alternatiu",
    alternatePlaceholder: "Nom, correu, telèfon o instruccions",
    language: "Idioma de l'avís",
    automatic: "Automàtic",
    save: "Desa l'avís",
    saved: "Avís desat.",
    disabled: "No hi ha cap avís de disponibilitat actiu.",
    readOnly: "Pots veure aquest avís, però només els membres amb permís d'escriptura el poden canviar.",
    invalidDates: "La data de tornada ha de ser posterior al primer dia d'absència.",
    requiredName: "Afegeix el nom de la persona absent.",
    returns: "De tornada el {date}",
    starts: "Absent des del {date}",
    alternative: "Contacte alternatiu",
    privacyHint: "Aquesta informació es comparteix amb tothom que pot veure el tauler de Trello. No hi incloguis secrets ni dades sensibles.",
    footerPrivacy: "Privacitat",
    footerSupport: "Ajuda",
  },
};

export function languageFor(preference = "auto") {
  if (preference !== "auto" && translations[preference]) return preference;
  const browserLanguage = (navigator.language || "en").toLowerCase();
  if (browserLanguage.startsWith("ca")) return "ca";
  if (browserLanguage.startsWith("es")) return "es";
  return "en";
}

export function t(key, language = "en", values = {}) {
  const template = translations[language]?.[key] ?? translations.en[key] ?? key;
  return Object.entries(values).reduce(
    (result, [name, value]) => result.replaceAll(`{${name}}`, value),
    template,
  );
}

export function translatePage(language) {
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n, language);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder, language);
  });
}
