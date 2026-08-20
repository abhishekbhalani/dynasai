import { spawnSync } from 'node:child_process';
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
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  fileEnv[trimmed.slice(0, eq).trim()] = value;
}

const token = fileEnv.CLOUDFLARE_API_TOKEN;
const account = fileEnv.CLOUDFLARE_ACCOUNT_ID || '67547d9fd5363024d30f53c31487cf48';
const zone = 'deba22f5a6c2a3a60082565beb8f2968';
const headers = { Authorization: `Bearer ${token}` };

async function hit(name, url, method = 'GET', body) {
  const res = await fetch(url, {
    method,
    headers: body ? { ...headers, 'content-type': 'application/json' } : headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  const err = json.errors?.[0];
  const out = { name, http: res.status, success: json.success, code: err?.code, message: err?.message };
  if (Array.isArray(json.result)) out.count = json.result.length;
  if (json.result && typeof json.result === 'object' && !Array.isArray(json.result)) {
    out.enabled = json.result.enabled;
    out.status = json.result.status;
  }
  console.log(JSON.stringify(out));
  return json.success === true;
}

const sendingOk = await hit('sending_zones', `https://api.cloudflare.com/client/v4/accounts/${account}/email/sending/zones`);
await hit('sending_subdomains', `https://api.cloudflare.com/client/v4/zones/${zone}/email/sending/subdomains`);
await hit('routing_rules', `https://api.cloudflare.com/client/v4/zones/${zone}/email/routing/rules`);
await hit('routing', `https://api.cloudflare.com/client/v4/zones/${zone}/email/routing`);

if (sendingOk) {
  const env = { ...process.env, ...Object.fromEntries(Object.entries(fileEnv).filter(([k]) => k.startsWith('CLOUDFLARE_'))) };
  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  console.log('\n▸ wrangler email sending enable dynasai.ai');
  spawnSync(npx, ['wrangler', 'email', 'sending', 'enable', 'dynasai.ai', '--zone-id', zone], {
    cwd: root,
    env,
    stdio: 'inherit',
    shell: true,
  });
}
