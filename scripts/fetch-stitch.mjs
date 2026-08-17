import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PROJECT_ID = process.argv[2] ?? '14396955921656150216';
const SCREEN_ID = process.argv[3] ?? '';

const mcp = JSON.parse(readFileSync(join(import.meta.dirname, '../.cursor/mcp.json'), 'utf8'));
const apiKey = mcp.mcpServers?.stitch?.env?.STITCH_API_KEY;

async function mcpCall(method, params = {}) {
  const response = await fetch('https://stitch.googleapis.com/mcp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${text.slice(0, 400)}`);
  return JSON.parse(text);
}

function parseToolResult(result) {
  const raw = result.result?.content?.[0]?.text;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return result.result ?? result;
}

async function callTool(name, arguments_) {
  const result = await mcpCall('tools/call', { name, arguments: arguments_ });
  if (result.error) throw new Error(result.error.message ?? JSON.stringify(result.error));
  return parseToolResult(result);
}

await mcpCall('initialize', {
  protocolVersion: '2024-11-05',
  capabilities: {},
  clientInfo: { name: 'dynasai-fetch', version: '1.0.0' },
});

const outDir = join(import.meta.dirname, '../.stitch');
mkdirSync(outDir, { recursive: true });

if (!SCREEN_ID) {
  const data = await callTool('list_screens', { projectId: PROJECT_ID });
  writeFileSync(join(outDir, 'screens.json'), JSON.stringify(data, null, 2));
  const screens = data.screens ?? [];
  console.log(`Screens in project ${PROJECT_ID}:\n`);
  for (const screen of screens) {
    const id = screen.name?.split('/').pop() ?? screen.name;
    console.log(`- ${screen.title ?? '(untitled)'}`);
    console.log(`  ID: ${id}`);
    console.log(`  Device: ${screen.deviceType ?? 'n/a'}`);
    console.log('');
  }
  process.exit(0);
}

const screen = await callTool('get_screen', { projectId: PROJECT_ID, screenId: SCREEN_ID });
writeFileSync(join(outDir, `${SCREEN_ID}.json`), JSON.stringify(screen, null, 2));

const htmlEntry = screen.htmlCode ?? screen.html ?? screen.source?.html;
if (typeof htmlEntry === 'string') {
  writeFileSync(join(outDir, `${SCREEN_ID}.html`), htmlEntry);
  console.log(`Saved HTML (${htmlEntry.length} chars)`);
} else if (htmlEntry?.downloadUrl) {
  const htmlRes = await fetch(htmlEntry.downloadUrl);
  const html = await htmlRes.text();
  writeFileSync(join(outDir, `${SCREEN_ID}.html`), html);
  console.log(`Downloaded HTML (${html.length} chars)`);
}

console.log(JSON.stringify({
  title: screen.title,
  deviceType: screen.deviceType,
  theme: screen.designTheme ?? screen.theme,
}, null, 2));
