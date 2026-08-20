# DynasAI

Active task: Wave 0 release, then Zaraz GA4. Admin is `admin.dynasai.ai` (not `/admin`).

## Product

- Studio (AI delivery) + developer platform/API
- Domain: dynasai.ai (this repo)
- Admin: admin.dynasai.ai (same Worker, no tracking)
- App later: app.dynasai.ai (separate Workers project)

## Constraints

- Static HTML, Cloudflare Workers static assets (not Pages)
- Light + dark via CSS variables, WCAG AA
- Analytics: Cloudflare Zaraz + GA4 (no in-app GTM)
- Admin: admin.dynasai.ai (unguessable path not required; host is still guessable — password + later Cloudflare Access)
- Do not commit `.cursor/mcp.json`

## Pending

- Stitch MCP reload in Cursor (HTTP endpoint failed; stdio proxy configured)
- Wrangler login + first deploy
- Custom domains in wrangler.jsonc; Search Console property still pending
- Consent Mode in GTM if EU traffic
- Legal counsel review of privacy/terms
- Real OG image (1200×630)
- Contact form Worker (replace mailto)
