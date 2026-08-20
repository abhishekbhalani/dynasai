const ZONE = 'deba22f5a6c2a3a60082565beb8f2968';
const CACHE_KEY = 'analytics:cf:7d';
const CACHE_TTL = 300;

type Rank = { name: string; count: number };
type Series = { t: string; visitors: number; pageViews: number; requests: number };

export type CloudflareTraffic = {
  source: 'cloudflare';
  window: '7d';
  visitors: number;
  pageViews: number;
  requests: number;
  bytes: number;
  countriesCount: number;
  avgPages: number;
  series: Series[];
  countries: Rank[];
  pages: Rank[];
  referrers: Rank[];
};

function isoDate(offsetDays: number) {
  return new Date(Date.now() + offsetDays * 86400000).toISOString().slice(0, 10);
}

function isContentPath(path: string) {
  if (!path || path === '/cdn-cgi' || path.startsWith('/cdn-cgi/') || path.startsWith('/api/') || path.startsWith('/admin-app')) {
    return false;
  }
  if (path.includes('/.') || path === '/.env') return false;
  if (/\.(?:js|css|mjs|map|svg|png|jpe?g|webp|gif|ico|woff2?|txt|xml|json)$/i.test(path)) return false;
  return true;
}

async function graphql(token: string, query: string, variables: Record<string, string>) {
  const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as {
    errors?: { message?: string }[];
    data?: {
      viewer?: {
        zones?: Array<Record<string, unknown>>;
      };
    };
  };
  if (!res.ok || json.errors?.length) {
    throw new Error(json.errors?.[0]?.message || `graphql ${res.status}`);
  }
  return json.data?.viewer?.zones?.[0] || {};
}

function fillDays(rows: Series[]) {
  const map = new Map(rows.map((row) => [row.t, row]));
  const out: Series[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const t = isoDate(-i);
    out.push(map.get(t) || { t, visitors: 0, pageViews: 0, requests: 0 });
  }
  return out;
}

export async function fetchCloudflareTraffic(env: Env): Promise<CloudflareTraffic | null> {
  const token = env.CF_ANALYTICS_TOKEN || '';
  if (!token) return null;

  const cached = await env.LEADS.get(CACHE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached) as CloudflareTraffic;
    } catch {
      /* ignore */
    }
  }

  const since = isoDate(-7);
  const until = isoDate(0);
  const hourSince = new Date(Date.now() - 24 * 3600000).toISOString();
  const hourUntil = new Date().toISOString();
  const zoneTag = env.CF_ZONE_ID || ZONE;

  const zone = await graphql(
    token,
    `query($zoneTag: string, $since: Date, $until: Date, $hourSince: Time, $hourUntil: Time) {
      viewer {
        zones(filter: { zoneTag: $zoneTag }) {
          totals: httpRequests1dGroups(limit: 1, filter: { date_geq: $since, date_leq: $until }) {
            sum { requests pageViews bytes }
            uniq { uniques }
          }
          daily: httpRequests1dGroups(
            limit: 14
            filter: { date_geq: $since, date_leq: $until }
            orderBy: [date_ASC]
          ) {
            dimensions { date }
            sum { requests pageViews countryMap { clientCountryName requests } }
            uniq { uniques }
          }
          paths: httpRequestsAdaptiveGroups(
            limit: 30
            filter: { datetime_geq: $hourSince, datetime_lt: $hourUntil }
            orderBy: [count_DESC]
          ) {
            count
            dimensions { clientRequestPath }
          }
        }
      }
    }`,
    { zoneTag, since, until, hourSince, hourUntil },
  );

  const totals = (zone.totals as Array<{ sum?: { requests?: number; pageViews?: number; bytes?: number }; uniq?: { uniques?: number } }>) || [];
  const daily = (zone.daily as Array<{
    dimensions?: { date?: string };
    sum?: { requests?: number; pageViews?: number; countryMap?: Array<{ clientCountryName?: string; requests?: number }> };
    uniq?: { uniques?: number };
  }>) || [];
  const pathRows = (zone.paths as Array<{ count?: number; dimensions?: { clientRequestPath?: string } }>) || [];

  const visitors = Number(totals[0]?.uniq?.uniques || 0);
  const pageViews = Number(totals[0]?.sum?.pageViews || 0);
  const requests = Number(totals[0]?.sum?.requests || 0);
  const bytes = Number(totals[0]?.sum?.bytes || 0);

  const countryMap: Record<string, number> = {};
  for (const day of daily) {
    for (const row of day.sum?.countryMap || []) {
      const name = row.clientCountryName || 'Unknown';
      countryMap[name] = (countryMap[name] || 0) + Number(row.requests || 0);
    }
  }
  const countries = Object.entries(countryMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const pages = pathRows
    .map((row) => ({ name: row.dimensions?.clientRequestPath || '/', count: Number(row.count || 0) }))
    .filter((row) => isContentPath(row.name))
    .slice(0, 12);

  const series = fillDays(
    daily.map((row) => ({
      t: row.dimensions?.date || '',
      visitors: Number(row.uniq?.uniques || 0),
      pageViews: Number(row.sum?.pageViews || 0),
      requests: Number(row.sum?.requests || 0),
    })),
  );

  const data: CloudflareTraffic = {
    source: 'cloudflare',
    window: '7d',
    visitors,
    pageViews,
    requests,
    bytes,
    countriesCount: countries.length,
    avgPages: visitors ? Math.round((pageViews / visitors) * 10) / 10 : 0,
    series,
    countries,
    pages,
    referrers: [],
  };

  await env.LEADS.put(CACHE_KEY, JSON.stringify(data), { expirationTtl: CACHE_TTL });
  return data;
}
