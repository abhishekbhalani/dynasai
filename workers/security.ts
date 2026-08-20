const HSTS = 'max-age=31536000; includeSubDomains; preload';

function nonce() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function csp(value: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${value}' https://challenges.cloudflare.com https://static.cloudflareinsights.com https://www.googletagmanager.com https://www.google-analytics.com https://www.gstatic.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com https://static.cloudflareinsights.com https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
    'frame-src https://challenges.cloudflare.com',
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
    "require-trusted-types-for 'script'",
    'trusted-types default',
  ].join('; ');
}

export function redirectHttpToHttps(request: Request) {
  const url = new URL(request.url);
  if (url.protocol !== 'http:') return null;
  url.protocol = 'https:';
  return new Response(null, {
    status: 301,
    headers: {
      location: url.toString(),
      'strict-transport-security': HSTS,
    },
  });
}

export async function applySecurityHeaders(res: Response) {
  const headers = new Headers(res.headers);
  const token = nonce();
  const type = headers.get('content-type') || '';

  headers.set('strict-transport-security', HSTS);
  headers.set('x-frame-options', 'DENY');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  headers.set('cross-origin-opener-policy', 'same-origin');
  headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');
  headers.set('content-security-policy', csp(token));

  if (!type.includes('text/html')) {
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
  }

  const html = await res.text();
  const next = html.replace(/<script(?![^>]*\bnonce=)/gi, `<script nonce="${token}"`);
  headers.delete('content-length');
  return new Response(next, { status: res.status, statusText: res.statusText, headers });
}
