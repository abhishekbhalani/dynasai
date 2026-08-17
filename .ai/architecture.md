# Architecture

```
dynasai.ai          Astro SSG  →  Cloudflare Worker (static assets)
www.dynasai.ai      301 to apex
app.dynasai.ai      future product/demo app (separate Worker)
api.dynasai.ai      future API (optional)
```

This repo is the marketing Worker only. Do not put authenticated app routes here.

## SEO

- `site` in `astro.config.mjs`
- sitemap + robots.txt + RSS
- canonical, Open Graph, JSON-LD (Organization, WebSite, SoftwareApplication)
- MDX collections: `blog`, `docs`

## Analytics

GTM container in `BaseLayout.astro` when `import.meta.env.PROD`. Configure GA4 inside GTM, not in source.
