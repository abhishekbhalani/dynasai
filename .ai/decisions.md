# Decisions

- 2026-08-17: Astro SSG over Next/SPA for marketing SEO.
- 2026-08-17: Cloudflare Workers static assets over Pages (user choice; CF current default).
- 2026-08-17: Custom CSS variables, not Tailwind, for theme tokens + WCAG control.
- 2026-08-17: GTM in production only; GA4 loaded via GTM.
- 2026-08-17: app.dynasai.ai is a later, separate project — not a route on this site.
- 2026-08-17: Dynas Toolkit page at `/platform/toolkit` — public counterpart to TigerML (docs + workspace now; npm SDK planned).
- 2026-08-17: Insurance playbook is OTP-gated (work email + 6-digit code). Verified contacts are stored in KV as leads and emailed to hello@dynasai.ai. PDF is served only after session cookie.
