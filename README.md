# DynasAI

> AI systems for operators. APIs for builders.

Static marketing site for https://dynasai.ai — Astro SSG on Cloudflare Workers. The product/demo app will be a separate project on https://app.dynasai.ai.

## Stack

- Astro (static HTML)
- CSS variables, light/dark
- `@astrojs/sitemap`, MDX blog/docs, RSS
- Google Tag Manager (`GTM-KDPPRVV2`) in production builds
- Google Analytics 4 in production when `PUBLIC_GA_MEASUREMENT_ID` is set (Consent Mode)
- Wrangler deploy to Workers static assets

## Local

```bash
npm install
cp .env.example .env
npm run dev
```

## Release (Cloudflare)

### Option A — API token (recommended)

1. Open [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. **Create Token** → **Edit Cloudflare Workers** template  
   (or custom: **Account → Workers Scripts → Edit**)
3. Copy token and account ID:

```powershell
copy .env.example .env
# Edit .env — set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID
```

4. Verify and deploy:

```powershell
npx wrangler whoami
npm run release
```

`npm run release` loads `CLOUDFLARE_*` from `.env` automatically.

### Option B — Browser login

```bash
npx wrangler login
npm run release
```

Other commands:

```bash
npm run release:dry   # build only, no deploy
npm run deploy        # build + wrangler deploy (no auth check)
npm run preview:cf    # local preview via wrangler dev
```

Custom domains `dynasai.ai` and `www.dynasai.ai` are set in `wrangler.jsonc` and applied on deploy. `www` 301s to the apex.

## Release (GitHub **or** Cloudflare — pick one)

### Path A — GitHub Actions

Actions → **Release** → **Run workflow** → **Use workflow from** (any branch).

### Path B — Cloudflare CLI

```powershell
npx wrangler whoami
npm run release
```

`npm run release` loads `CLOUDFLARE_*` from `.env`. Do not enable Cloudflare Git auto-deploy at the same time as GitHub Release, or the same commit ships twice.

Custom domains `dynasai.ai` / `www` are in `wrangler.jsonc` (zone id required).

## Analytics (Cloudflare Zaraz, not the app)

Add **Google Analytics 4** under Cloudflare → Zaraz on the `dynasai.ai` zone. The cookie banner sends consent to Zaraz. Do not embed GTM/gtag in source.

Sequence: `.ai/release-plan.md` (planning.md waves, one at a time).

## Env

See `.env.example`:

- `PUBLIC_*` — Astro site config
- `CLOUDFLARE_API_TOKEN` — wrangler deploy auth (gitignored)
- `CLOUDFLARE_ACCOUNT_ID` — optional; wrangler can infer from token

Never commit `.env`. Analytics are Cloudflare Zaraz in production, not local `astro dev`.

## Cloudflare agent setup

Official setup from [developers.cloudflare.com/agent-setup/prompt.md](https://developers.cloudflare.com/agent-setup/prompt.md):

- **Skills:** 13 Cloudflare skills in `~/.cursor/skills/` (wrangler, workers-best-practices, web-perf, etc.)
- **MCP:** `.cursor/mcp.json` — cloudflare, cloudflare-docs, cloudflare-bindings, cloudflare-builds, cloudflare-observability

Copy `.cursor/mcp.example.json` → `.cursor/mcp.json` and add your Stitch key if needed. **Restart Cursor** after changes. OAuth runs automatically on first Cloudflare MCP use.

## Stitch MCP

Workspace MCP uses a stdio proxy (`.cursor/stitch-mcp-proxy.mjs`). `.cursor/mcp.json` is gitignored because it holds the API key. Reload MCP servers in Cursor after changing it.
