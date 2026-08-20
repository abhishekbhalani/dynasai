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

async function api(method, path, body) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  const err = (json.errors || []).map((e) => `${e.code}: ${e.message}`).join('; ');
  console.log(method, path, json.success ? 'ok' : err);
  return json;
}

const ssl = await api('GET', `/zones/${zone}/settings/ssl`);
console.log('zone SSL', ssl.result?.value);

const list = await api('GET', `/zones/${zone}/dns_records?type=A&name=webmail.dynasai.ai`);
const webmail = list.result?.[0];
if (!webmail) {
  console.log('webmail A missing');
  process.exit(1);
}
console.log('webmail before', { proxied: webmail.proxied, content: webmail.content });
if (!webmail.proxied) {
  const patched = await api('PATCH', `/zones/${zone}/dns_records/${webmail.id}`, {
    type: 'A',
    name: 'webmail',
    content: '192.250.229.217',
    proxied: true,
    ttl: 1,
  });
  console.log('webmail after', { proxied: patched.result?.proxied });
} else {
  console.log('webmail already proxied');
}

const entry = await api('GET', `/zones/${zone}/rulesets/phases/http_config_settings/entrypoint`);
const existing = entry.success ? entry.result?.rules || [] : [];
const expression = 'http.host eq "webmail.dynasai.ai"';
const already = existing.find((r) => r.expression === expression && r.action === 'set_config');
if (already) {
  console.log('config rule already present', already.id);
} else if (entry.success && entry.result?.id) {
  await api('POST', `/zones/${zone}/rulesets/${entry.result.id}/rules`, {
    action: 'set_config',
    expression,
    description: 'Webmail origin cert is hosting wildcard — Full not Strict',
    enabled: true,
    action_parameters: { ssl: 'full' },
  });
} else {
  await api('POST', `/zones/${zone}/rulesets`, {
    name: 'Configuration rules',
    kind: 'zone',
    phase: 'http_config_settings',
    rules: [
      {
        action: 'set_config',
        expression,
        description: 'Webmail origin cert is hosting wildcard — Full not Strict',
        enabled: true,
        action_parameters: { ssl: 'full' },
      },
    ],
  });
}

const packs = await api('GET', `/zones/${zone}/ssl/certificate_packs?status=all`);
for (const pack of packs.result || []) {
  console.log('cert pack', pack.type, pack.status, (pack.hosts || []).join(', '));
}
