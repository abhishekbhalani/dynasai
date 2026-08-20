import { isAdminHost } from './hosts';

const HSTS = 'max-age=31536000; includeSubDomains; preload';

function nonce() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function csp(value: string, trustedTypes: boolean) {
  const parts = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${value}' 'sha256-nY7wpcztm08/B9kiTvy4UjW/kLifE4nUB6x47pSLJuk=' 'sha256-CaFgxX+3fPpYPpeS3bHwFmQwlkA2XHxdpygPf1h8EbE=' 'sha256-WNIEwO2j3Fiu2W4B/I5p3WxFAZeXN4nygfjOr22MFAk=' 'sha256-hkom6IEhgpUDTTvAQes287GDHiTuSHGmsGoO3UoccAs=' 'sha256-7mUjU7gu/hHw0iipnmiZ2Xwb8pwtGoIx5ENf2+XABJk=' https://challenges.cloudflare.com https://static.cloudflareinsights.com https://www.googletagmanager.com https://www.google-analytics.com https://www.gstatic.com`,
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
  ];
  if (trustedTypes) {
    parts.push("require-trusted-types-for 'script'", 'trusted-types default');
  }
  return parts.join('; ');
}

function withScriptNonces(html: string, token: string) {
  return html.replace(/<script\b([^>]*)>/gi, (full, attrs: string) => {
    if (/\bnonce\s*=/i.test(attrs)) return full;
    if (/\btype\s*=\s*["']application\/(?:ld\+json|json)["']/i.test(attrs)) return full;
    return `<script nonce="${token}"${attrs}>`;
  });
}

function withTrustedTypesPolicy(html: string, token: string) {
  const policy = `<script nonce="${token}">(function(){if(window.trustedTypes&&trustedTypes.createPolicy){try{trustedTypes.createPolicy("default",{createHTML:function(v){return v},createScriptURL:function(v){return v},createScript:function(v){return v}})}catch(e){}}})();</script>`;
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (open) => `${open}${policy}`);
  }
  return policy + html;
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

function withNoTransform(headers: Headers) {
  // Stops Cloudflare JavaScript Detections injecting /cdn-cgi/challenge-platform/scripts/jsd/main.js
  // (deprecated Shared Storage / Protected Audience APIs that fail Lighthouse best-practices).
  const current = headers.get('cache-control') || '';
  if (/\bno-transform\b/i.test(current)) return;
  headers.set('cache-control', current ? `${current}, no-transform` : 'no-transform');
}

function isGzip(bytes: Uint8Array) {
  return bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
}

async function htmlFromResponse(res: Response) {
  let bytes = new Uint8Array(await res.arrayBuffer());
  for (let i = 0; i < 3 && isGzip(bytes); i += 1) {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    bytes = new Uint8Array(await new Response(stream).arrayBuffer());
  }
  return new TextDecoder('utf-8').decode(bytes);
}

export async function applySecurityHeaders(res: Response, request?: Request) {
  const headers = new Headers(res.headers);
  const token = nonce();
  const type = headers.get('content-type') || '';
  const admin = request ? isAdminHost(new URL(request.url).hostname) : false;

  headers.set('strict-transport-security', HSTS);
  headers.set('x-frame-options', 'DENY');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  headers.set('cross-origin-opener-policy', 'same-origin');
  headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');
  headers.set('content-security-policy', csp(token, admin));

  if (!type.includes('text/html')) {
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
  }

  let html = await htmlFromResponse(res);
  if (admin) html = withTrustedTypesPolicy(html, token);
  html = withScriptNonces(html, token);
  headers.delete('content-length');
  headers.delete('content-encoding');
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.append('vary', 'Accept-Encoding');
  return new Response(html, { status: res.status, statusText: res.statusText, headers });
}
