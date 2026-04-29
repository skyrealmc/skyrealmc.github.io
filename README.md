# Sky Realms SMP - Official Website

The frontend for the **Sky Realms SMP**, a Minecraft Bedrock Edition server. This is a static web application hosted on GitHub Pages, designed to provide information, handle whitelist applications, and showcase community resources.

## 🚀 Key Features

- **Discord OAuth2 Integration**: Securely link your Discord account to verify your identity.
- **Whitelist Application Gate**: 
    - **Guild Membership Check**: Only members of our official Discord server can submit whitelist applications.
    - **Automatic ID Capture**: Verified Discord IDs are automatically filled and locked in the form, preventing entry errors.
- **Bot Protection**: Integrated with **Cloudflare Turnstile** to ensure all submissions are human-verified.
- **Real-time Server Status**: Checks the live status of `play.skyrealm.fun`.
- **Launch Countdown**: Dynamic countdown to the Season 2 launch.
- **Design System**: High-performance "Purple Edition" aesthetic with responsive layouts and neon animations.

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS, Vanilla JavaScript.
- **Integrations**:
    - **Backend**: Communicates with [SkyBot S2](https://github.com/skyrealmc/skybot-official) via REST API.
    - **Auth**: Discord OAuth2 (Authorization Code Flow).
    - **Security**: Cloudflare Turnstile.
    - **Status**: [mcstatus.io](https://mcstatus.io/) API.

## 📂 Project Structure

- `/`: Landing page (`index.html`).
- `/whitelist/`: Secure whitelist application form.
- `/store/`: Rank hierarchy and perk showcase.
- `/assets/`:
    - `/css/`: Modular stylesheets (`style.css`, `whitelist.css`).
    - `/js/`: Frontend logic (session management, API services, UI animations).
- `dashboard.html`: Integrated user dashboard.

## 🔧 Development

As a static site, no build process is required.

### Local Setup
1. Clone the repository.
2. Serve the directory using any static file server:
   ```bash
   npx serve .
   # OR
   python3 -m http.server 8000
   ```
3. Ensure your local backend is running if testing API features.

## 📝 Recent Updates

- **Feat**: Implemented **Guild Membership Gate** requiring users to be in the Discord server before applying.
- **Feat**: Added **Cloudflare Turnstile** captcha for bot protection.
- **Fix**: Improved OAuth redirect reliability using the `state` parameter.
- **Fix**: Hidden manual Discord ID field for verified users to streamline UX.
