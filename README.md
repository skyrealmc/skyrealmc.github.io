# Sky Realms SMP - Official Website

Static frontend for the Sky Realms SMP community site. The website is hosted on GitHub Pages and uses the `skybot-official` backend for Discord authentication and whitelist submission.

## Features

- Landing page, rules, store, redeem, and whitelist pages
- Discord OAuth-based whitelist application flow
- Guild membership gate before whitelist submission
- Cloudflare Turnstile protection on the whitelist form
- Live Bedrock server status via `mcstatus.io`
- Responsive static frontend with no build step

## Integration With Bot Backend

The website is wired to the bot backend hosted at `https://skybot.skyrealm.fun`.

Current backend dependencies:

- `GET /auth/login` - start Discord login
- `GET /auth/session` - fetch current Discord session
- `POST /auth/logout` - clear session
- `POST /api/whitelist/apply` - submit whitelist application

Whitelist submissions only succeed when the user:

- is logged in with Discord
- is a member of the required Discord guild
- completes Cloudflare Turnstile

## Project Structure

- `/index.html` - main landing page
- `/whitelist/` - public whitelist application page
- `/store/`, `/redeem/`, `/rules/` - static content pages
- `/assets/css/` - shared site styling
- `/assets/js/main.js` - shared UI and live server status logic
- `/assets/js/whitelist.js` - Discord auth + whitelist form integration
- `/dashboard.html` - static demo/dashboard mockup, not backed by live user data

## Local Development

Serve the repo with a static server:

```bash
npx serve .
# or
python3 -m http.server 8000
```

For whitelist testing, the bot backend must also be running and configured for cross-origin requests from your local origin.

## Current Production Notes

- Production domain: `https://skyrealm.fun`
- Whitelist page uses cross-origin cookies with the bot backend
- Server status is fetched directly from `https://api.mcstatus.io`
- `dashboard.html` is demo content only and should not be treated as a live account dashboard

## Recent Updates

- Fixed Discord auth handling on the whitelist form
- Added localStorage helpers used after successful whitelist submission
- Improved user-facing message when Discord login is missing or expired
- Confirmed website-to-bot backend wiring for whitelist and session flows
