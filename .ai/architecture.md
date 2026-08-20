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

GTM container (`GTM-KDPPRVV2`) in `BaseLayout.astro` when `import.meta.env.PROD`. GA4 gtag loads in production when `PUBLIC_GA_MEASUREMENT_ID` is set. Consent Mode defaults to denied until cookie opt-in. Do not duplicate the same GA4 ID as a GTM tag.
