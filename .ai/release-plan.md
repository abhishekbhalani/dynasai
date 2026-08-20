# DynasAI release process

Two equivalent ways to ship the Worker. Use **one per release**, not both.

## Path A — GitHub Actions

1. Push the branch.
2. GitHub → **Actions** → **Release** → **Run workflow**.
3. **Use workflow from** = the branch to ship.
4. Optional: dry run, or also Pages.

Needs `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` in GitHub secrets.

## Path B — Cloudflare (Wrangler)

```powershell
npx wrangler whoami
npm run release
```

Same token in `.env`. This is the Cloudflare API path (dashboard Worker updates after deploy).

Optional later: Cloudflare → Workers → **dynasai-web** → Settings → Builds → connect Git, **turn off automatic deployments** so GitHub remains the button, or turn GitHub Release off and use Cloudflare Builds instead.

## Tags (not in the app)

Configure on the **zone**, not in Astro:

1. Cloudflare → **Zaraz** → Tools → **Google Analytics 4** → Measurement ID `G-XXXXXXXX`.
2. Optional: Google Ads / other Zaraz tools. Skip in-page GTM so Core Web Vitals stay cleaner (planning.md §136).
3. Enable Zaraz Consent; the site cookie banner already calls `zaraz.setConsent`.
4. Admin host `admin.dynasai.ai` must **not** load Zaraz (Configuration Rule `disable_zaraz`). Use `npm run zaraz:skip-admin` or the `dynasai-zaraz` MCP after the token has Zaraz + Config Rules permission.

Do not put `gtag.js` or `gtm.js` back in `BaseLayout.astro`.

## Planning.md — one wave at a time

Source: `requirement/planning.md` §134. Google docs baseline: §136.

### Wave 0 — Ship (this wave)

- [x] Flexible release: GitHub Action **or** `npm run release`
- [x] Custom domains in `wrangler.jsonc` (zone id set)
- [x] Remove in-app GTM/GA; Zaraz at the edge
- [ ] Push and run **one** Release (GitHub or Wrangler)
- [ ] Cloudflare Zaraz → add GA4 `G-` ID
- [ ] Confirm Worker URL + `https://dynasai.ai`

### Wave 1 — P0 SEO + measurement (planning 1–12)

- [x] Site architecture (marketing IA)
- [x] Metadata, sitemap, robots, canonicals, JSON-LD
- [ ] Search Console property + sitemap submit
- [ ] GA4 recommended events via Zaraz (`generate_lead`, `select_content`) — planning §22–23
- [ ] Conversion tracking on contact / start forms
- [ ] Core Web Vitals pass (LCP, INP, CLS)

### Wave 2 — P1 engagement (planning 13–20)

- [x] Visitor chat (Cloudflare Workers AI, limits)
- [x] Hold-to-contact popup
- [x] Admin activity view
- [ ] Lead scoring + CRM
- [ ] Smart CTAs / capability explorer

### Wave 3+ — P2/P3

Leave until Wave 1 is live. See planning.md §134.

## Do not mix

| Do | Don't |
|---|---|
| One deploy path per ship | GitHub Release **and** Cloudflare auto-build on the same push |
| Zaraz for GA4 | GTM snippet **and** Zaraz for the same `G-` ID |
| `G-XXXXXXXX` in Zaraz | Paste `GTM-…` as a GA measurement ID |
