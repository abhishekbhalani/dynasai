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

export async function sendMail(
  env: Env,
  to: string,
  subject: string,
  text: string,
  html?: string,
  replyTo?: { email: string; name?: string },
) {
  const from = fromAddress(env);
  const safeHtml =
    html || `<p>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br/>')}</p>`;
  const auth = smtpAuth(env);
  if (!auth) throw new Error('SMTP_PASS is not set');
  await sendSmtpTimed(auth, {
    from,
    fromName: 'DynasAI',
    to,
    subject,
    text,
    html: safeHtml,
    replyTo,
  });
}

export async function sendMails(
  env: Env,
  messages: {
    to: string;
    subject: string;
    text: string;
    html?: string;
    replyTo?: { email: string; name?: string };
  }[],
) {
  const from = fromAddress(env);
  const auth = smtpAuth(env);
  if (!auth) throw new Error('SMTP_PASS is not set');
  await sendSmtpTimed(
    auth,
    messages.map((message) => ({
      from,
      fromName: 'DynasAI',
      to: message.to,
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
