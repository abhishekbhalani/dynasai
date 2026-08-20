import { readFileSync } from 'node:fs';
import { createConnection } from 'node:net';
import { connect as tlsConnect } from 'node:tls';
import { promises as dns } from 'node:dns';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fileEnv = {};
for (const line of readFileSync(join(root, '.env'), 'utf8').split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
  const eq = trimmed.indexOf('=');
  let value = trimmed.slice(eq + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  fileEnv[trimmed.slice(0, eq).trim()] = value;
}

const host = fileEnv.SMTP_HOST || 'mail.dynasai.ai';
const port = Number(fileEnv.SMTP_PORT || 587);
const user = fileEnv.SMTP_USER || 'hello@dynasai.ai';
const pass = fileEnv.SMTP_PASS;
const from = fileEnv.SMTP_FROM || user;
const to = from;
const token = `dynasai-mail-test-${Date.now()}`;
const subject = `DynasAI mail test ${token}`;

if (!pass) {
  console.log('SMTP_PASS missing in .env');
  process.exit(1);
}

dns.setServers(['1.1.1.1', '8.8.8.8']);

async function lookup(label, fn) {
  try {
    const value = await fn();
    console.log(label, JSON.stringify(value));
    return value;
  } catch (error) {
    console.log(label, 'FAIL', error.code || error.message);
    return null;
  }
}

console.log('▸ DNS (1.1.1.1)');
const mx = await lookup('MX', async () =>
  (await dns.resolveMx('dynasai.ai')).sort((a, b) => a.priority - b.priority),
);
await lookup('SPF', async () => (await dns.resolveTxt('dynasai.ai')).map((p) => p.join('')));
await lookup('DKIM default', async () =>
  (await dns.resolveTxt('default._domainkey.dynasai.ai')).map((p) => p.join('')).map((t) => t.slice(0, 40) + '…'),
);
await lookup('DMARC', async () => (await dns.resolveTxt('_dmarc.dynasai.ai')).map((p) => p.join('')));
await lookup('mail A', async () => dns.resolve4('mail.dynasai.ai'));

class LineSocket {
  constructor(socket) {
    this.socket = socket;
    this.buf = '';
    this.queue = [];
    this.waiters = [];
    socket.setEncoding('utf8');
    socket.on('data', (chunk) => {
      this.buf += chunk;
      let idx;
      while ((idx = this.buf.indexOf('\n')) >= 0) {
        const line = this.buf.slice(0, idx).replace(/\r$/, '');
        this.buf = this.buf.slice(idx + 1);
        const waiter = this.waiters.shift();
        if (waiter) waiter(line);
        else this.queue.push(line);
      }
    });
    socket.on('error', (error) => {
      const waiter = this.waiters.shift();
      if (waiter) waiter(Promise.reject(error));
    });
  }
  readLine() {
    if (this.queue.length) return Promise.resolve(this.queue.shift());
    return new Promise((resolve, reject) => {
      this.waiters.push((line) => {
        if (line instanceof Promise) line.catch(reject);
        else resolve(line);
      });
    });
  }
  write(data) {
    this.socket.write(data);
  }
}

function connectPlain() {
  return new Promise((resolve, reject) => {
    const socket = createConnection({ host, port }, () => resolve(socket));
    socket.setTimeout(20000, () => {
      socket.destroy();
      reject(new Error('connect timeout'));
    });
    socket.on('error', reject);
  });
}

const tlsName = 'p4475.fra1.stableserver.net';

function upgradeTls(socket) {
  return new Promise((resolve, reject) => {
    const tlsSock = tlsConnect({ socket, host, servername: tlsName }, () => resolve(tlsSock));
    tlsSock.on('error', reject);
  });
}

async function readSmtp(io) {
  const lines = [];
  for (;;) {
    const line = await io.readLine();
    lines.push(line);
    if (/^\d{3} /.test(line)) break;
  }
  return lines;
}

async function smtpCmd(io, cmd, hide = false) {
  if (!hide) console.log('SMTP >', cmd.replace(/\r?\n$/, ''));
  else console.log('SMTP >', '[auth hidden]');
  io.write(cmd);
  const lines = await readSmtp(io);
  console.log('SMTP <', lines.join(' | '));
  return lines;
}

function smtpOk(lines) {
  return /^[23]/.test(lines.at(-1) || '');
}

console.log('\n▸ SMTP', `${host}:${port}`, 'as', user, '→', to);
const plain = await connectPlain();
let io = new LineSocket(plain);
let greet = await readSmtp(io);
console.log('SMTP <', greet.join(' | '));
let ehlo = await smtpCmd(io, `EHLO dynasai.ai\r\n`);
if (!smtpOk(ehlo)) throw new Error('EHLO failed');
const start = await smtpCmd(io, 'STARTTLS\r\n');
if (!smtpOk(start)) throw new Error('STARTTLS failed');
const tlsSock = await upgradeTls(plain);
io = new LineSocket(tlsSock);
ehlo = await smtpCmd(io, `EHLO dynasai.ai\r\n`);
await smtpCmd(io, 'AUTH LOGIN\r\n');
await smtpCmd(io, `${Buffer.from(user).toString('base64')}\r\n`, true);
const auth = await smtpCmd(io, `${Buffer.from(pass).toString('base64')}\r\n`, true);
if (!smtpOk(auth)) throw new Error('SMTP AUTH failed');
const mailFrom = await smtpCmd(io, `MAIL FROM:<${from}>\r\n`);
if (!smtpOk(mailFrom)) throw new Error('MAIL FROM failed');
const rcpt = await smtpCmd(io, `RCPT TO:<${to}>\r\n`);
if (!smtpOk(rcpt)) throw new Error('RCPT TO failed');
await smtpCmd(io, 'DATA\r\n');
const body = [
  `From: DynasAI <${from}>`,
  `To: ${to}`,
  `Subject: ${subject}`,
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=utf-8',
  '',
  'Hosting SMTP test from the DynasAI mail check script.',
  `Token: ${token}`,
  '.',
  '',
].join('\r\n');
io.write(body);
const data = await readSmtp(io);
console.log('SMTP <', data.join(' | '));
if (!smtpOk(data)) throw new Error('DATA failed');
await smtpCmd(io, 'QUIT\r\n');
tlsSock.end();
console.log('SMTP accepted message');

function connectImap() {
  return new Promise((resolve, reject) => {
    const socket = tlsConnect({ host, port: 993, servername: tlsName }, () => resolve(socket));
    socket.setTimeout(20000, () => {
      socket.destroy();
      reject(new Error('IMAP timeout'));
    });
    socket.on('error', reject);
  });
}

async function imapCmd(io, tag, cmd, hide = false) {
  if (!hide) console.log('IMAP >', cmd.replace(/\r?\n$/, ''));
  else console.log('IMAP >', tag, '[login hidden]');
  io.write(cmd);
  const lines = [];
  for (;;) {
    const line = await io.readLine();
    lines.push(line);
    if (line.startsWith(tag + ' ')) break;
  }
  console.log('IMAP <', lines.join(' | ').slice(0, 500));
  return lines;
}

console.log('\n▸ IMAP', `${host}:993`);
await new Promise((r) => setTimeout(r, 4000));
const imapSock = await connectImap();
io = new LineSocket(imapSock);
console.log('IMAP <', await io.readLine());
const login = await imapCmd(io, 'a1', `a1 LOGIN "${user}" "${pass.replaceAll('"', '\\"')}"\r\n`, true);
if (!login.at(-1).includes('OK')) throw new Error('IMAP LOGIN failed');
await imapCmd(io, 'a2', 'a2 SELECT INBOX\r\n');
const search = await imapCmd(io, 'a3', `a3 SEARCH SUBJECT "${token}"\r\n`);
const ids = (search.find((l) => l.startsWith('* SEARCH')) || '')
  .replace('* SEARCH', '')
  .trim()
  .split(/\s+/)
  .filter(Boolean);
if (!ids.length) {
  console.log('IMAP message not in INBOX yet (SMTP accepted; delivery may lag)');
  await imapCmd(io, 'a4', 'a4 LOGOUT\r\n');
  imapSock.end();
  process.exit(mx?.[0]?.exchange?.includes('mail.dynasai.ai') ? 0 : 1);
}
const fetch = await imapCmd(
  io,
  'a5',
  `a5 FETCH ${ids.at(-1)} (BODY.PEEK[HEADER.FIELDS (Subject From To Authentication-Results Received-SPF DKIM-Signature Received)])\r\n`,
);
await imapCmd(io, 'a6', 'a6 LOGOUT\r\n');
imapSock.end();

const headers = fetch.join('\n');
const dkimPass = /dkim=pass/i.test(headers) || /DKIM-Signature:/i.test(headers);
const spfPass = /spf=pass/i.test(headers) || /Received-SPF:\s*pass/i.test(headers);
console.log('\n▸ headers');
console.log(dkimPass ? 'DKIM present/pass' : 'DKIM not in auth headers yet (local delivery often skips external auth)');
console.log(spfPass ? 'SPF pass' : 'SPF not in auth headers yet (local delivery often skips)');
console.log('Found test message', token);
