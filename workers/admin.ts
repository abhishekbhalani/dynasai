import { cookieValue, json, originOk, sha256, timingSafeEqual } from './http';
import { listRecent, summarizeActivity } from './track';
import { isAdminHost } from './hosts';
import { verifyTurnstile } from './turnstile';
import { insertLead, listLeads } from './leads';
import { queueMail, sendMail } from './mail';
import { contactEmailHtml, contactEmailText } from './email-template';
import { buildContactPayload } from './visitor';
import { assertReplyEmail } from './email-mailbox';
import { inspectEmail } from '../shared/email-guard';
import { summarizeVisits } from './visits';
import { getCachedTraffic } from './cf-analytics';

const COOKIE = 'dynasai_admin';
const SESSION_TTL = 12 * 60 * 60;

function sessionCookie(token: string, secure: boolean) {
  const parts = [
    `${COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${SESSION_TTL}`,
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

async function requireAdmin(request: Request, env: Env) {
  const token = cookieValue(request, COOKIE);
  if (!token) return null;
  const raw = await env.LEADS.get(`admin:sess:${token}`);
  return raw ? token : null;
}

export async function hasAdminSession(request: Request, env: Env) {
  return Boolean(await requireAdmin(request, env));
}

export async function handleAdmin(request: Request, env: Env, ctx?: ExecutionContext) {
  const host = new URL(request.url).hostname;
  if (!isAdminHost(host, env)) return json({ ok: false, error: 'Not found' }, 404);
  if (!originOk(request)) return json({ ok: false, error: 'Forbidden' }, 403);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, '') || '/';

  if (request.method === 'POST' && path === '/api/admin/login') {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
      turnstileToken?: string;
    };
    const expectedUser = env.ADMIN_USERNAME || 'dynAdmin';
    const expectedPass = env.ADMIN_PASSWORD || '';
    const userOk = timingSafeEqual(String(body.username || ''), expectedUser);
    const passOk = Boolean(expectedPass) && timingSafeEqual(String(body.password || ''), expectedPass);
    const humanOk = env.TURNSTILE_SECRET ? await verifyTurnstile(request, env, body.turnstileToken) : true;
    if (!humanOk) return json({ ok: false, error: 'Confirm you are not a robot.' }, 403);
    if (!userOk || !passOk) return json({ ok: false, error: 'Wrong username or password.' }, 401);
    const token = await sha256(`${crypto.randomUUID()}:${Date.now()}`);
    await env.LEADS.put(`admin:sess:${token}`, JSON.stringify({ at: Date.now() }), {
      expirationTtl: SESSION_TTL,
    });
    const secure = url.protocol === 'https:';
    return json({ ok: true }, 200, { 'set-cookie': sessionCookie(token, secure) });
  }

  if (request.method === 'POST' && path === '/api/admin/logout') {
    const token = cookieValue(request, COOKIE);
    if (token) await env.LEADS.delete(`admin:sess:${token}`);
    return json({ ok: true }, 200, {
      'set-cookie': `${COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`,
    });
  }

  const session = await requireAdmin(request, env);
  if (!session) return json({ ok: false, error: 'Sign in required.' }, 401);

  if (request.method === 'GET' && path === '/api/admin/session') {
    return json({ ok: true });
  }

  if (request.method === 'GET' && path === '/api/admin/activity') {
    const headers = { 'cache-control': 'private, max-age=60, stale-while-revalidate=300' };
    try {
      const cloudflare = await getCachedTraffic(env, ctx);
      if (cloudflare) return json({ ok: true, ...cloudflare }, 200, headers);
    } catch (error) {
      console.error('cf_analytics_failed', { error: String(error) });
    }
    try {
      const visits = await summarizeVisits(env);
      if (visits) {
        return json(
          {
            ok: true,
            source: 'edge',
            window: '7d',
            requests: visits.pageViews,
            bytes: 0,
            cachedAt: new Date().toISOString(),
            cache: 'live',
            ...visits,
          },
          200,
          headers,
        );
      }
    } catch (error) {
      console.error('visits_summary_failed', { error: String(error) });
    }
    try {
      const events = await listRecent(env, 250);
      const summary = summarizeActivity(events);
      return json({ ok: true, source: 'consented', ...summary, recent: events.slice(0, 80) }, 200, headers);
    } catch (error) {
      console.error('activity_fallback_failed', { error: String(error) });
      return json({ ok: false, error: 'Could not load analytics.' }, 500, headers);
    }
  }

  if (request.method === 'GET' && path === '/api/admin/leads') {
    const leads = await listLeads(env, 200);
    return json({ ok: true, store: env.DB ? 'd1' : 'kv', leads });
  }

  return json({ ok: false, error: 'Not found' }, 404);
}

export async function handleQuickContact(request: Request, env: Env, ctx?: ExecutionContext) {
  if (!originOk(request)) return json({ ok: false, error: 'Forbidden' }, 403);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }
  const name = String(body.name || '').trim();
  let mailbox;
  try {
    mailbox = await assertReplyEmail(env, body.email);
  } catch (error) {
    console.error('mailbox_check_failed', { error: String(error) });
    mailbox = inspectEmail(body.email);
  }
  const notes = String(body.message || '').trim();
  if (name.length < 2) {
    return json({ ok: false, error: 'Enter your name and a valid email.', field: 'name' }, 400);
  }
  if (!mailbox.ok) {
    return json({ ok: false, error: mailbox.error, field: 'email' }, 400);
  }
  const email = mailbox.email;
  if (notes.length > 500) return json({ ok: false, error: 'Message is too long (500 character max).' }, 400);

  const payload = buildContactPayload(request, body, {
    name,
    email,
    notes,
    path: String(body.path || ''),
  });
  const message = contactEmailText(payload);

  try {
    await env.LEADS.put(`quick:${email}:${Date.now()}`, JSON.stringify({ name, email, message: notes, path: payload.path }), {
      expirationTtl: 30 * 24 * 60 * 60,
    });
  } catch (error) {
    console.error('quick_kv_failed', { error: String(error) });
  }
  try {
    await insertLead(env, {
      source: 'quick-contact',
      name,
      email,
      message,
      path: payload.path,
    });
  } catch (error) {
    console.error('lead_insert_failed', { error: String(error) });
  }
  await queueMail(ctx, () =>
    sendMail(env, env.LEAD_NOTIFY || 'hello@dynasai.ai', `New enquiry: ${name}`, message, contactEmailHtml(payload), {
      email,
      name,
    }),
  );
  return json({ ok: true, message: 'Thanks. We will reply from hello@dynasai.ai.' });
}
