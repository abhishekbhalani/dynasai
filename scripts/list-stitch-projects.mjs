import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const mcp = JSON.parse(readFileSync(join(import.meta.dirname, '../.cursor/mcp.json'), 'utf8'));
const apiKey = mcp.mcpServers?.stitch?.env?.STITCH_API_KEY;

if (!apiKey) {
  console.error('STITCH_API_KEY not found in .cursor/mcp.json');
  process.exit(1);
}

async function mcpCall(method, params = {}) {
  const response = await fetch('https://stitch.googleapis.com/mcp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    }),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text.slice(0, 400)}`);
  }

  return JSON.parse(text);
}

const init = await mcpCall('initialize', {
  protocolVersion: '2024-11-05',
  capabilities: {},
  clientInfo: { name: 'dynasai-list', version: '1.0.0' },
});

if (init.error) {
  console.error('Initialize failed:', init.error.message ?? init.error);
  process.exit(1);
}

const result = await mcpCall('tools/call', {
  name: 'list_projects',
  arguments: {},
});

if (result.error) {
  console.error('list_projects failed:', result.error.message ?? result.error);
  process.exit(1);
}

const payload = JSON.parse(
  typeof result.result?.content?.[0]?.text === 'string'
    ? result.result.content[0].text
    : JSON.stringify(result.result ?? result),
);

const projects = payload.projects ?? [];
if (!projects.length) {
  console.log('No Stitch projects found.');
  process.exit(0);
}

console.log(`Found ${projects.length} project(s):\n`);
for (const project of projects) {
  const id = project.name?.replace('projects/', '') ?? 'unknown';
  console.log(`- ${project.title ?? '(untitled)'}`);
  console.log(`  ID: ${id}`);
  console.log(`  Type: ${project.projectType ?? 'n/a'} · Device: ${project.deviceType ?? 'n/a'}`);
  console.log(`  Updated: ${project.updateTime ?? project.createTime ?? 'n/a'}`);
  console.log('');
}
