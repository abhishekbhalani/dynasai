# Architecture

```
dynasai.ai                 Astro SSG  →  Cloudflare Worker (static assets)
www.dynasai.ai             301 to apex
admin.dynasai.ai           Activity admin only (password). No Zaraz, no first-party tracker.
app.dynasai.ai             future product/demo app (separate Worker)
api.dynasai.ai             future API (optional)
```

This repo is the marketing Worker only. Do not put authenticated app routes here.

## SEO

- `site` in `astro.config.mjs`
- sitemap + robots.txt + RSS
- canonical, Open Graph, JSON-LD (Organization, WebSite, SoftwareApplication)
- MDX collections: `blog`, `docs`

## Analytics

Cloudflare Zaraz on the **dynasai.ai** zone loads GA4 (and optional Google tools). Do not embed GTM/gtag in app source. Cookie banner maps consent to Zaraz.

First-party `/api/track` events power `https://admin.dynasai.ai` (Cloudflare Analytics-style visitors, pages, countries). Assets use `run_worker_first` so the admin host is not the marketing homepage.
