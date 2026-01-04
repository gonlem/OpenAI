This repository is a small Vite + Vue frontend that embeds the OpenAI JavaScript SDK in the browser.

Quick summary (what matters most):
- Single-page app: source lives under `frontend/` (Vite root is configured in `vite.config.js`).
- No backend in this repo — the OpenAI client is instantiated directly in the browser (see `frontend/App.vue`).
- A project-level `.env` exists at `frontend/.env` with `VITE_OPENAI_API_KEY` set (treat as a secret; do not commit keys in real projects).

How to run locally (explicit):
- Install dependencies from the repo root: `npm install`.
- Start the dev server from the repo root: `npm run dev`. Vite's `root` is set to `frontend/` in `vite.config.js`, so it will serve `frontend/index.html`.

Key files & patterns to reference:
- `frontend/App.vue` — main app UI and the only place using the OpenAI SDK. Look for `openai.responses.create({...})`.
  - Examples you can use directly: model selection (`gpt-5-nano`, `gpt-5`, `gpt-5.1`), `reasoning: { effort }`, `service_tier`, `temperature`, `tools: [{ type: 'web_search' }]`.
  - Note: the client is constructed with `dangerouslyAllowBrowser: true` and `apiKey: import.meta.env.VITE_OPENAI_API_KEY` — this is intentional in this repo but is sensitive and unexpected for production code.
- `frontend/.env` — Vite environment file key: `VITE_OPENAI_API_KEY`. The file currently exists in the repo; treat it as a secret and avoid spreading or committing real keys to public repos.
- `vite.config.js` — confirms Vite serves `frontend/` (`root: 'frontend'`).

Debugging & typical agent tasks:
- Viewing runtime errors: open the browser DevTools console while running `npm run dev`.
- When editing UI behavior: change `App.vue` functions such as `callResponsesApi()` and test immediately with the dev server.
- If adding a server/backend to hold the API key: update `frontend/App.vue` to call the backend instead of using `dangerouslyAllowBrowser`, and remove `VITE_OPENAI_API_KEY` usage in browser code.

Repo-specific constraints the agent should follow:
- Do not assume a backend exists — this repo uses the SDK in-browser.
- Always search `frontend/` for UI-related tasks; the root src is small and most logic lives in `frontend/App.vue`.
- When changing environment or secrets, check for any `.env` files in `frontend/` and add instructions in PR notes to rotate/rotate keys when necessary.

Examples for edits (copy/paste friendly):
- Update model list inside `frontend/App.vue` (options visible in `<select v-model="ai_model">`).
- Change maximum temperature step: edit `<input type="number" min="0" max="2" step="0.1" v-model="ai_temperature" />`.

Security note for humans/agents:
- This project stores an API key in `frontend/.env` and sets `dangerouslyAllowBrowser: true` — this is a risky configuration for sensitive keys. If you modify authentication or key storage, document where secrets are placed and how to rotate them.

If anything in these notes is unclear, ask for which area you'd like more detail (build/test/debug or a specific file). Keep changes small and test them with `npm run dev`.
