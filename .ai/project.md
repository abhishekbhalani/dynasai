# DynasAI

Active task: GitHub Actions manual release to Cloudflare Workers (dynasai.ai).

## Product

- Studio (AI delivery) + developer platform/API
- Domain: dynasai.ai (this repo)
- App later: app.dynasai.ai (separate Workers project)

## Constraints

- Static HTML, Cloudflare Workers static assets (not Pages)
- Light + dark via CSS variables, WCAG AA
- GTM-KDPPRVV2 in production
- Do not commit `.cursor/mcp.json`

## Pending

- Stitch MCP reload in Cursor (HTTP endpoint failed; stdio proxy configured)
- Wrangler login + first deploy
- Custom domains in wrangler.jsonc; Search Console property still pending
- Consent Mode in GTM if EU traffic
- Legal counsel review of privacy/terms
- Real OG image (1200×630)
- Contact form Worker (replace mailto)
