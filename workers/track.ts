import { clientIp, clip, json, originOk, sha256 } from './http';

const RECENT_KEY = 'track:recent';
const RECENT_MAX = 250;
const EVENT_TTL = 7 * 24 * 60 * 60;

type TrackEvent = Record<string, unknown>;

function cfMeta(request: Request) {
  const cf = request.cf;
  return {
    country: clip(cf?.country, 8),
    city: clip(cf?.city, 80),
    region: clip(cf?.region, 80),
    continent: clip(cf?.continent, 8),
    timezone: clip(cf?.timezone, 64),
    isp: clip(cf?.asOrganization, 120),
    colo: clip(cf?.colo, 8),
    protocol: clip(cf?.httpProtocol, 24),
    tls: clip(cf?.tlsVersion, 24),
  };
}

export async function handleTrack(request: Request, env: Env) {
  if (!originOk(request)) return json({ ok: false, error: 'Forbidden' }, 403);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);

  const raw = await request.text();
  if (raw.length > 12_000) return json({ ok: false, error: 'Payload too large' }, 413);

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400);
  }

  if (body.consent !== true) {
    return json({ ok: true, stored: false });
  }

  const sessionId = clip(body.sessionId, 64) || crypto.randomUUID();
  const ip = clientIp(request);
  const event: TrackEvent = {
    id: crypto.randomUUID(),
    ts: new Date().toISOString(),
    type: clip(body.type || 'event', 40),
    path: clip(body.path, 180),
    title: clip(body.title, 140),
    section: clip(body.section, 140),
    dwellMs: Number(body.dwellMs) || 0,
    holdMs: Number(body.holdMs) || 0,
    ttfbMs: Number(body.ttfbMs) || 0,
    loadMs: Number(body.loadMs) || 0,
    visibleMs: Number(body.visibleMs) || 0,
    referrer: clip(body.referrer, 180),
    lang: clip(body.lang, 24),
    tz: clip(body.tz, 64),
    viewport: clip(body.viewport, 24),
    network: clip(body.network, 40),
    downlink: Number(body.downlink) || 0,
    saveData: Boolean(body.saveData),
    sessionId,
    ipHash: (await sha256(ip)).slice(0, 16),
    ua: clip(request.headers.get('user-agent'), 180),
    ...cfMeta(request),
  };

  const recentRaw = (await env.LEADS.get(RECENT_KEY)) || '[]';
  let recent: TrackEvent[] = [];
  try {
    recent = JSON.parse(recentRaw) as TrackEvent[];
  } catch {
    recent = [];
  }
  recent.unshift(event);
  recent = recent.slice(0, RECENT_MAX);
  await env.LEADS.put(RECENT_KEY, JSON.stringify(recent), { expirationTtl: EVENT_TTL });
  await env.LEADS.put(`track:session:${sessionId}`, JSON.stringify({ ...event, lastType: event.type }), {
    expirationTtl: EVENT_TTL,
  });

  return json({ ok: true, stored: true, sessionId });
}

export async function listRecent(env: Env, limit = 80) {
  const raw = (await env.LEADS.get(RECENT_KEY)) || '[]';
  try {
    return (JSON.parse(raw) as TrackEvent[]).slice(0, limit);
  } catch {
    return [];
  }
}
