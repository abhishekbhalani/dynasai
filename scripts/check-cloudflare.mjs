#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const envPath = join(root, '.env');
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
    if (key.startsWith('CLOUDFLARE_') && value && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

console.log('CLOUDFLARE_API_TOKEN:', process.env.CLOUDFLARE_API_TOKEN ? 'set' : 'missing');
console.log('CLOUDFLARE_ACCOUNT_ID:', process.env.CLOUDFLARE_ACCOUNT_ID ? 'set' : 'missing');

const result = spawnSync(npxCmd, ['wrangler', 'whoami'], {
  cwd: root,
  stdio: 'inherit',
  shell: false,
  env: process.env,
});

process.exit(result.status ?? 1);
