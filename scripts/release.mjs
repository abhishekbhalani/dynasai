#!/usr/bin/env node
/**
 * Build and deploy DynasAI marketing site to Cloudflare Workers.
 *
 * Usage:
 *   npm run release
 *   npm run release -- --dry-run
 *   npm run release -- --skip-build
 *
 * Auth (pick one):
 *   - CLOUDFLARE_API_TOKEN (+ optional CLOUDFLARE_ACCOUNT_ID) in .env or shell
 *   - npx wrangler login
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const skipBuild = args.includes('--skip-build');
const skipAuthCheck = args.includes('--skip-auth-check');

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

function log(message) {
  console.log(`\n▸ ${message}`);
}

function fail(message, code = 1) {
  console.error(`\n✖ ${message}`);
  process.exit(code);
}

function loadCloudflareEnv() {
  const envPath = join(root, '.env');
  if (!existsSync(envPath)) {
    return;
  }

  const content = readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const eq = trimmed.indexOf('=');
    if (eq === -1) {
      continue;
    }

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key.startsWith('CLOUDFLARE_') && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

function run(command, commandArgs, options = {}) {
  const useShell = process.platform === 'win32';
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    stdio: 'inherit',
    shell: useShell,
    env: process.env,
    ...options,
  });

  if (result.error) {
    fail(result.error.message);
  }

  if (result.status !== 0) {
    fail(`Command failed: ${command} ${commandArgs.join(' ')}`, result.status ?? 1);
  }
}

function readWranglerName() {
  const configPath = join(root, 'wrangler.jsonc');
  if (!existsSync(configPath)) {
    return 'dynasai-web';
  }

  const raw = readFileSync(configPath, 'utf8');
  const match = raw.match(/"name"\s*:\s*"([^"]+)"/);
  return match?.[1] ?? 'dynasai-web';
}

function checkNodeVersion() {
  const required = '>=22.12.0';
  const current = process.versions.node;
  const [major, minor, patch] = current.split('.').map(Number);
  const ok =
    major > 22 ||
    (major === 22 && (minor > 12 || (minor === 12 && patch >= 0)));

  if (!ok) {
    fail(`Node ${required} required. Current: v${current}`);
  }
}

function checkWranglerAuth() {
  log('Checking Cloudflare auth (wrangler whoami)...');

  if (process.env.CLOUDFLARE_API_TOKEN) {
    console.log('  Using CLOUDFLARE_API_TOKEN from environment');
  }

  const result = spawnSync(npxCmd, ['wrangler', 'whoami'], {
    cwd: root,
    stdio: 'pipe',
    shell: process.platform === 'win32',
    encoding: 'utf8',
    env: process.env,
  });

  if (result.status === 0) {
    const lines = (result.stdout || '').trim().split('\n').filter(Boolean);
    for (const line of lines.slice(0, 3)) {
      console.log(`  ${line}`);
    }
    return;
  }

  fail(
    [
      'Cloudflare auth failed.',
      '',
      'Option A — API token (recommended for CI):',
      '  1. Create token: https://dash.cloudflare.com/profile/api-tokens',
      '  2. Use template "Edit Cloudflare Workers" OR custom:',
      '     Account → Workers Scripts → Edit',
      '  3. Add to .env (copy from .env.example):',
      '     CLOUDFLARE_API_TOKEN=your-token',
      '     CLOUDFLARE_ACCOUNT_ID=your-account-id',
      '',
      'Option B — Browser login:',
      '  npx wrangler login',
      '',
      'Then retry: npm run release',
    ].join('\n'),
  );
}

function main() {
  loadCloudflareEnv();

  const workerName = readWranglerName();

  console.log('DynasAI release → Cloudflare Workers');
  console.log(`Worker: ${workerName}`);
  console.log(`Mode: ${dryRun ? 'dry-run (build only)' : 'deploy'}`);

  checkNodeVersion();

  if (!skipAuthCheck && !dryRun) {
    checkWranglerAuth();
  }

  if (!skipBuild) {
    log('Building Astro site...');
    run(npmCmd, ['run', 'build']);
  } else {
    log('Skipping build (--skip-build)');
    if (!existsSync(join(root, 'dist'))) {
      fail('dist/ not found. Run npm run build first or remove --skip-build.');
    }
  }

  if (dryRun) {
    log('Dry run complete. dist/ is ready; deploy skipped.');
    console.log('\nNext: npm run release');
    return;
  }

  log('Deploying to Cloudflare Workers...');
  run(npxCmd, ['wrangler', 'deploy']);

  console.log('\n✔ Release complete.');
  console.log(`  Worker: ${workerName}`);
  console.log('  Site: https://dynasai.ai (www.dynasai.ai → 301 to apex)');
}

main();
