import { playbookMeta, playbookPages } from '../src/content/playbook-pages';
import { buildPlaybookPdf } from './pdf';
import { json } from './http';
import { handleTrack } from './track';
import { handleChat } from './chat';
import { handleAdmin, handleQuickContact, hasAdminSession } from './admin';
import { insertLead } from './leads';
import { isAdminHost, isCrawler, isLocalHost, isStaticAssetPath } from './hosts';
import { applySecurityHeaders, redirectHttpToHttps } from './security';
import { recordPageView } from './visits';

const OTP_TTL_SEC = 10 * 60;
const SESSION_TTL_SEC = 12 * 60 * 60;
const COOKIE = 'dynasai_playbook';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clientIp(request: Request) {
  return request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || 'unknown';
}

function cookieValue(request: Request, name: string) {
  const raw = request.headers.get('cookie') || '';
  const match = raw.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : '';
}

function sessionCookie(token: string, secure: boolean) {
  const parts = [
    `${COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${SESSION_TTL_SEC}`,
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function sixDigitOtp() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return String(buf[0] % 1_000_000).padStart(6, '0');
}

function sessionToken() {
  const buf = new Uint8Array(32);
  crypto.getRandomValues(buf);
  return [...buf].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function rateLimited(env: Env, key: string, limit: number, ttl = 3600) {
  const current = Number((await env.LEADS.get(key)) || '0');
  if (current >= limit) return true;
  await env.LEADS.put(key, String(current + 1), { expirationTtl: ttl });
  return false;
}

async function readSession(request: Request, env: Env) {
  const token = cookieValue(request, COOKIE);
  if (!token) return null;
  const raw = await env.LEADS.get(`session:${token}`);
  if (!raw) return null;
  const session = JSON.parse(raw) as { email: string; exp: number };
  if (session.exp < Date.now()) return null;
  return session;
}

async function sendMail(env: Env, to: string, subject: string, text: string) {
  if (!env.EMAIL) throw new Error('EMAIL binding missing');
  const from = env.PLAYBOOK_FROM || 'hello@dynasai.ai';
  await env.EMAIL.send({
    to,
    from: { email: from, name: 'DynasAI' },
    subject,
    text,
    html: `<p>${text.replace(/\n/g, '<br/>')}</p>`,
  });
}

async function handleRequestOtp(request: Request, env: Env) {
  const body = (await request.json()) as { email?: string; name?: string; company?: string };
  const email = String(body.email || '').trim().toLowerCase();
  const name = String(body.name || '').trim();
  const company = String(body.company || '').trim();
  if (!EMAIL_RE.test(email) || name.length < 2 || company.length < 2) {
    return json({ ok: false, error: 'Enter your name, work email, and company.' }, 400);
  }
  if (await rateLimited(env, `rl:email:${email}`, 5)) {
    return json({ ok: false, error: 'Too many codes for this email. Try again in an hour.' }, 429);
  }
  if (await rateLimited(env, `rl:ip:${clientIp(request)}`, 20)) {
    return json({ ok: false, error: 'Too many requests. Try again later.' }, 429);
  }

  const code = sixDigitOtp();
  const hash = await sha256(`${email}:${code}`);
  await env.LEADS.put(
    `otp:${email}`,
    JSON.stringify({ hash, attempts: 0, exp: Date.now() + OTP_TTL_SEC * 1000, name, company }),
    { expirationTtl: OTP_TTL_SEC },
  );

  const isDev = env.ENVIRONMENT !== 'production';
  try {
    await sendMail(
      env,
      email,
      'Your DynasAI playbook code',
      `Your one-time code is ${code}. It expires in 10 minutes.\n\nIf you did not request the insurance playbook, ignore this email.`,
    );
  } catch (error) {
    if (!isDev) {
      console.error('playbook_otp_email_failed', { error: String(error) });
      return json({ ok: false, error: 'Could not send the code. Try again shortly.' }, 503);
    }
    console.log('playbook_otp_dev', email, code);
  }

  return json({
    ok: true,
    message: 'We sent a 6-digit code to your email.',
    ...(isDev ? { debugOtp: code } : {}),
  });
}

async function handleVerifyOtp(request: Request, env: Env) {
  const body = (await request.json()) as { email?: string; code?: string };
  const email = String(body.email || '').trim().toLowerCase();
  const code = String(body.code || '').replace(/\s/g, '');
  if (!EMAIL_RE.test(email) || !/^\d{6}$/.test(code)) {
    return json({ ok: false, error: 'Enter the 6-digit code from your email.' }, 400);
  }

  const raw = await env.LEADS.get(`otp:${email}`);
  if (!raw) return json({ ok: false, error: 'Code expired. Request a new one.' }, 400);
  const otp = JSON.parse(raw) as { hash: string; attempts: number; exp: number; name: string; company: string };
  if (otp.exp < Date.now()) return json({ ok: false, error: 'Code expired. Request a new one.' }, 400);
  if (otp.attempts >= 5) return json({ ok: false, error: 'Too many attempts. Request a new code.' }, 400);

  const hash = await sha256(`${email}:${code}`);
  if (hash !== otp.hash) {
    otp.attempts += 1;
    await env.LEADS.put(`otp:${email}`, JSON.stringify(otp), { expirationTtl: OTP_TTL_SEC });
    return json({ ok: false, error: 'That code is not correct.' }, 400);
  }

  await env.LEADS.delete(`otp:${email}`);
  const token = sessionToken();
  const lead = {
    email,
    name: otp.name,
    company: otp.company,
    source: playbookMeta.source,
    verifiedAt: new Date().toISOString(),
  };
  await env.LEADS.put(`lead:${email}`, JSON.stringify(lead));
  try {
    await insertLead(env, {
      source: 'playbook',
      name: otp.name,
      email,
      company: otp.company,
    });
  } catch (error) {
    console.error('lead_insert_failed', { error: String(error) });
  }
  await env.LEADS.put(
    `session:${token}`,
    JSON.stringify({ ...lead, exp: Date.now() + SESSION_TTL_SEC * 1000 }),
    { expirationTtl: SESSION_TTL_SEC },
  );

  try {
    const notify = env.LEAD_NOTIFY || 'hello@dynasai.ai';
    await sendMail(
      env,
      notify,
      `Playbook lead: ${otp.company}`,
      `Verified playbook lead\nName: ${otp.name}\nEmail: ${email}\nCompany: ${otp.company}\nSource: ${playbookMeta.source}`,
    );
  } catch (error) {
    console.error('playbook_lead_notify_failed', { error: String(error) });
  }

  const secure = new URL(request.url).protocol === 'https:';
  return json(
    { ok: true },
    200,
    { 'set-cookie': sessionCookie(token, secure) },
  );
}

async function handleFile(request: Request, env: Env) {
  const session = await readSession(request, env);
  if (!session) return json({ ok: false, error: 'Verify your email to download the playbook.' }, 401);
  const pdf = buildPlaybookPdf();
  return new Response(pdf, {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `inline; filename="${playbookMeta.filename}"`,
      'cache-control': 'private, no-store',
    },
  });
}

async function handlePlaybook(request: Request, env: Env) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, '');

  if (request.method === 'GET' && path === '/api/playbook/session') {
    const session = await readSession(request, env);
    return json({ ok: Boolean(session) });
  }
  if (request.method === 'GET' && path === '/api/playbook/pages') {
    const session = await readSession(request, env);
    if (!session) return json({ ok: false, error: 'Verify your email to view the playbook.' }, 401);
    return json({ ok: true, title: playbookMeta.title, pages: playbookPages });
  }
  if (request.method === 'POST' && path === '/api/playbook/request-otp') {
    return handleRequestOtp(request, env);
  }
  if (request.method === 'POST' && path === '/api/playbook/verify-otp') {
    return handleVerifyOtp(request, env);
  }
  if (request.method === 'GET' && path === '/api/playbook/file') {
    return handleFile(request, env);
  }
  return json({ ok: false, error: 'Not found' }, 404);
}

async function withRobots(res: Response) {
  const headers = new Headers(res.headers);
  headers.set('x-robots-tag', 'noindex, nofollow, noarchive, nosnippet');
  return new Response(res.body, { status: res.status, headers });
}

async function servePublicNotFound(request: Request, env: Env) {
  const url = new URL(request.url);
  url.pathname = '/404';
  const res = await env.ASSETS.fetch(new Request(url.toString(), request));
  return new Response(res.body, { status: 404, headers: res.headers });
}

async function serveAdminSpa(request: Request, env: Env) {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = '/admin-app/';
  const res = await env.ASSETS.fetch(new Request(assetUrl.toString(), { method: 'GET' }));
  if (!res.ok) return servePublicNotFound(request, env);

  const authed = await hasAdminSession(request, env);
  const host = new URL(request.url).hostname;
  const base = isLocalHost(host) ? '/admin/' : '/';
  const sitekey = env.PUBLIC_TURNSTILE_SITEKEY || '';
  let html = await res.text();
  html = html
    .replace('data-auth="0"', `data-auth="${authed ? '1' : '0'}"`)
    .replace('data-base="/"', `data-base="${base}"`)
    .replace('data-turnstile=""', `data-turnstile="${sitekey}"`);

  const headers = new Headers(res.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.set('cache-control', 'no-store');
  return withRobots(new Response(html, { status: 200, headers }));
}

async function handleAdminHost(request: Request, env: Env) {
  if (isCrawler(request)) {
    return new Response('Not found', {
      status: 404,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'x-robots-tag': 'noindex, nofollow, noarchive, nosnippet',
      },
    });
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, '') || '/';

  if (path === '/robots.txt') {
    return new Response('User-agent: *\nDisallow: /\n', {
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store',
        'x-robots-tag': 'noindex, nofollow, noarchive, nosnippet',
      },
    });
  }

  try {
    if (path.startsWith('/api/admin')) return await handleAdmin(request, env);
  } catch (error) {
    console.error('api_error', { path, error: String(error) });
    return json({ ok: false, error: 'Something went wrong.' }, 500);
  }

  if (path.startsWith('/api/')) return json({ ok: false, error: 'Not found' }, 404);
  if (isStaticAssetPath(path)) {
    const res = await env.ASSETS.fetch(request);
    return withRobots(res);
  }
  return serveAdminSpa(request, env);
}

async function routeRequest(request: Request, env: Env) {
    const url = new URL(request.url);
    if (url.hostname === 'www.dynasai.ai') {
      url.hostname = 'dynasai.ai';
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    if (isAdminHost(url.hostname, env) && !['localhost', '127.0.0.1'].includes(url.hostname)) {
      return handleAdminHost(request, env);
    }

    const path = url.pathname;
    const local = isLocalHost(url.hostname);
    if (!local && (path === '/admin' || path.startsWith('/admin/') || path === '/admin-app' || path.startsWith('/admin-app/'))) {
      return servePublicNotFound(request, env);
    }

    try {
      if (path.startsWith('/api/track')) return await handleTrack(request, env);
      if (path.startsWith('/api/chat')) return await handleChat(request, env);
      if (path.startsWith('/api/contact-quick')) return await handleQuickContact(request, env);
      if (path.startsWith('/api/admin')) {
        if (!local) return json({ ok: false, error: 'Not found' }, 404);
        return await handleAdmin(request, env);
      }
      if (path.startsWith('/api/playbook')) {
        if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
        return await handlePlaybook(request, env);
      }
    } catch (error) {
      console.error('api_error', { path, error: String(error) });
      return json({ ok: false, error: 'Something went wrong.' }, 500);
    }

    if (local && (path === '/admin' || path.startsWith('/admin/') || path.startsWith('/admin-app/'))) {
      if (isStaticAssetPath(path)) {
        const res = await env.ASSETS.fetch(request);
        return withRobots(res);
      }
      return serveAdminSpa(request, env);
    }

    return env.ASSETS.fetch(request);
}

export default {
  async fetch(request, env, ctx) {
    const https = redirectHttpToHttps(request);
    if (https) return applySecurityHeaders(https);
    const res = await routeRequest(request, env);
    const task = recordPageView(request, env, res).catch((error) => {
      console.error('visit_record_failed', { error: String(error) });
    });
    ctx?.waitUntil(task);
    return applySecurityHeaders(res);
  },
};
