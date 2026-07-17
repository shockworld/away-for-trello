# Away for Trello

A free, privacy-friendly Trello Power-Up that places a clear availability status in the board header. Board members can publish an absence, return date, personal message, and alternative contact without creating an external account.

## What the MVP includes

- Vacation, away, business trip, sick leave, and custom statuses.
- A board-header button with the current status.
- A detail popup with dates, message, and alternative contact.
- Automatic visual expiry on the return date.
- Spanish, Catalan, and English interface.
- Shared Trello board storage only: no backend, analytics, cookies, or external database.
- Permission-aware settings: read-only members can view a notice but cannot edit it.

## Trello configuration

Create an app in the [Trello app administration portal](https://trello.com/power-ups/admin) and use:

- **Iframe connector URL:** `https://away-for-trello.shockworld.network/`
- **Capabilities:** `board-buttons`, `card-badges`, `show-settings`

For initial private testing, enable the Power-Up on a test board and open **Power-Ups → Away for Trello → Settings**.

## Local development

The project is static and has no runtime dependencies. Serve the repository root over HTTP; opening files directly with `file://` is not supported by Trello.

```sh
npm test
npm run check
python3 -m http.server 4173
```

Then visit `http://localhost:4173`. Trello itself requires an HTTPS connector URL, so use the deployed GitHub Pages URL for integration testing.

## Project structure

```text
├── index.html          # Trello connector and public landing page
├── settings.html       # Board configuration popup
├── notice.html         # Read-only status popup
├── privacy.html        # Privacy policy
├── support.html        # Support and troubleshooting
├── css/styles.css
├── images/
│   ├── away-for-trello.png # App icon and favicon
│   └── icon.svg            # Compact board-button icon
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
