# Decisions

- 2026-08-17: Astro SSG over Next/SPA for marketing SEO.
- 2026-08-17: Cloudflare Workers static assets over Pages (user choice; CF current default).
- 2026-08-17: Custom CSS variables, not Tailwind, for theme tokens + WCAG control.
- 2026-08-17: GTM in production only; GA4 loaded via GTM.
- 2026-08-17: app.dynasai.ai is a later, separate project — not a route on this site.
- 2026-08-17: Dynas Toolkit page at `/platform/toolkit` — public counterpart to TigerML (docs + workspace now; npm SDK planned).
- 2026-08-17: Insurance playbook OTP/leads are designed (KV + email). Do not enable Email Sending or treat KV as a live lead facility until the playbook UI is finalized. Ask the user on chat resume.
- 2026-08-20: Dual release (GitHub Action or wrangler). GA4/GTM stay in Cloudflare Zaraz, not app source. Sequential waves in `.ai/release-plan.md` from planning.md §134/§136.
- 2026-08-20: Worker and custom domains must live on the same Cloudflare account as zone dynasai.ai (`67547d9f…`, Pbsureja). Do not deploy with the Bhalaniabhishek account token (`30c88490…`). `scripts/release.mjs` always loads `.env` over the shell.
- 2026-08-20: Security headers (CSP + nonce, COOP, HSTS, XFO, Trusted Types default policy) are applied in `workers/security.ts`. Admin Turnstile widget `dynasai-admin-login` sitekey is `PUBLIC_TURNSTILE_SITEKEY`; secret is Worker secret `TURNSTILE_SECRET`.
