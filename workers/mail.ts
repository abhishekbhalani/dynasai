import { sendSmtpTimed } from './smtp';

function fromAddress(env: Env) {
  return env.SMTP_FROM || env.PLAYBOOK_FROM || 'hello@dynasai.ai';
}

function smtpAuth(env: Env) {
  const pass = env.SMTP_PASS;
  if (!pass) return null;
  return {
    host: env.SMTP_HOST || 'mail.dynasai.ai',
    port: Number(env.SMTP_PORT || 587),
    user: env.SMTP_USER || fromAddress(env),
    pass,
    tlsServername: env.SMTP_TLS_SERVERNAME || 'p4475.fra1.stableserver.net',
  };
}

export function parseEmails(raw: string | undefined) {
  return [
    ...new Set(
      String(raw || '')
        .split(/[,;]/)
        .map((value) => value.trim().toLowerCase())
        .filter((value) => value.includes('@') && value.includes('.')),
    ),
  ];
}

export function leadRecipients(env: Env) {
  const notify = parseEmails(env.LEAD_NOTIFY);
  const copies = parseEmails(env.LEAD_CC);
  const to = notify[0] || 'hello@dynasai.ai';
  const cc = [...new Set([...notify.slice(1), ...copies])].filter((email) => email !== to);
  return { to, cc };
}

type OutgoingMail = {
  to: string;
  cc?: string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: { email: string; name?: string };
};

export async function sendMail(
  env: Env,
  to: string,
  subject: string,
  text: string,
  html?: string,
  replyTo?: { email: string; name?: string },
  cc?: string[],
) {
  await sendMails(env, [{ to, cc, subject, text, html, replyTo }]);
}

export async function sendMails(env: Env, messages: OutgoingMail[]) {
  const from = fromAddress(env);
  const auth = smtpAuth(env);
  if (!auth) throw new Error('SMTP_PASS is not set');
  await sendSmtpTimed(
    auth,
    messages.map((message) => ({
      from,
      fromName: 'DynasAI',
      to: message.to,
      cc: message.cc,
      subject: message.subject,
      text: message.text,
      html: message.html,
      replyTo: message.replyTo,
    })),
  );
}

export async function queueMail(ctx: ExecutionContext | undefined, task: () => Promise<void>) {
  const run = task().catch((error) => {
    console.error('mail_queue_failed', { error: String(error) });
  });
  if (ctx) {
    ctx.waitUntil(run);
    return;
  }
  await run;
}
