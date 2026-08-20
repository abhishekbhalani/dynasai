import { readFileSync } from 'node:fs';
import { connect as tlsConnect } from 'node:tls';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fileEnv = {};
for (const line of readFileSync(join(root, '.env'), 'utf8').split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
  const eq = trimmed.indexOf('=');
  fileEnv[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
}

const user = fileEnv.SMTP_USER;
const pass = fileEnv.SMTP_PASS;
const tlsName = 'p4475.fra1.stableserver.net';

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
  }
  readLine() {
    if (this.queue.length) return Promise.resolve(this.queue.shift());
    return new Promise((resolve) => this.waiters.push(resolve));
  }
  write(data) {
    this.socket.write(data);
  }
}

await new Promise((r) => setTimeout(r, 3000));
const socket = await new Promise((resolve, reject) => {
  const sock = tlsConnect({ host: 'mail.dynasai.ai', port: 993, servername: tlsName }, () => resolve(sock));
  sock.on('error', reject);
});
const io = new LineSocket(socket);
console.log(await io.readLine());

async function cmd(tag, line) {
  io.write(`${line}\r\n`);
  const lines = [];
  for (;;) {
    const row = await io.readLine();
    lines.push(row);
    if (row.startsWith(`${tag} `)) break;
  }
  return lines;
}

const login = await cmd('a1', `a1 LOGIN "${user}" "${pass.replaceAll('"', '\\"')}"`);
console.log('login', login.at(-1).includes('OK') ? 'ok' : login.at(-1));
const sel = await cmd('a2', 'a2 SELECT INBOX');
console.log(sel.filter((l) => l.includes('EXISTS') || l.includes('RECENT')).join(' | '));

for (const subject of ['Thanks for contacting DynasAI', 'New enquiry: Abhishek']) {
  const found = await cmd('s1', `s1 SEARCH SUBJECT "${subject}"`);
  console.log(subject, found.find((l) => l.startsWith('* SEARCH')) || found.at(-1));
}

await cmd('z', 'z LOGOUT');
socket.end();
