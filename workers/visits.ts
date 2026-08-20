import { clientIp, sha256 } from './http';
import { isAdminHost, isCrawler, isLocalHost, isStaticAssetPath } from './hosts';

let schemaReady = false;

async function ensureVisits(db: D1Database) {
  if (schemaReady) return;
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS page_views (
      id TEXT PRIMARY KEY,
      ts INTEGER NOT NULL,
      hour TEXT NOT NULL,
      day TEXT NOT NULL,
      path TEXT NOT NULL,
      country TEXT NOT NULL DEFAULT '',
      referrer TEXT NOT NULL DEFAULT '',
      visitor TEXT NOT NULL
    )`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_page_views_ts ON page_views (ts)`),
  ]);
  schemaReady = true;
}

export type VisitSummary = {
  visitors: number;
  pageViews: number;
  countriesCount: number;
  avgPages: number;
  series: { t: string; visitors: number; pageViews: number }[];
  countries: { name: string; count: number }[];
  pages: { name: string; count: number }[];
  referrers: { name: string; count: number }[];
};

function referrerHost(referrer: string) {
  const raw = referrer.trim();
  if (!raw) return 'Direct';
  try {
    const host = new URL(raw).hostname.replace(/^www\./, '');
    if (!host || host === 'dynasai.ai' || host === 'admin.dynasai.ai') return 'Direct';
    return host;
  } catch {
    return 'Direct';
  }
}

function publicHost(hostname: string, env: Env) {
  return hostname === 'dynasai.ai' || hostname === 'www.dynasai.ai' || isLocalHost(hostname);
}

export async function recordPageView(request: Request, env: Env, res: Response) {
  if (!env.DB) return;
  await ensureVisits(env.DB);
  if (request.method !== 'GET') return;
  if (res.status >= 400) return;
  if (isCrawler(request)) return;

  const url = new URL(request.url);
  if (isAdminHost(url.hostname, env) && !isLocalHost(url.hostname)) return;
  if (!publicHost(url.hostname, env)) return;

  const path = url.pathname.replace(/\/$/, '') || '/';
  if (path.startsWith('/api/') || path.startsWith('/admin-app') || path.startsWith('/admin')) return;
  if (isStaticAssetPath(path)) return;

  const type = res.headers.get('content-type') || '';
  if (type && !type.includes('text/html')) return;

  const now = Date.now();
  const iso = new Date(now).toISOString();
  const visitor = (await sha256(clientIp(request))).slice(0, 16);
  const country = String(request.cf?.country || '').toUpperCase();
  const referrer = referrerHost(request.headers.get('referer') || '');

  await env.DB.prepare(
    `INSERT INTO page_views (id, ts, hour, day, path, country, referrer, visitor)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(crypto.randomUUID(), now, iso.slice(0, 13), iso.slice(0, 10), path.slice(0, 180), country, referrer, visitor)
    .run();

  if (Math.random() < 0.05) {
    await env.DB.prepare(`DELETE FROM page_views WHERE ts < ?`).bind(now - WINDOW_MS - 86400000).run();
  }
}

function fillDays(rows: { t: string; visitors: number; pageViews: number }[]) {
  const map = new Map(rows.map((row) => [row.t, row]));
  const out: { t: string; visitors: number; pageViews: number }[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const t = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    out.push(map.get(t) || { t, visitors: 0, pageViews: 0 });
  }
  return out;
}

export async function summarizeVisits(env: Env): Promise<VisitSummary | null> {
  if (!env.DB) return null;
  await ensureVisits(env.DB);
  const since = Date.now() - WINDOW_MS;

  const totals = await env.DB.prepare(
    `SELECT COUNT(*) AS pageViews, COUNT(DISTINCT visitor) AS visitors
     FROM page_views WHERE ts >= ?`,
  )
    .bind(since)
    .first<{ pageViews: number; visitors: number }>();

  const series = await env.DB.prepare(
    `SELECT day AS t, COUNT(DISTINCT visitor) AS visitors, COUNT(*) AS pageViews
     FROM page_views WHERE ts >= ? GROUP BY day ORDER BY day`,
  )
    .bind(since)
    .all<{ t: string; visitors: number; pageViews: number }>();

  const countries = await env.DB.prepare(
    `SELECT CASE WHEN country = '' THEN 'Unknown' ELSE country END AS name, COUNT(*) AS count
     FROM page_views WHERE ts >= ? GROUP BY country ORDER BY count DESC LIMIT 12`,
  )
    .bind(since)
    .all<{ name: string; count: number }>();

  const pages = await env.DB.prepare(
    `SELECT path AS name, COUNT(*) AS count
     FROM page_views WHERE ts >= ? GROUP BY path ORDER BY count DESC LIMIT 12`,
  )
    .bind(since)
    .all<{ name: string; count: number }>();

  const referrers = await env.DB.prepare(
    `SELECT referrer AS name, COUNT(*) AS count
     FROM page_views WHERE ts >= ? GROUP BY referrer ORDER BY count DESC LIMIT 12`,
  )
    .bind(since)
    .all<{ name: string; count: number }>();

  const pageViews = Number(totals?.pageViews || 0);
  const visitors = Number(totals?.visitors || 0);
  const countryRows = countries.results || [];

  return {
    visitors,
    pageViews,
    countriesCount: countryRows.length,
    avgPages: visitors ? Math.round((pageViews / visitors) * 10) / 10 : 0,
    series: fillDays(series.results || []),
    countries: countryRows,
    pages: pages.results || [],
    referrers: referrers.results || [],
  };
}
