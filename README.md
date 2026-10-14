# Away for Trello

A free, privacy-friendly Trello Power-Up that displays vacation, holiday, out-of-office and availability notices in the board header and on cards. Board members can publish an absence, return date, personal message, and alternative contact without creating an external account.

Away for Trello is publicly available in Trello's Power-Up library.

[Add Away for Trello to a board](https://trello.com/power-ups/6a5a1c5a7ebad14e65709232/enable)

## Features

- Vacation, away, business trip, sick leave, and custom statuses.
- A board-header button with the current status.
- A detail popup with dates, message, and alternative contact.
- Card visibility can apply to every card or only cards assigned to the notice creator.
- Automatic visual expiry on the return date.
- Spanish, Catalan, and English interface.
- Shared Trello board storage only: no backend, analytics, cookies, or external database.
- Permission-aware settings: read-only members can view a notice but cannot edit it.

## Installation

Install the published Power-Up from Trello's Power-Up library using the link above, then open **Power-Ups → Away for Trello → Settings** on the board where you want to configure an availability notice.

No manual Power-Up registration, API key, external account, or separate authorization is required for normal use.

## Maintainer configuration

The production Power-Up is registered in Trello with:

- **Iframe connector URL:** `https://away-for-trello.shockworld.net/?v=9`
- **Capabilities:** `board-buttons`, `card-badges`, `card-detail-badges`, `show-settings`

These settings are only relevant when maintaining or developing the Power-Up; end users should install the published version from Trello's Power-Up library.

## Local development

The project is static and has no runtime dependencies. Serve the repository root over HTTP; opening files directly with `file://` is not supported by Trello.

```sh
npm test
npm run check
python3 -m http.server 4173
```

Then visit `http://localhost:4173`. Trello itself requires an HTTPS connector URL, so use an HTTPS deployment for integration testing with a development Power-Up registration.

## Project structure

```text
├── index.html          # Trello connector and public landing page
├── settings.html       # Board configuration popup
├── notice.html         # Read-only status popup
├── privacy.html        # Privacy policy
├── support.html        # Support and troubleshooting
├── css/styles.css
├── images/
│   ├── app-icon-v4.png     # App icon
│   ├── favicon-v4.png      # Browser favicon
│   ├── apple-touch-icon-v4.png
│   └── board-icon-v9.svg   # Monochrome board-button icon
├── js/
│   ├── i18n.js
│   ├── notice.js
│   ├── power-up.js
│   ├── settings.js
│   └── status.js
└── test/status.test.js
```

## Privacy

Configuration is stored as shared Power-Up data on the Trello board. Anyone who can view that board may be able to read it, so users should not enter secrets or sensitive personal information. See the full [privacy policy](privacy.html).

## License

[MIT](LICENSE)
