export async function sendMail(
  env: Env,
  to: string,
  subject: string,
  text: string,
  html?: string,
  replyTo?: { email: string; name?: string },
) {
  if (!env.EMAIL) throw new Error('EMAIL binding missing');
  const from = env.PLAYBOOK_FROM || 'hello@dynasai.ai';
  await env.EMAIL.send({
    to,
    from: { email: from, name: 'DynasAI' },
    subject,
    text,
    html: html || `<p>${text.replace(/\n/g, '<br/>')}</p>`,
    ...(replyTo?.email ? { replyTo: { email: replyTo.email, name: replyTo.name || replyTo.email } } : {}),
  });
}
