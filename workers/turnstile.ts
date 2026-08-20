import { clientIp } from './http';

const ACTION = 'admin-login';

export async function verifyTurnstile(request: Request, env: Env, token: unknown) {
  const secret = env.TURNSTILE_SECRET || '';
  if (!secret) return false;
  if (typeof token !== 'string' || token.length < 8 || token.length > 2048) return false;

  const allowed = new Set(
    env.ENVIRONMENT === 'production' ? ['admin.dynasai.ai'] : ['localhost', '127.0.0.1', 'admin.dynasai.ai'],
  );

  let result: { success?: boolean; action?: string; hostname?: string };
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: clientIp(request),
      }),
    });
    if (!res.ok) return false;
    result = (await res.json()) as { success?: boolean; action?: string; hostname?: string };
  } catch {
    return false;
  }

  if (!result.success) return false;
  if (env.ENVIRONMENT === 'production') {
    return result.action === ACTION && allowed.has(String(result.hostname || ''));
  }
  return true;
}
