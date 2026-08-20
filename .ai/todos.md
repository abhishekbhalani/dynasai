# Todos

## Resume this chat — ask the user

- [ ] **Ask:** When should we set up Cloudflare Email Sending (`wrangler email sending enable dynasai.ai`) and turn on the playbook OTP in production?
- [ ] **Wait:** Do **not** start KV + email as a live facility until the playbook/UI is finalized. Code/KV namespace may exist; do not treat email sending + lead pipeline as “on” until the user says UI is final.

## Open

- [ ] Restart Cursor to load MCP: Cloudflare (OAuth) + `dynasai-zaraz` (reads `.env` token)
- [x] GitHub Actions Release (manual) + production env/variables/secrets
- [ ] First production release from GitHub Actions → Release (includes `admin.dynasai.ai`)
- [ ] wrangler login + first deploy (user will run login)
- [x] Attach dynasai.ai / www / admin in wrangler.jsonc (applied on deploy)
- [x] Dual release: GitHub Action or `npm run release` (Cloudflare)
- [x] GTM/GA removed from app — use Cloudflare Zaraz
- [ ] Token: add Zone **Zaraz Edit** + **Config Rules Edit** (Workers token is not enough for Tag setup)
- [ ] Push and run **one** Release
- [ ] Zaraz: add GA4 `G-XXXXXXXX` on the dynasai.ai zone; skip Zaraz on admin host
- [ ] Google Search Console property for dynasai.ai
- [x] Contact form: branded HTML email (logo, geo/IP/UA, journey), name+email required only
- [ ] Hide Start Building / app.dynasai.ai until demo (`site.appEnabled` in `src/config.ts`). Then design app.dynasai.ai.
- [ ] Add Cloudflare MX for Email Routing; enable Email Sending if form notify does not arrive.
- [ ] Separate Worker for app.dynasai.ai (after demo is ready)

## Done

- [x] Astro static marketing site
- [x] All v1 pages restyled from Stitch (about, contact, careers, features, pricing, docs, blog, legal)
- [x] SEO: sitemap, robots, RSS, JSON-LD, canonicals
- [x] GTM-KDPPRVV2 (production builds)
- [x] Cloudflare Workers wrangler.jsonc
- [x] Git remote github.com/abhishekbhalani/dynasai
- [x] Cloudflare agent setup (skills + MCP in `.cursor/mcp.json`)
- [x] Public email confirmed: hello@dynasai.ai
- [x] Release script: `npm run release`
- [x] Homepage restyled from Stitch "DynasAI - Enterprise Homepage"
