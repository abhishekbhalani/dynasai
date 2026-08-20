import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const env = {};
for (const line of readFileSync(join(root, '.env'), 'utf8').split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
  const eq = trimmed.indexOf('=');
  let value = trimmed.slice(eq + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  env[trimmed.slice(0, eq).trim()] = value;
}

const zone = 'deba22f5a6c2a3a60082565beb8f2968';
const headers = {
  Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
  'content-type': 'application/json',
};

const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zone}/dns_records?per_page=100`, { headers });
const json = await res.json();
if (!json.success) {
  console.log(JSON.stringify({ ok: false, errors: json.errors }));
  process.exit(1);
}
for (const rec of json.result) {
  console.log(
    JSON.stringify({
      id: rec.id,
      type: rec.type,
      name: rec.name,
      content: rec.content,
      priority: rec.priority,
      proxied: rec.proxied,
      ttl: rec.ttl,
    }),
  );
}
