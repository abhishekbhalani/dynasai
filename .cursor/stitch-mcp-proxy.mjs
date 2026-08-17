/**
 * Stdio proxy for Google Stitch MCP.
 * Cursor drops tools/list when outputSchema is huge; strip it so tools register.
 */
import { spawn } from 'node:child_process';
import { Transform } from 'node:stream';

function stripToolSchemas() {
  let buffer = Buffer.alloc(0);

  return new Transform({
    transform(chunk, _enc, cb) {
      buffer = Buffer.concat([buffer, chunk]);

      while (true) {
        const headerEnd = buffer.indexOf('\r\n\r\n');
        if (headerEnd === -1) {
          break;
        }

        const header = buffer.subarray(0, headerEnd).toString('utf8');
        const match = header.match(/Content-Length:\s*(\d+)/i);
        if (!match) {
          break;
        }

        const length = Number(match[1], 10);
        const bodyStart = headerEnd + 4;
        if (buffer.length < bodyStart + length) {
          break;
        }

        let body = buffer.subarray(bodyStart, bodyStart + length).toString('utf8');
        buffer = buffer.subarray(bodyStart + length);

        try {
          const message = JSON.parse(body);
          const tools = message?.result?.tools;
          if (Array.isArray(tools)) {
            for (const tool of tools) {
              delete tool.outputSchema;
            }
            body = JSON.stringify(message);
          }
        } catch {
          // keep original body
        }

        const payload = Buffer.from(body, 'utf8');
        this.push(Buffer.concat([
          Buffer.from(`Content-Length: ${payload.length}\r\n\r\n`, 'utf8'),
          payload,
        ]));
      }

      cb();
    },
  });
}

const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const useShell = process.platform === 'win32';

const child = spawn(npxCmd, ['-y', 'stitch-mcp-stdio'], {
  env: {
    ...process.env,
    STITCH_API_KEY: process.env.STITCH_API_KEY ?? '',
  },
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: useShell,
  windowsHide: true,
});

child.on('error', (error) => {
  console.error('[stitch-mcp-proxy] Failed to start stitch-mcp-stdio:', error.message);
  process.exit(1);
});

process.stdin.pipe(child.stdin);
child.stdout.pipe(stripToolSchemas()).pipe(process.stdout);
child.stderr.pipe(process.stderr);

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
