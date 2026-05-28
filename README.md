# DraftForge — Writer AI Mini App

Telegram Mini App frontend for the Writer AI assistant. React + TypeScript + Vite with
[`@telegram-apps/sdk-react`](https://docs.telegram-mini-apps.com/) and
[`@telegram-apps/telegram-ui`](https://github.com/Telegram-Mini-Apps/TelegramUI). It calls the
FastAPI backend's `POST /api/generate`, authenticating with the Telegram `initData` it
receives (sent as `Authorization: tma <initData>`).

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check (tsc -b) + production build to dist/
npm run typecheck
```

`VITE_API_BASE_URL` points the app at the backend. Local default (`.env.development`) is
`http://localhost:8000` — run the backend with `python -m writer_ai_assistant serve`.

> A Mini App can't run in a plain browser tab end-to-end: outside Telegram there is no
> `initData`, so generation returns 401 and the app shows an "Outside Telegram" notice. The
> UI still renders for layout work. To exercise the full flow you must open it inside
> Telegram (see below), which requires HTTPS — use a tunnel like `cloudflared`/`ngrok` to
> expose local uvicorn, or deploy.

## Deploy (GitHub Pages)

Pushing to `main` triggers [.github/workflows/deploy.yml](.github/workflows/deploy.yml),
which builds and publishes to Pages. Before it works end-to-end:

1. **Enable Pages**: repo Settings → Pages → Source = "GitHub Actions".
2. **Set the backend URL**: repo Settings → Secrets and variables → Actions → Variables →
   add `VITE_API_BASE_URL` = your deployed backend (e.g. `https://<app>.up.railway.app`).
3. The build sets `BASE_PATH=/DraftForgeFrontend/` so assets resolve under the project-page
   path `https://tyhen88.github.io/DraftForgeFrontend/`. The workflow also copies
   `index.html` → `404.html` so deep links don't 404 (Pages has no SPA rewrite).

### Backend must allow this origin

Set the backend's `FRONTEND_ORIGIN` to `https://tyhen88.github.io` (scheme + host, no path)
so CORS permits the Mini App. Tokens stay server-side — none are bundled here.

### Wire the bot

Point the bot's menu button (or a keyboard web-app button) at the Pages URL so Telegram
launches this app and supplies `initData`.
