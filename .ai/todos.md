# Todos

## Resume this chat — ask the user

- [ ] **Ask:** When should we set up Cloudflare Email Sending (`wrangler email sending enable dynasai.ai`) and turn on the playbook OTP in production?
- [ ] **Wait:** Do **not** start KV + email as a live facility until the playbook/UI is finalized. Code/KV namespace may exist; do not treat email sending + lead pipeline as “on” until the user says UI is final.

## Open

- [ ] Restart Cursor to load Cloudflare MCP servers (OAuth on first use)
- [ ] wrangler login + first deploy (user will run login)
- [ ] Attach dynasai.ai / www in Cloudflare
- [ ] GTM: GA4 tag + Consent Mode
- [ ] Google Search Console property for dynasai.ai
- [ ] Contact form Worker (replace mailto)
- [ ] Separate Worker for app.dynasai.ai

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
