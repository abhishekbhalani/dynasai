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

## GitHub Actions (manual production release)

This repo uses **Workers static assets**, not Cloudflare Pages. After a PR merges to `main`, production is not auto-deployed.

1. Create a Cloudflare API token ([API Tokens](https://dash.cloudflare.com/profile/api-tokens) → **Edit Cloudflare Workers**)
2. Put `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in `.env`
3. Push them to GitHub:

```powershell
npm run cicd:github
```

4. Merge a PR to `main`
5. GitHub → **Actions** → **Release** → **Run workflow** → pick any branch in **Use workflow from**

Optional: GitHub → Settings → Environments → **production** → add required reviewers so Release waits for approval.

Later, create a second Worker for `app.dynasai.ai`.

## Env

See `.env.example`:

- `PUBLIC_*` — Astro site config
- `CLOUDFLARE_API_TOKEN` — wrangler deploy auth (gitignored)
- `CLOUDFLARE_ACCOUNT_ID` — optional; wrangler can infer from token

Never commit `.env`. GTM and GA4 are omitted in `astro dev` so local traffic does not pollute analytics.

## Google Tags MCP (Cursor)

`.cursor/mcp.json` (gitignored) includes:

- `dynasai-google-tags` — Google Tag Manager (Stape remote MCP; Google sign-in on first use)
- `dynasai-google-analytics` — GA4 Data API MCP

Reload MCP servers in Cursor after changing `.cursor/mcp.json`. Set `PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX` in `.env` and GitHub Actions variables. Do not also publish a GA4 Config tag in GTM for the same ID.

## Cloudflare agent setup

Official setup from [developers.cloudflare.com/agent-setup/prompt.md](https://developers.cloudflare.com/agent-setup/prompt.md):

- **Skills:** 13 Cloudflare skills in `~/.cursor/skills/` (wrangler, workers-best-practices, web-perf, etc.)
- **MCP:** `.cursor/mcp.json` — cloudflare, cloudflare-docs, cloudflare-bindings, cloudflare-builds, cloudflare-observability

Copy `.cursor/mcp.example.json` → `.cursor/mcp.json` and add your Stitch key if needed. **Restart Cursor** after changes. OAuth runs automatically on first Cloudflare MCP use.

## Stitch MCP

Workspace MCP uses a stdio proxy (`.cursor/stitch-mcp-proxy.mjs`). `.cursor/mcp.json` is gitignored because it holds the API key. Reload MCP servers in Cursor after changing it.
