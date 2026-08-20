---
name: dynasai-admin-analytics
description: Caches DynasAI admin Traffic analytics in Cloudflare KV so dashboard loads do not call Cloudflare GraphQL every time. Use when changing admin analytics, Traffic UI, KV snapshots, activity API, cron warming, cf-analytics, or unique visitors.
---

# DynasAI admin analytics cache

Traffic on `admin.dynasai.ai` is one KV snapshot. Cloudflare GraphQL is a refresh source, not the request path.

## Load path

1. Vue `AnalyticsView.vue` → `GET /api/admin/activity` (`cache: 'no-store'`).
2. `handleAdmin` → `getCachedTraffic(env, ctx)`.
3. KV `analytics:traffic:v1` if present; otherwise GraphQL + D1 referrers, then write KV.

Do not call GraphQL from `admin.ts` or the Vue app.

## TTLs

| State | Age | Behavior |
| --- | --- | --- |
| Fresh | < 15 min | Return KV. No GraphQL. |
| Stale | 15 min–24 h | Return KV. `waitUntil(refreshTrafficCache)`. |
| Miss / expired | no snap or > 24 h | Sync refresh. On failure, last snapshot. |
| KV TTL | 26 h | Snapshot expires if cron/refresh stop. |
| Lock | 45 s | `analytics:traffic:lock` prevents stampede. |

Cron in `wrangler.jsonc`: `*/10 * * * *` → `scheduled` → `refreshTrafficCache`.

## Snapshot shape

Store the **merged** dashboard payload in one key (Cloudflare totals + D1 referrers/pages fallback). Fields: `source`, `window`, `visitors`, `pageViews`, `requests`, `bytes`, `series`, `countries`, `pages`, `referrers`, `cachedAt`, `cache` (`fresh` \| `stale` \| `live`).

Adding a chart or KPI means adding it to `loadFromCloudflare` / the snapshot, then the view. Do not add a second GraphQL query for the same window.

## Do not

- Public CDN Cache Rule on `/api/admin/activity` (session cookie). Browser may use `private, max-age=60`.
- Embed GTM/gtag. Unique visitors come from Cloudflare Analytics (`httpRequests1dGroups` uniq).
- Bypass KV with `fetchCloudflareTraffic` — that export must not exist.

## Flow check

When changing Traffic: Worker action (`getCachedTraffic` / `handleAdmin`) + view (`AnalyticsView.vue`) + CSS (`admin.css`) all present. If the action exists without the view, stop and add the view.

## Files

- `workers/cf-analytics.ts` — snapshot, lock, GraphQL, cron helper
- `workers/admin.ts` — activity route
- `workers/site.ts` — pass `ctx`, `scheduled`
- `admin/src/views/AnalyticsView.vue` — show `cachedAt` / `cache`
- `wrangler.jsonc` — cron trigger
