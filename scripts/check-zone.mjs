import { existsSync, readFileSync } from 'node:fs';

const envPath = '.env';
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key.startsWith('CLOUDFLARE_') && value) process.env[key] = value;
  }
}

const token = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
if (!token) {
  console.log('token missing');
  process.exit(1);
}

const res = await fetch('https://api.cloudflare.com/client/v4/zones?name=dynasai.ai', {
  headers: { Authorization: `Bearer ${token}` },
});
const body = await res.json();
const ok = Boolean(body.success);
const count = Array.isArray(body.result) ? body.result.length : 0;
const zone = body.result?.[0];
console.log('zones_api', ok ? 'ok' : 'fail', 'count', count);
if (zone) {
  console.log('zone', zone.name, 'status', zone.status);
  console.log('zone_account_matches_env', zone.account?.id === accountId);
  console.log('ZONE_ID', zone.id);
}
if (!ok && body.errors?.[0]) {
  console.log('error', body.errors[0].code, body.errors[0].message);
}
if (accountId) console.log('env_account_set', true);
