# Sky Realms SMP - Project Overview

This project is the official website for **Sky Realms SMP**, a Minecraft Bedrock Edition server. It is a static web application designed to provide information about the server, manage whitelist applications, showcase store items (ranks), and handle reward redemptions.

## Technology Stack
- **Frontend:** HTML5, Vanilla CSS, Vanilla JavaScript.
- **Design System:** "Purple Edition" aesthetic with neon colors and dark themes, utilizing Orbitron and Poppins fonts.
- **Integrations:**
  - **Server Status:** [mcstatus.io](https://mcstatus.io/) API for real-time Bedrock server status.
  - **Community:** [WidgetBot](https://widgetbot.io/) for Discord integration.
- **Hosting:** GitHub Pages.

## Project Structure
- `/`: Main landing page (`index.html`).
- `/assets/`: Core assets.
  - `/css/`: Stylesheets (`style.css` for main theme, `whitelist.css` for forms).
  - `/js/`: Frontend logic.
    - `main.js`: Shared functionality, navigation, animations, and global namespace (`window.SkyRealms`).
    - `utils.js`: Common utility functions (DOM, events, storage, formatting) exposed via `window.SkyRealmsUtils`.
    - `services/api.js`: Mock API service layer for future backend integration (Payment, Redeem, Auth).
    - `store.js`, `redeem.js`, `whitelist.js`, `ui.js`, `animations.js`: Page-specific logic.
- `/data/`: Static data storage.
  - `ranks.json`: Defines the server rank hierarchy (Diamond, Guardian, Mystic, Astral, Cosmic, Legacy) and their perks.
- `/store/`, `/redeem/`, `/whitelist/`, `/rules/`: Feature-specific subdirectories containing their respective `index.html`.
- `dashboard.html`: User dashboard interface.

## Key Features
- **Server Launch Countdown:** Real-time countdown to Season 2 launch (UTC-based).
- **Server Status Checker:** Automatically checks if `play.skyrealm.fun:25773` is online.
- **Whitelist Application:** Interactive form for players to apply for server access with **Discord OAuth2 integration** for ID verification.
- **Store Showcase:** Dynamic rendering of ranks and perks from `ranks.json`.
- **Redeem System:** Client-side mock for redeeming gift codes.
- **Shared UI System:** Custom dialog/modal and notification (toast) system defined in `main.js`.

## Development Conventions
1. **Global Namespace:** Shared functions are exposed on `window.SkyRealms`, `window.SkyRealmsUtils`, and `window.SkyRealmsAPI`.
2. **Vanilla JS:** Avoid external libraries unless necessary. Use the provided utility functions in `utils.js`.
3. **Backend Integration:**
   - **Whitelist:** Connected to `https://skybot.skyrealm.fun/api/whitelist/apply`.
   - **Discord Auth:** Integrated with `https://skybot.skyrealm.fun/auth/` for session management and OAuth.
   - **Mocking:** Payments and some other API tasks are currently mocked in `api.js`.
4. **Styling:** CSS uses variables for theming (mostly purple/neon). Responsive design is handled via media queries in `style.css`.
5. **Rate Limiting:** A client-side mock `RateLimiter` is available in `utils.js` for sensitive actions like form submissions and code redemptions.

## Building and Running
As a static website, there is no build process.
- **Local Development:** Use any static file server.
  ```bash
  npx serve .
  # OR
  python3 -m http.server 8000
  ```
- **Deployment:** Push to the `main` branch to trigger GitHub Pages deployment.

## TODO / Future Roadmap
- [ ] Connect `api.js` to a real backend for all services.
- [ ] Integrate a payment gateway (Stripe/PayPal) for the store.
- [ ] Implement server-side whitelist validation (fully integrated with bot).
