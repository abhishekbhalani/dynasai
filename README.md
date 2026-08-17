# DynasAI

> AI systems for operators. APIs for builders.

Static marketing site for https://dynasai.ai — Astro SSG on Cloudflare Workers. The product/demo app will be a separate project on https://app.dynasai.ai.

## Stack

- Astro (static HTML)
- CSS variables, light/dark
- `@astrojs/sitemap`, MDX blog/docs, RSS
- Google Tag Manager (`GTM-KDPPRVV2`) in production builds
- Wrangler deploy to Workers static assets

## Local

```bash
npm install
cp .env.example .env
npm run dev
```

## Deploy

```bash
npx wrangler login
npm run deploy
```

Then in Cloudflare: attach custom domain `dynasai.ai` (and `www`) to this Worker. Later, create a second Worker for `app.dynasai.ai`.

## Env

See `.env.example`. GTM is omitted in `astro dev` so local traffic does not pollute analytics.

## Stitch MCP

Workspace MCP uses a stdio proxy (`.cursor/stitch-mcp-proxy.mjs`). `.cursor/mcp.json` is gitignored because it holds the API key. Reload MCP servers in Cursor after changing it.
