import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const mcp = JSON.parse(readFileSync(join(root, '.cursor/mcp.json'), 'utf8'));
const key = mcp.mcpServers.stitch.env.STITCH_API_KEY;

function send(proc, msg) {
  const body = JSON.stringify(msg);
  proc.stdin.write(`Content-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`);
}

const proc = spawn('node', [join(root, '.cursor/stitch-mcp-proxy.mjs')], {
  env: { ...process.env, STITCH_API_KEY: key },
  stdio: ['pipe', 'pipe', 'pipe'],
});

let out = '';
proc.stdout.on('data', (d) => {
  out += d.toString();
});
proc.stderr.on('data', (d) => process.stderr.write(d));

setTimeout(() => {
  send(proc, {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'diag', version: '1.0.0' },
    },
  });
  send(proc, { jsonrpc: '2.0', method: 'notifications/initialized', params: {} });
  send(proc, { jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} });
}, 3000);

setTimeout(() => {
  proc.kill();
  const names = [...out.matchAll(/"name"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
  if (names.length) {
    console.log('Tools:', names.join(', '));
    process.exit(0);
  }
  console.log('Raw output sample:', out.slice(0, 1200) || '(empty)');
  process.exit(1);
}, 25000);
