import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PROJECT_ID = '14396955921656150216';
const mcp = JSON.parse(readFileSync(join(import.meta.dirname, '../.cursor/mcp.json'), 'utf8'));
const apiKey = mcp.mcpServers?.stitch?.env?.STITCH_API_KEY;
const outDir = join(import.meta.dirname, '../.stitch');

async function mcpCall(method, params = {}) {
  const response = await fetch('https://stitch.googleapis.com/mcp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': apiKey },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

function parseToolResult(result) {
  const raw = result.result?.content?.[0]?.text;
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return raw; }
  }
  return result.result ?? result;
}

async function callTool(name, arguments_) {
  const result = await mcpCall('tools/call', { name, arguments: arguments_ });
  if (result.error) throw new Error(result.error.message ?? JSON.stringify(result.error));
  return parseToolResult(result);
}

mkdirSync(outDir, { recursive: true });

await mcpCall('initialize', {
  protocolVersion: '2024-11-05',
  capabilities: {},
  clientInfo: { name: 'dynasai-fetch-all', version: '1.0.0' },
});

const list = await callTool('list_screens', { projectId: PROJECT_ID });
writeFileSync(join(outDir, 'screens.json'), JSON.stringify(list, null, 2));

const screens = list.screens ?? [];
const manifest = [];

for (const screen of screens) {
  const id = screen.name?.split('/').pop();
  if (!id || !screen.htmlCode?.downloadUrl) continue;

  try {
    const detail = await callTool('get_screen', { projectId: PROJECT_ID, screenId: id });
    writeFileSync(join(outDir, `${id}.json`), JSON.stringify(detail, null, 2));

    let html = '';
    if (detail.htmlCode?.downloadUrl) {
      const res = await fetch(detail.htmlCode.downloadUrl);
      html = await res.text();
      writeFileSync(join(outDir, `${id}.html`), html);
    }

    manifest.push({
      id,
      title: detail.title ?? screen.title,
      slug: id,
      htmlLength: html.length,
    });
    console.log(`✓ ${detail.title ?? screen.title}`);
  } catch (error) {
    console.log(`✗ ${screen.title}: ${error.message}`);
  }
}

writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`\nFetched ${manifest.length} screens.`);
