#!/usr/bin/env node
/**
 * Create GitHub Actions environment, variables, and Cloudflare secrets.
 *
 * Does not create a Cloudflare API token (that is Cloudflare dashboard only).
 * Reads CLOUDFLARE_* from .env if present and never prints secret values.
 *
 * Usage:
 *   npm run cicd:github
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const VARIABLES = {
  PUBLIC_SITE_URL: 'https://dynasai.ai',
  PUBLIC_APP_URL: 'https://app.dynasai.ai',
  PUBLIC_GTM_ID: 'GTM-KDPPRVV2',
  PUBLIC_CONTACT_EMAIL: 'hello@dynasai.ai',
  CLOUDFLARE_WORKER_NAME: 'dynasai-web',
  CLOUDFLARE_PAGES_PROJECT: 'dynasai',
  PRODUCTION_HOSTNAME: 'dynasai.ai',
};

const SECRET_KEYS = ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID'];

function fail(message, code = 1) {
  console.error(`\n✖ ${message}`);
  process.exit(code);
}

function run(args, options = {}) {
  const result = spawnSync('gh', args, {
    cwd: root,
    encoding: 'utf8',
    shell: false,
    ...options,
  });
  if (result.error) {
    fail(result.error.message);
  }
  if (result.status !== 0) {
    fail((result.stderr || result.stdout || `gh ${args.join(' ')} failed`).trim(), result.status ?? 1);
  }
  return (result.stdout || '').trim();
}

function loadDotEnv() {
  const envPath = join(root, '.env');
  const values = {};
  if (!existsSync(envPath)) {
    return values;
  }

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
    if (value) values[key] = value;
  }
  return values;
}

function setVariable(name, value, envName) {
  const args = ['variable', 'set', name, '--body', value];
  if (envName) args.push('--env', envName);
  run(args);
  console.log(`  variable ${name}${envName ? ` (${envName})` : ''}: set`);
}

function setSecret(name, value, envName) {
  const args = ['secret', 'set', name];
  if (envName) args.push('--env', envName);
  run(args, { input: value, stdio: ['pipe', 'pipe', 'pipe'] });
  console.log(`  secret ${name}${envName ? ` (${envName})` : ''}: set`);
}

function main() {
  console.log('DynasAI GitHub CI/CD setup');

  const repo = run(['repo', 'view', '--json', 'nameWithOwner', '--jq', '.nameWithOwner']);
  if (!repo) {
    fail('GitHub CLI is not logged in. Run: gh auth login');
  }
  console.log(`Repo: ${repo}`);

  logCreateEnvironment();

  console.log('\n▸ Repository variables');
  for (const [name, value] of Object.entries(VARIABLES)) {
    setVariable(name, value);
    setVariable(name, value, 'production');
  }

  const env = loadDotEnv();
  const missing = [];

  console.log('\n▸ Production secrets');
  for (const key of SECRET_KEYS) {
    const value = process.env[key] || env[key];
    if (!value) {
      missing.push(key);
      console.log(`  secret ${key}: missing (add to .env then re-run)`);
      continue;
    }
    setSecret(key, value);
    setSecret(key, value, 'production');
  }

  console.log('\n✔ GitHub environment `production` is ready.');
  console.log('  After merging a PR, run Actions → Release → Run workflow.');

  if (missing.length) {
    console.log('\nStill needed from Cloudflare (cannot be created on GitHub):');
    console.log('  1. https://dash.cloudflare.com/profile/api-tokens');
    console.log('  2. Create Token → Edit Cloudflare Workers');
    console.log('     Include Account Settings → Read if whoami fails');
    console.log('  3. Copy Account ID from the Cloudflare dashboard URL or Workers overview');
    console.log('  4. Put them in .env, then: npm run cicd:github');
    process.exit(2);
  }
}

function logCreateEnvironment() {
  console.log('\n▸ GitHub environment: production');
  const result = spawnSync(
    'gh',
    ['api', '--method', 'PUT', 'repos/{owner}/{repo}/environments/production'],
    { cwd: root, encoding: 'utf8', shell: false },
  );
  if (result.status !== 0) {
    fail((result.stderr || result.stdout || 'Failed to create production environment').trim(), result.status ?? 1);
  }
  console.log('  environment production: created/updated');
}

main();
