# ୨ৎ・GIRLS & BOYS PARADISE 🌸

**CHAT • GAMING • VOICE • MUSIC • EVENTS**

A modular Discord community platform: a responsive React admin dashboard, a Cloudflare Workers API, a persistent Node.js Discord bot, and one shared Cloudflare D1 database. The bot is deliberately hosted separately from Workers because it needs a persistent Discord Gateway connection.

> **Current release: Phase 1 foundation.** This repository now contains the working monorepo, database schema and initial migration, API health endpoint, responsive dashboard shell, and a minimal Discord bot with `/ping`. Most community modules and Discord OAuth administration are roadmap work and are not presented as operational features. The dashboard shows no invented member counts or activity.

## What's in the foundation

- **Dashboard:** React + TypeScript + Vite, responsive navigation, mobile drawer, an API health check, and honest empty states. Overview values remain blank until real data endpoints exist.
- **API:** Hono on Cloudflare Workers, JSON health endpoints, restricted CORS configuration, safe not-found/error responses, and an optional D1 binding.
- **Bot:** discord.js v14, modular command handler, clean startup/shutdown, slash command registration and a private `/ping` response.
- **Database:** SQLite/D1-compatible Drizzle schema and a versioned migration for guild settings, members, interests, giveaways, rewards, moderation, staff, audit records, tickets, announcements, XP and voice activity.
- **Shared package:** common product identity and API health types.

## Technology

Node.js 20.11+ / npm 10+, TypeScript, React 18, Vite, Tailwind CSS 4, Lucide, Hono, Cloudflare Workers, D1, Drizzle ORM, Discord.js 14.

## Repository map

```text
apps/
  api/                 Hono Worker and Wrangler/D1 configuration
  bot/                 persistent Discord Gateway bot
  dashboard/           React + Vite responsive dashboard
packages/
  config/              shared TypeScript config
  database/
    schema/            Drizzle schema (single shared D1 database)
    migrations/        version-controlled SQL migrations
  shared/              shared types and brand constants
.github/workflows/     CI build and typecheck
.env.example           local variable-name reference only; no secrets
```

## Prerequisites

- Node.js **20.11 or newer** and npm **10.2 or newer**.
- A terminal. On Android, Termux can run Node.js and npm; alternatively edit in GitHub Codespaces or another Linux development environment. Cloudflare deployments, Discord OAuth and Gateway connections still need their respective accounts and valid configuration.
- For the bot, a Discord account and a Discord Developer Portal application.
- For production API/database hosting, a Cloudflare account (the dashboard can be statically hosted without Cloudflare, but D1/Workers deployment requires it).

## Quick local setup

From the repository root:

```bash
npm install
cp .env.example .env
```

Edit `.env` only on your machine. The bot reads its environment directly. For Wrangler local secrets, use `apps/api/.dev.vars` (ignored by Git), not a committed file. Start services in separate terminals:

```bash
npm run dev:api       # http://localhost:8787
npm run dev           # Vite dashboard, usually http://localhost:5173
npm run dev:bot       # requires Discord bot configuration (see below)
```

The dashboard proxies `/api` to the local Worker. If the API is stopped, the dashboard reports that status instead of inventing server data.

## Discord application and bot setup

1. In the [Discord Developer Portal](https://discord.com/developers/applications), create an application and add a **Bot**. Copy the bot token once and store it privately in `.env`; never paste it into source code or the browser.
2. Add these variables to the root `.env`:

   ```env
   DISCORD_BOT_TOKEN=your_bot_token
   DISCORD_CLIENT_ID=your_application_id
   DISCORD_GUILD_ID=your_test_server_id
   ```

   `DISCORD_GUILD_ID` is optional. Set it during development so slash commands register quickly in one test server. Leave it blank for global command registration.
3. In OAuth2 / URL Generator, invite the bot to a test server with `bot` and `applications.commands` scopes. The foundation needs **View Channels**, **Send Messages**, and **Use Application Commands** for `/ping`. Grant only permissions required by enabled modules; moderation, roles, and private tickets will need additional permissions when those modules are implemented. Do not grant Administrator by default.
4. Start the bot with `npm run dev:bot`. Register the current slash command with `npm run register-commands --workspace @gbp/bot`. Try `/ping` in the server.
5. Intents are deliberately minimal (`Guilds`) in this foundation. Welcome/member events will require enabling the relevant privileged **Server Members Intent** in the portal and adding it to the bot in a later phase.

## Database and Cloudflare D1

One shared database migration history lives in `packages/database/migrations` and is referenced by the API's Wrangler config.

1. Install dependencies, then create a D1 database:

   ```bash
   npx wrangler login
   npx wrangler d1 create gbp-community
   ```

2. Replace `REPLACE_WITH_CLOUDFLARE_D1_DATABASE_ID` in `apps/api/wrangler.jsonc` with the database ID Wrangler returned. Keep the database name and migration path intact.
3. Apply locally for development or remotely for deployment:

   ```bash
   npm run db:migrate:local
   npm run db:migrate:remote
   ```

4. Keep future schema changes synchronized: update `packages/database/schema/index.ts`, add a new numbered `.sql` migration under `packages/database/migrations/`, and review its SQL. Do not edit an already-applied migration. Apply locally before remote:

   ```bash
   npm run db:migrate:local
   npm run db:migrate:remote
   ```

The SQL migration history is intentionally checked in and applied by Wrangler. The API currently reports whether a D1 binding is present; application routes that query domain data will be added in later phases.

## Run, check, and build

```bash
npm run typecheck
npm run test
npm run build
npm run lint
```

`npm run build` builds the shared package before the API, bot and dashboard. `npm run test` runs workspace tests where defined. A production bot build is in `apps/bot/dist`; launch it with `npm run start --workspace @gbp/bot` after setting runtime environment variables.

## Environment and secrets

`.env.example` documents local variable names and contains no credentials. Never commit `.env`, `apps/api/.dev.vars`, tokens, OAuth secrets, D1 credentials, or real user exports. Git ignores these files. Rotate any secret that is accidentally exposed.

| Variable | Used by | Purpose |
|---|---|---|
| `DISCORD_BOT_TOKEN` | Bot | Gateway login; secret |
| `DISCORD_CLIENT_ID` | Bot / future OAuth | Discord application ID |
| `DISCORD_CLIENT_SECRET` | Future API OAuth | OAuth secret; server-side only |
| `DISCORD_GUILD_ID` | Bot | Optional development guild command registration |
| `API_BASE_URL` | Bot | API origin for future authenticated bot requests |
| `BOT_API_SECRET` | Bot / Worker | Future server-to-server authentication; set as a Worker secret, never a public var |
| `DASHBOARD_URL` | Future OAuth/API | Dashboard callback/origin configuration |
| `DISCORD_REDIRECT_URI` | Future OAuth | Exact Discord OAuth callback URL |
| `VITE_API_BASE_URL` | Dashboard | Optional public API base URL; leave blank for same-origin/proxy use |
| `DASHBOARD_ORIGIN` | Worker | Exact allowed dashboard origin, no wildcard in production |

To set a Worker secret use `npx wrangler secret put BOT_API_SECRET --config apps/api/wrangler.jsonc`. The OAuth variables are documented for planned work; OAuth login is **not implemented yet**.

## Deploying the services

### API + D1

- Create a D1 database, update the ID in `apps/api/wrangler.jsonc`, and apply migrations to the remote database.
- Set production `DASHBOARD_ORIGIN` to the exact deployed dashboard origin in Wrangler configuration (or your chosen environment setup).
- Add `BOT_API_SECRET` with `wrangler secret put` when bot-to-API endpoints are introduced.
- Deploy with `npm run deploy --workspace @gbp/api`. The current Worker exposes `/health` and `/api/health` only; it is not yet a management API.

### Dashboard

Build with `npm run build --workspace @gbp/dashboard`; publish `apps/dashboard/dist` as a static site on Cloudflare Pages or another static host. Configure `VITE_API_BASE_URL` at build time if the API uses a different origin. The current UI is a foundation/status shell, not an authenticated admin product.

### Bot

Build with `npm run build --workspace @gbp/bot`; run `npm run start --workspace @gbp/bot` on a host that supports a persistent Node.js process and outbound WebSocket connections. Add the Discord token through that host's secret manager. A free host may sleep or stop processes; continuous availability is not guaranteed. Cloudflare Workers are not suitable for this Gateway process.

## Troubleshooting

- **Bot says a variable is missing:** check the root `.env` name and ensure the bot is launched from this repository via the npm workspace script.
- **Invalid token / login failure:** reset the bot token in the Developer Portal and update the secret locally; never include it in a bug report.
- **Slash command not visible:** run the registration command, confirm `DISCORD_CLIENT_ID` / `DISCORD_GUILD_ID`, and ensure the bot invite included `applications.commands`.
- **Dashboard API offline:** start `npm run dev:api` in a second terminal. API health is reachable at `http://localhost:8787/api/health`.
- **Wrangler D1 migration fails:** verify the D1 ID, database name, Wrangler authentication and migration path. Use `npm run db:migrate:local` before changing production.
- **Port already in use:** stop the other local process or use the relevant tool's port option.
- **Android:** installing packages and managing secrets is easier in Termux or a cloud development environment. Keep secret files private and do not store them in a public/shared downloads folder.

## Development roadmap

1. **Foundation (current):** monorepo, shared types, schema/migration, Worker health route, bot skeleton, responsive dashboard.
2. **Discord core:** welcome, optional onboarding and role selections, verification, persistent configuration and registration.
3. **Community management:** permission-checked moderation, private reports, anti-spam, tickets and announcements.
4. **Engagement:** persisted giveaways, transparent winner selection, reward claims, XP/leaderboard and privacy-conscious voice summaries.
5. **Admin dashboard:** Discord OAuth, server permission checks, real API-backed management screens, audit trail and mobile QA.
6. **Hardening/deployment:** integration tests, rate limits, recovery, security review and deployment verification.

Features are only considered complete after implementation and tests. Voice is never recorded; giveaways remain free to enter; gender/profile preferences must remain optional; sensitive reports must stay private.
