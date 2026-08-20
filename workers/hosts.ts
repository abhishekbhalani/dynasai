export const DEFAULT_ADMIN_HOST = 'admin.dynasai.ai';

export function hostnameOf(request: Request) {
  return new URL(request.url).hostname;
}

export function isLocalHost(hostname: string) {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

export function adminHostName(env: { ADMIN_HOST?: string }) {
  return env.ADMIN_HOST || DEFAULT_ADMIN_HOST;
}

export function isAdminHost(hostname: string, env: { ADMIN_HOST?: string } = {}) {
  return hostname === adminHostName(env) || isLocalHost(hostname);
}

export function isPublicSiteHost(hostname: string) {
  return (
    hostname === 'dynasai.ai' ||
    hostname === 'www.dynasai.ai' ||
    hostname.endsWith('.workers.dev') ||
    hostname.endsWith('.pages.dev')
  );
}

export function originHostname(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return '';
  try {
    return new URL(origin).hostname;
  } catch {
    return '';
  }
}

export function isStaticAssetPath(path: string) {
  return (
    path.startsWith('/_astro/') ||
    path.startsWith('/img/') ||
    path === '/favicon.ico' ||
    path === '/robots.txt' ||
    path === '/sitemap-index.xml' ||
    /\.(?:css|js|mjs|svg|png|jpe?g|webp|gif|ico|woff2?|txt|xml|map)$/i.test(path)
  );
}
