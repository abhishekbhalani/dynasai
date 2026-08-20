/**
 * Local MCP for Cloudflare Zaraz (Tag setup) + Configuration Rules.
 * Official Cloudflare MCP does not expose Zaraz custom actions.
 *
 * Env: CLOUDFLARE_API_TOKEN (from src/.env) and CLOUDFLARE_ZONE_ID (optional).
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID || 'deba22f5a6c2a3a60082565beb8f2968';
const API = 'https://api.cloudflare.com/client/v4';
const ADMIN_HOST = process.env.ADMIN_HOST || 'admin.dynasai.ai';
const RULE_DESC = 'dynasai: disable Zaraz on admin host';

function loadDotEnv() {
  const file = resolve(ROOT, '.env');
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadDotEnv();

function token() {
  const value = process.env.CLOUDFLARE_API_TOKEN || '';
  if (!value) throw new Error('CLOUDFLARE_API_TOKEN missing. Put it in src/.env (same token Cursor can read).');
  return value;
}

async function cf(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      authorization: `Bearer ${token()}`,
      'content-type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) {
    const msg = (json.errors || []).map((e) => e.message || JSON.stringify(e)).join('; ') || `HTTP ${res.status}`;
    if (res.status === 403) {
      throw new Error(
        `Cloudflare 403 on ${path}. Edit the API token and add Zone permissions: Zaraz → Edit, Config Rules → Edit. ${msg}`,
      );
    }
    throw new Error(msg);
  }
  return json.result;
}

async function getConfig() {
  return cf('GET', `/zones/${ZONE_ID}/settings/zaraz/config`);
}

async function putConfig(config) {
  return cf('PUT', `/zones/${ZONE_ID}/settings/zaraz/config`, config);
}

function summarize(config) {
  const tools = Object.entries(config.tools || {}).map(([id, tool]) => ({
    id,
    name: tool.name,
    type: tool.type,
    enabled: tool.enabled,
    actions: Object.entries(tool.actions || {}).map(([actionId, action]) => ({
      id: actionId,
      actionType: action.actionType,
      firingTriggers: action.firingTriggers || [],
    })),
  }));
  const triggers = Object.entries(config.triggers || {}).map(([id, trigger]) => ({
    id,
    name: trigger.name,
    description: trigger.description || '',
  }));
  return { debugKey: Boolean(config.debugKey), tools, triggers };
}

async function disableZarazOnHost(hostname = ADMIN_HOST) {
  const expression = `(http.host eq "${hostname}")`;
  let current;
  try {
    current = await cf('GET', `/zones/${ZONE_ID}/rulesets/phases/http_config_settings/entrypoint`);
  } catch {
    current = { rules: [] };
  }
  const rules = [...(current.rules || [])];
  const nextRule = {
    description: RULE_DESC,
    expression,
    action: 'set_config',
    enabled: true,
    action_parameters: { disable_zaraz: true },
  };
  const idx = rules.findIndex((rule) => rule.description === RULE_DESC);
  if (idx >= 0) rules[idx] = { ...rules[idx], ...nextRule };
  else rules.push(nextRule);

  return cf('PUT', `/zones/${ZONE_ID}/rulesets/phases/http_config_settings/entrypoint`, {
    rules: rules.map((rule) => {
      const next = {
        description: rule.description,
        expression: rule.expression,
        action: rule.action || 'set_config',
        enabled: rule.enabled !== false,
        action_parameters: rule.action_parameters,
      };
      if (rule.id) next.id = rule.id;
      return next;
    }),
  });
}

const tools = [
  {
    name: 'zaraz_status',
    description: 'Check Zaraz API access and list tools, triggers, and actions on dynasai.ai.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'zaraz_get_config',
    description: 'Get the full Zaraz (Tag setup) config JSON for the dynasai.ai zone.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'zaraz_upsert_trigger',
    description: 'Create or replace a Zaraz trigger. Merge-safe: reads config, writes one trigger, PUT config.',
    inputSchema: {
      type: 'object',
      required: ['id', 'trigger'],
      properties: {
        id: { type: 'string', description: 'Trigger key, e.g. generate_lead_click' },
        trigger: { type: 'object', description: 'Zaraz trigger object (name, loadRules/clientRules, etc.)' },
      },
    },
  },
  {
    name: 'zaraz_upsert_action',
    description: 'Create or replace a custom action on an existing Zaraz tool (e.g. GA4 event).',
    inputSchema: {
      type: 'object',
      required: ['toolId', 'actionId', 'action'],
      properties: {
        toolId: { type: 'string', description: 'Key from zaraz_status tools[].id' },
        actionId: { type: 'string', description: 'Action key, e.g. generate_lead' },
        action: {
          type: 'object',
          description: 'actionType, firingTriggers, blockingTriggers, data',
        },
      },
    },
  },
  {
    name: 'zaraz_publish',
    description: 'Publish the current Zaraz preview/draft config to production.',
    inputSchema: {
      type: 'object',
      properties: {
        description: { type: 'string' },
      },
    },
  },
  {
    name: 'zaraz_skip_admin_host',
    description: 'Add/update a Configuration Rule that disables Zaraz on admin.dynasai.ai (no Google tags on the admin panel).',
    inputSchema: {
      type: 'object',
      properties: {
        hostname: { type: 'string', description: 'Defaults to admin.dynasai.ai' },
      },
    },
  },
];

async function callTool(name, args = {}) {
  if (name === 'zaraz_status') {
    const config = await getConfig();
    return summarize(config);
  }
  if (name === 'zaraz_get_config') return getConfig();
  if (name === 'zaraz_upsert_trigger') {
    const config = await getConfig();
    config.triggers = config.triggers || {};
    config.triggers[args.id] = args.trigger;
    await putConfig(config);
    return { ok: true, id: args.id };
  }
  if (name === 'zaraz_upsert_action') {
    const config = await getConfig();
    const tool = config.tools?.[args.toolId];
    if (!tool) throw new Error(`Unknown Zaraz tool "${args.toolId}". Call zaraz_status first.`);
    tool.actions = tool.actions || {};
    tool.actions[args.actionId] = args.action;
    await putConfig(config);
    return { ok: true, toolId: args.toolId, actionId: args.actionId };
  }
  if (name === 'zaraz_publish') {
    return cf('POST', `/zones/${ZONE_ID}/settings/zaraz/publish`, {
      description: args.description || 'Published from dynasai Zaraz MCP',
    });
  }
  if (name === 'zaraz_skip_admin_host') {
    const result = await disableZarazOnHost(args.hostname || ADMIN_HOST);
    return { ok: true, hostname: args.hostname || ADMIN_HOST, ruleset: result?.id || result?.name || 'updated' };
  }
  throw new Error(`Unknown tool: ${name}`);
}

function send(message) {
  const body = Buffer.from(JSON.stringify(message), 'utf8');
  process.stdout.write(`Content-Length: ${body.length}\r\n\r\n`);
  process.stdout.write(body);
}

function reply(id, result) {
  send({ jsonrpc: '2.0', id, result });
}

function fail(id, message) {
  send({ jsonrpc: '2.0', id, error: { code: -32000, message } });
}

async function handleMessage(message) {
  const { id, method, params } = message;
  if (method === 'initialize') {
    reply(id, {
      protocolVersion: params?.protocolVersion || '2024-11-05',
      capabilities: { tools: {} },
      serverInfo: { name: 'dynasai-zaraz', version: '1.0.0' },
    });
    return;
  }
  if (method === 'notifications/initialized' || method === 'initialized') return;
  if (method === 'ping') {
    reply(id, {});
    return;
  }
  if (method === 'tools/list') {
    reply(id, { tools });
    return;
  }
  if (method === 'tools/call') {
    try {
      const result = await callTool(params.name, params.arguments || {});
      reply(id, { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] });
    } catch (error) {
      fail(id, error instanceof Error ? error.message : String(error));
    }
    return;
  }
  if (id !== undefined) fail(id, `Unsupported method: ${method}`);
}

async function cli() {
  const cmd = process.argv[2];
  try {
    if (cmd === '--status') {
      console.log(JSON.stringify(await callTool('zaraz_status'), null, 2));
      return;
    }
    if (cmd === '--skip-admin') {
      console.log(JSON.stringify(await callTool('zaraz_skip_admin_host'), null, 2));
      return;
    }
    console.error('Usage: node .cursor/zaraz-mcp.mjs --status | --skip-admin');
    process.exitCode = 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

if (process.argv[2]) {
  await cli();
} else {
  let buffer = Buffer.alloc(0);
  process.stdin.on('data', async (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
    while (true) {
      const headerEnd = buffer.indexOf('\r\n\r\n');
      if (headerEnd === -1) break;
      const header = buffer.subarray(0, headerEnd).toString('utf8');
      const match = header.match(/Content-Length:\s*(\d+)/i);
      if (!match) break;
      const length = Number(match[1]);
      const bodyStart = headerEnd + 4;
      if (buffer.length < bodyStart + length) break;
      const body = buffer.subarray(bodyStart, bodyStart + length).toString('utf8');
      buffer = buffer.subarray(bodyStart + length);
      try {
        await handleMessage(JSON.parse(body));
      } catch (error) {
        console.error(error instanceof Error ? error.message : error);
      }
    }
  });
}
