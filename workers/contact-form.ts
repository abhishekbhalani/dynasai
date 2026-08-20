import { json, originOk, clientIp } from './http';
import { insertLead } from './leads';
import { sendMail } from './mail';
import { contactEmailHtml, contactEmailText } from './email-template';
import { buildContactPayload } from './visitor';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function handleContactForm(request: Request, env: Env) {
  if (!originOk(request)) return json({ ok: false, error: 'Forbidden' }, 403);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);

  const ip = clientIp(request);
  const hits = Number((await env.LEADS.get(`rl:contact:${ip}`)) || '0');
  if (hits >= 8) return json({ ok: false, error: 'Too many requests. Try again later.' }, 429);
  await env.LEADS.put(`rl:contact:${ip}`, String(hits + 1), { expirationTtl: 3600 });

  const body = (await request.json()) as Record<string, unknown>;
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const company = String(body.company || '').trim();
  if (name.length < 2 || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'Enter your name and a valid email.' }, 400);
  }

  const payload = buildContactPayload(request, body, {
    name,
    email,
    company,
    notes: String(body.notes || ''),
    path: String(body.path || '/contact'),
  });
  const message = contactEmailText(payload);

  try {
    await insertLead(env, {
      source: 'contact',
      name,
      email,
      company,
      message,
      path: payload.path,
    });
  } catch (error) {
    console.error('contact_lead_failed', { error: String(error) });
  }

  const notify = env.LEAD_NOTIFY || 'hello@dynasai.ai';
  const who = company || name;
  try {
    await sendMail(
      env,
      notify,
      `New enquiry: ${who}`,
      message,
      contactEmailHtml(payload),
      { email, name },
    );
  } catch (error) {
    console.error('contact_mail_failed', { error: String(error) });
  }

  return json({
    ok: true,
    message: 'Thanks. We will reply from hello@dynasai.ai within one business day.',
  });
}
