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
const base = `https://api.cloudflare.com/client/v4/zones/${zone}/dns_records`;

async function api(method, path, body) {
  const url = path.startsWith('http') ? path : `${base}${path}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!json.success) {
    const err = (json.errors || []).map((e) => `${e.code}: ${e.message}`).join('; ');
    return { ok: false, err, result: null };
  }
  return { ok: true, err: '', result: json.result };
}

function log(label, rec) {
  console.log(label, rec.ok ? 'ok' : rec.err);
}

const list = await api('GET', '?per_page=100');
if (!list.ok) {
  console.log('list', list.err);
  process.exit(1);
}
const recs = list.result;

function find(type, name) {
  return recs.filter((r) => r.type === type && r.name === name);
}

const desiredSpf = 'v=spf1 a:mail.dynasai.ai include:spf.mysecurecloudhost.com -all';
const spf = find('TXT', 'dynasai.ai').find((r) => String(r.content).includes('v=spf1'));
if (!spf) {
  log('SPF create', await api('POST', '', { type: 'TXT', name: '@', content: desiredSpf, ttl: 1 }));
} else if (String(spf.content).replaceAll('"', '') !== desiredSpf) {
  log('SPF update', await api('PATCH', `/${spf.id}`, { type: 'TXT', name: '@', content: desiredSpf, ttl: 1 }));
} else {
  console.log('SPF already set');
}

const srvs = [
  { service: '_imaps', port: 993 },
  { service: '_pop3s', port: 995 },
  { service: '_smtps', port: 465 },
];
for (const s of srvs) {
  const full = `${s.service}._tcp.dynasai.ai`;
  if (find('SRV', full).length) {
    console.log('SRV skip', full);
    continue;
  }
  log(
    `SRV ${full}`,
    await api('POST', '', {
      type: 'SRV',
      name: `${s.service}._tcp`,
      data: {
        service: s.service,
        proto: '_tcp',
        name: 'dynasai.ai',
        priority: 0,
        weight: 1,
        port: s.port,
        target: 'mail.dynasai.ai',
      },
      ttl: 1,
    }),
  );
}

const hostingMx = find('MX', 'dynasai.ai').find((r) => r.content === 'mail.dynasai.ai');
if (hostingMx) {
  console.log('MX already mail.dynasai.ai');
} else {
  log(
    'MX mail.dynasai.ai',
    await api('POST', '', {
      type: 'MX',
      name: '@',
      content: 'mail.dynasai.ai',
      priority: 0,
      ttl: 1,
      proxied: false,
    }),
  );
}

const desiredDkim =
  'v=DKIM1; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA47kSKXS8v0o59LDGMjNY0weLqG/HjIGdw7d0DxHbd3BWgP+uFLGiRlCNfb/UuC9kxrRcgTHmAfnTTsvgJGga9JFWYUuSwoNnI4Qfw6qLDwq7FRQnaLIFScUzrBw1KhY4CZr6kWOuB6qQY70FjcZ1AWLJpamuPzcW1i8J/xkFGLHdctxFKM0Qi5XlBFgqYGcnv/jQj29OgnLmLt0gVYH3Ll6AAvbsV22E8yodP7uXMBS78lh2+9jvl73J2OHtEtihpYHKb9C2AdYLUdzOX9JHOQBgWupneBAhuj7Lgm8EBhln0M5jIvkLhO2W8Wt6/xV1zVFBwMhUevmzRKdiZK+JLwIDAQAB';
const dkimName = 'default._domainkey.dynasai.ai';
const dkim = find('TXT', dkimName)[0];
const dkimBody = { type: 'TXT', name: 'default._domainkey', content: desiredDkim, ttl: 1 };
if (!dkim) {
  log('DKIM create', await api('POST', '', dkimBody));
} else if (String(dkim.content).replaceAll('"', '') !== desiredDkim) {
  log('DKIM update', await api('PATCH', `/${dkim.id}`, dkimBody));
} else {
  console.log('DKIM already set');
}
