#!/usr/bin/env node
/**
 * Create and deploy a Cloudflare Pages project using CLOUDFLARE_* from .env.
 *
 * Usage:
 *   npm run pages:create
 *   npm run pages:create -- --skip-deploy
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const wranglerJs = join(root, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const args = process.argv.slice(2);
const skipDeploy = args.includes('--skip-deploy');
const projectName = process.env.CLOUDFLARE_PAGES_PROJECT || 'dynasai';

function fail(message, code = 1) {
  console.error(`\n✖ ${message}`);
  process.exit(code);
}

function loadCloudflareEnv() {
  const envPath = join(root, '.env');
  if (!existsSync(envPath)) return;
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
    if (key.startsWith('CLOUDFLARE_') && value) {
      process.env[key] = value;
    }
  }
}

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32' && command !== process.execPath,
    env: process.env,
    ...options,
  });
  if (result.error) fail(result.error.message);
  return result.status ?? 1;
}

function wrangler(wranglerArgs) {
  console.log(`\n▸ wrangler ${wranglerArgs.join(' ')}`);
  return run(process.execPath, [wranglerJs, ...wranglerArgs]);
}

loadCloudflareEnv();

if (!process.env.CLOUDFLARE_API_TOKEN) {
  fail('CLOUDFLARE_API_TOKEN missing in .env');
}

console.log('Create Cloudflare Pages project');
console.log(`Project: ${projectName}`);
console.log(`Account: ${process.env.CLOUDFLARE_ACCOUNT_ID ? 'set' : 'missing'}`);

const createStatus = wrangler([
  'pages',
  'project',
  'create',
  projectName,
  '--production-branch',
  'main',
]);

if (createStatus !== 0) {
  console.log('\nCreate returned an error — checking if the project already exists...');
  const listed = spawnSync(process.execPath, [wranglerJs, 'pages', 'project', 'list'], {
    cwd: root,
    encoding: 'utf8',
    env: process.env,
  });
  const output = `${listed.stdout || ''}${listed.stderr || ''}`;
  if (!output.includes(projectName)) {
    fail(
      [
        'Could not create the Pages project.',
        'Edit the API token and add: Account → Cloudflare Pages → Edit',
        'https://dash.cloudflare.com/profile/api-tokens',
      ].join('\n'),
      createStatus,
    );
  }
  console.log(`Project ${projectName} already exists — continuing.`);
}

if (skipDeploy) {
  console.log(`\n✔ Pages project ready: https://${projectName}.pages.dev`);
  process.exit(0);
}

if (!existsSync(join(root, 'dist', 'index.html'))) {
  console.log('\n▸ Building Astro site...');
  const buildStatus = run(npmCmd, ['run', 'build']);
  if (buildStatus !== 0) fail('Astro build failed', buildStatus);
}

const deployStatus = wrangler([
  'pages',
  'deploy',
  'dist',
  '--project-name',
  projectName,
  '--branch',
  'main',
  '--commit-dirty=true',
]);

if (deployStatus !== 0) fail('Pages deploy failed', deployStatus);

console.log(`\n✔ Pages project: ${projectName}`);
console.log(`  URL: https://${projectName}.pages.dev`);
console.log('  Custom domain dynasai.ai stays on Worker dynasai-web unless you move it.');
