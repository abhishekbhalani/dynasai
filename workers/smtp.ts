import { connect } from 'cloudflare:sockets';
import { Buffer } from 'node:buffer';

type SmtpAuth = {
  host: string;
  port: number;
  user: string;
  pass: string;
  tlsServername?: string;
  implicitTls?: boolean;
};

type SmtpMessage = {
  from: string;
  fromName: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: { email: string; name?: string };
};

function b64(value: string) {
  return Buffer.from(value, 'utf8').toString('base64');
}

function wrapB64(value: string) {
  const raw = b64(value);
  const lines: string[] = [];
  for (let i = 0; i < raw.length; i += 76) lines.push(raw.slice(i, i + 76));
  return lines.join('\r\n');
}

function encodeSubject(subject: string) {
  if (/^[\x20-\x7e]*$/.test(subject)) return subject;
  return `=?UTF-8?B?${b64(subject)}?=`;
}

function address(email: string, name?: string) {
  if (!name) return `<${email}>`;
  const safe = name.replace(/[\r\n"]/g, '');
  if (/^[\x20-\x7e]*$/.test(safe)) return `"${safe}" <${email}>`;
  return `=?UTF-8?B?${b64(safe)}?= <${email}>`;
}

function buildMime(message: SmtpMessage) {
  const boundary = `dynasai_${crypto.randomUUID().replaceAll('-', '')}`;
  const date = new Date().toUTCString().replace('GMT', '+0000');
  const headers = [
    `From: ${address(message.from, message.fromName)}`,
    `To: ${address(message.to)}`,
    `Subject: ${encodeSubject(message.subject)}`,
    `Date: ${date}`,
    `Message-ID: <${crypto.randomUUID()}@dynasai.ai>`,
    'MIME-Version: 1.0',
  ];
  if (message.replyTo?.email) {
    headers.push(`Reply-To: ${address(message.replyTo.email, message.replyTo.name)}`);
  }

  const text = message.text || '';
  const html = message.html || `<p>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br/>')}</p>`;

  headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`, '');
  const body = [
    `--${boundary}`,
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrapB64(text),
    `--${boundary}`,
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrapB64(html),
    `--${boundary}--`,
    '',
  ].join('\r\n');

  return `${headers.join('\r\n')}\r\n${body}`.replace(/^\./gm, '..');
}

class SmtpSession {
  private reader: ReadableStreamDefaultReader<Uint8Array>;
  private writer: WritableStreamDefaultWriter<Uint8Array>;
  private buffer = '';

  constructor(private socket: Socket) {
    this.reader = socket.readable.getReader();
    this.writer = socket.writable.getWriter();
  }

  attach(socket: Socket) {
    this.socket = socket;
    this.reader = socket.readable.getReader();
    this.writer = socket.writable.getWriter();
    this.buffer = '';
  }

  async readReply() {
    const lines: string[] = [];
    for (;;) {
      while (!this.buffer.includes('\n')) {
        const chunk = await this.reader.read();
        if (chunk.done) throw new Error('SMTP connection closed');
        this.buffer += new TextDecoder().decode(chunk.value, { stream: true });
      }
      const idx = this.buffer.indexOf('\n');
      const line = this.buffer.slice(0, idx).replace(/\r$/, '');
      this.buffer = this.buffer.slice(idx + 1);
      lines.push(line);
      if (/^\d{3} /.test(line)) break;
    }
    const code = Number(lines.at(-1)?.slice(0, 3));
    return { code, lines };
  }

  async command(line: string) {
    await this.writer.write(new TextEncoder().encode(`${line}\r\n`));
    return this.readReply();
  }

  async data(payload: string) {
    const start = await this.command('DATA');
    if (start.code !== 354) throw new Error(`SMTP DATA ${start.lines.join(' | ')}`);
    await this.writer.write(new TextEncoder().encode(`${payload.replace(/\r?\n/g, '\r\n')}\r\n.\r\n`));
    return this.readReply();
  }

  async release() {
    try {
      this.writer.releaseLock();
    } catch {
      /* ignore */
    }
    try {
      this.reader.releaseLock();
    } catch {
      /* ignore */
    }
  }

  async close() {
    try {
      await this.command('QUIT');
    } catch {
      /* ignore */
    }
    try {
      await this.socket.close();
    } catch {
      /* ignore */
    }
  }
}

async function withTimeout<T>(task: Promise<T>, ms: number, label: string) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
  });
  try {
    return await Promise.race([task, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function sendSmtp(auth: SmtpAuth, messages: SmtpMessage | SmtpMessage[]) {
  const batch = Array.isArray(messages) ? messages : [messages];
  const socket = connect(
    { hostname: auth.host, port: auth.port },
    { secureTransport: auth.implicitTls ? 'on' : 'starttls', allowHalfOpen: false },
  );
  await socket.opened;
  const session = new SmtpSession(socket);
  const greet = await session.readReply();
  if (greet.code !== 220) throw new Error(`SMTP banner ${greet.lines.join(' | ')}`);

  const ehlo = await session.command('EHLO dynasai.ai');
  if (ehlo.code !== 250) throw new Error(`SMTP EHLO ${ehlo.lines.join(' | ')}`);

  if (!auth.implicitTls) {
    const start = await session.command('STARTTLS');
    if (start.code !== 220) throw new Error(`SMTP STARTTLS ${start.lines.join(' | ')}`);
    await session.release();
    const tls = socket.startTls(
      auth.tlsServername ? { expectedServerHostname: auth.tlsServername } : undefined,
    );
    await tls.opened;
    session.attach(tls);
    const ehloTls = await session.command('EHLO dynasai.ai');
    if (ehloTls.code !== 250) throw new Error(`SMTP EHLO TLS ${ehloTls.lines.join(' | ')}`);
  }

  const authStart = await session.command('AUTH LOGIN');
  if (authStart.code !== 334) throw new Error(`SMTP AUTH ${authStart.lines.join(' | ')}`);
  const userReply = await session.command(b64(auth.user));
  if (userReply.code !== 334) throw new Error(`SMTP USER ${userReply.lines.join(' | ')}`);
  const passReply = await session.command(b64(auth.pass));
  if (passReply.code !== 235) throw new Error('SMTP authentication failed');

  for (const message of batch) {
    const from = await session.command(`MAIL FROM:<${message.from}>`);
    if (from.code !== 250) throw new Error(`SMTP MAIL FROM ${from.lines.join(' | ')}`);
    const rcpt = await session.command(`RCPT TO:<${message.to}>`);
    if (rcpt.code !== 250) throw new Error(`SMTP RCPT ${rcpt.lines.join(' | ')}`);
    const data = await session.data(buildMime(message));
    if (data.code !== 250) throw new Error(`SMTP message rejected ${data.lines.join(' | ')}`);
  }
  await session.close();
}

export async function sendSmtpTimed(auth: SmtpAuth, messages: SmtpMessage | SmtpMessage[]) {
  const tlsHost = auth.tlsServername || 'p4475.fra1.stableserver.net';
  const attempts: SmtpAuth[] = [
    { ...auth, host: tlsHost, port: 587, implicitTls: false, tlsServername: tlsHost },
    { ...auth, host: tlsHost, port: 465, implicitTls: true, tlsServername: tlsHost },
    { ...auth, host: auth.host, port: 587, implicitTls: false, tlsServername: tlsHost },
  ];
  const errors: string[] = [];
  for (const attempt of attempts) {
    try {
      await withTimeout(sendSmtp(attempt, messages), 15000, `SMTP ${attempt.host}:${attempt.port}`);
      return;
    } catch (error) {
      errors.push(`${attempt.host}:${attempt.port} ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  throw new Error(errors.join(' | '));
}
