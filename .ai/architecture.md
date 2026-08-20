# Architecture

```
dynasai.ai                 Astro SSG  →  Cloudflare Worker (static assets)
www.dynasai.ai             301 to apex
admin.dynasai.ai           Vue admin (analytics + leads). Worker stamps session on HTML so refresh does not flash login. Same Worker as marketing.
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

Admin **Traffic** unique visitors come from Cloudflare GraphQL Analytics (`httpRequests1dGroups` uniq/pageViews/requests) when `CF_ANALYTICS_TOKEN` has Zone Analytics Read. The Worker stores one KV snapshot (`analytics:traffic:v1`, fresh 15 min, stale-while-revalidate 24 h, cron every 10 min). Dashboard loads read KV; GraphQL runs only on miss, stale refresh, or cron. Top pages are last-24h HTML paths; referrers come from Worker page-view logs. Fallback is D1 edge counts.

Security headers and HTTP→HTTPS live in the Worker (`workers/security.ts`). Admin login uses Turnstile (`data-action="admin-login"`). Admin UI is Vue 3 (`admin/`) built to `dist/admin-app/`. Leads use D1 when `env.DB` exists; otherwise KV rows with the same schema (`workers/leads.ts`). Contact and thank-you mail send through hosting SMTP `mail.dynasai.ai` (`workers/smtp.ts`). `SMTP_PASS` is a Worker secret. Playbook OTP email stays off until that UI is enabled.
