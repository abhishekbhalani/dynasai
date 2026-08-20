import { readFileSync } from 'node:fs';
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

const zone = 'deba22f5a6c2a3a60082565beb8f2968';
const headers = {
  Authorization: `Bearer ${fileEnv.CLOUDFLARE_API_TOKEN}`,
  'content-type': 'application/json',
};

async function call(label, method, path, body) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zone}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json();
  const err = (json.errors || []).map((e) => `${e.code}: ${e.message}`).join('; ');
  console.log(label, res.status, json.success ? 'ok' : err);
  return json;
}

await call('settings GET', 'GET', '/email/routing');
await call('dns GET', 'GET', '/email/routing/dns');
await call('unlock PATCH dns', 'PATCH', '/email/routing/dns', {});
await call('unlock POST', 'POST', '/email/routing/unlock', {});
await call('disable POST', 'POST', '/email/routing/disable', {});

const list = await call('records GET', 'GET', '/dns_records?per_page=100');
const recs = list.success ? list.result : [];
const mx = recs.filter((r) => r.type === 'MX' && r.name === 'dynasai.ai');
console.log(
  'current MX',
  mx.map((r) => `${r.priority} ${r.content}`).join(', ') || '(none)',
);

const cfMx = mx.filter((r) => String(r.content).includes('mx.cloudflare.net'));
for (const rec of cfMx) {
  await call(`delete CF MX ${rec.content}`, 'DELETE', `/dns_records/${rec.id}`);
}

const hostingMx = recs.find((r) => r.type === 'MX' && r.content === 'mail.dynasai.ai');
if (hostingMx) {
  console.log('MX already mail.dynasai.ai');
} else {
  await call('create hosting MX', 'POST', '/dns_records', {
    type: 'MX',
    name: '@',
    content: 'mail.dynasai.ai',
    priority: 0,
    ttl: 1,
    proxied: false,
  });
}

const desiredSpf = 'v=spf1 a:mail.dynasai.ai include:spf.mysecurecloudhost.com -all';
const spf = recs.find((r) => r.type === 'TXT' && r.name === 'dynasai.ai' && String(r.content).includes('v=spf1'));
if (!spf) {
  await call('restore SPF', 'POST', '/dns_records', {
    type: 'TXT',
    name: '@',
    content: desiredSpf,
    ttl: 1,
  });
}

const mailA = recs.find((r) => r.type === 'A' && r.name === 'mail.dynasai.ai');
if (!mailA) {
  await call('restore mail A', 'POST', '/dns_records', {
    type: 'A',
    name: 'mail',
    content: '192.250.229.217',
    ttl: 1,
    proxied: false,
  });
}
