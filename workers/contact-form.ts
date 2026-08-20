import { json, originOk, clientIp } from './http';
import { insertLead } from './leads';
import { queueMail, sendMails, leadRecipients } from './mail';
import { contactEmailHtml, contactEmailText, thankYouEmailHtml, thankYouEmailText } from './email-template';
import { buildContactPayload } from './visitor';
import { assertReplyEmail } from './email-mailbox';
import { inspectEmail } from '../shared/email-guard';

async function mailboxFor(env: Env, raw: unknown) {
  try {
    return await assertReplyEmail(env, raw);
  } catch (error) {
    console.error('mailbox_check_failed', { error: String(error) });
    return inspectEmail(raw);
  }
}

export async function handleContactForm(request: Request, env: Env, ctx?: ExecutionContext) {
  if (!originOk(request)) return json({ ok: false, error: 'Forbidden' }, 403);
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': request.headers.get('origin') || 'https://dynasai.ai',
        'access-control-allow-methods': 'POST, OPTIONS',
        'access-control-allow-headers': 'content-type',
      },
    });
  }
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);

  const ip = clientIp(request);
  const hits = Number((await env.LEADS.get(`rl:contact:${ip}`)) || '0');
  if (hits >= 8) return json({ ok: false, error: 'Too many requests. Try again later.' }, 429);
  await env.LEADS.put(`rl:contact:${ip}`, String(hits + 1), { expirationTtl: 3600 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  const name = String(body.name || '').trim();
  const company = String(body.company || '').trim();
  const mailbox = await mailboxFor(env, body.email);
  if (name.length < 2) {
    return json({ ok: false, error: 'Enter your name and a valid email.', field: 'name' }, 400);
  }
  if (!mailbox.ok) {
    return json({ ok: false, error: mailbox.error, field: 'email' }, 400);
  }
  const email = mailbox.email;

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

  const notify = leadRecipients(env);
  const who = company || name;
  await queueMail(ctx, () =>
    sendMails(env, [
      {
        to: notify.to,
        cc: notify.cc,
        subject: `New enquiry: ${who}`,
        text: message,
        html: contactEmailHtml(payload),
        replyTo: { email, name },
      },
      {
        to: email,
        subject: 'Thanks for contacting DynasAI',
        text: thankYouEmailText(name),
        html: thankYouEmailHtml(name),
      },
    ]),
  );

  return json({
    ok: true,
    message: 'Thanks. We emailed you a confirmation. We will get back to you within 2–3 working days.',
  });
}
