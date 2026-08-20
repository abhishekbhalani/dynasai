export async function sendMail(
  env: Env,
  to: string,
  subject: string,
  text: string,
  html?: string,
  replyTo?: { email: string; name?: string },
) {
  if (!env.EMAIL) throw new Error('EMAIL binding missing');
  const from = { email: env.PLAYBOOK_FROM || 'hello@dynasai.ai', name: 'DynasAI' };
  const safeHtml =
    html || `<p>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br/>')}</p>`;

  const withReply: EmailMessageBuilder = {
    to,
    from,
    subject,
    text,
    html: safeHtml,
    ...(replyTo?.email ? { replyTo: { email: replyTo.email, name: replyTo.name || replyTo.email } } : {}),
  };
  try {
    await env.EMAIL.send(withReply);
    return;
  } catch (error) {
    console.error('mail_html_failed', { error: String(error) });
  }

  try {
    await env.EMAIL.send({ to, from, subject, text, html: safeHtml });
    return;
  } catch (error) {
    console.error('mail_noreply_failed', { error: String(error) });
  }

  await env.EMAIL.send({ to, from, subject, text });
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
