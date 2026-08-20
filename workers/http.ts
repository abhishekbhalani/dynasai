export function json(data: unknown, status = 200, extra?: HeadersInit) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extra,
    },
  });
}

export function clientIp(request: Request) {
  return request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || 'unknown';
}

export function cookieValue(request: Request, name: string) {
  const raw = request.headers.get('cookie') || '';
  const match = raw.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : '';
}

export async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function originOk(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    const host = new URL(origin).hostname;
    return (
      host === 'dynasai.ai' ||
      host === 'www.dynasai.ai' ||
      host === 'admin.dynasai.ai' ||
      host.endsWith('.dynasai.pages.dev') ||
      host.endsWith('.workers.dev') ||
      host === 'localhost' ||
      host === '127.0.0.1'
    );
  } catch {
    return false;
  }
}

export function clip(value: unknown, max = 240) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
}

export function timingSafeEqual(a: string, b: string) {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  const len = Math.max(left.length, right.length);
  const x = new Uint8Array(len);
  const y = new Uint8Array(len);
  x.set(left);
  y.set(right);
  let diff = left.length === right.length ? 0 : 1;
  for (let i = 0; i < len; i += 1) diff |= x[i] ^ y[i];
  return diff === 0;
}
