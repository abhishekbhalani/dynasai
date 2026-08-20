import { inspectEmail } from '../shared/email-guard';

type DoH = { Status?: number; Answer?: { type: number; data: string }[] };

async function dnsJson(name: string, type: 'MX' | 'A' | 'AAAA'): Promise<DoH | null> {
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 2500);
  try {
    const res = await fetch(url, {
      headers: { accept: 'application/dns-json' },
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    return (await res.json()) as DoH;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function hasAnswer(result: DoH | null, recordType: number) {
  return Boolean(result?.Answer?.some((row) => row.type === recordType && row.data));
}

async function domainCanReceiveMail(env: Env, domain: string): Promise<boolean | null> {
  const key = `emailmx:${domain}`;
  const cached = await env.LEADS.get(key);
  if (cached === '1') return true;
  if (cached === '0') return false;

  const mx = await dnsJson(domain, 'MX');
  if (mx?.Status === 3) {
    await env.LEADS.put(key, '0', { expirationTtl: 6 * 60 * 60 });
    return false;
  }
  if (hasAnswer(mx, 15)) {
    await env.LEADS.put(key, '1', { expirationTtl: 24 * 60 * 60 });
    return true;
  }

  const a = await dnsJson(domain, 'A');
  const aaaa = await dnsJson(domain, 'AAAA');
  if (hasAnswer(a, 1) || hasAnswer(aaaa, 28)) {
    await env.LEADS.put(key, '1', { expirationTtl: 24 * 60 * 60 });
    return true;
  }
  if (mx === null && a === null && aaaa === null) return null;

  await env.LEADS.put(key, '0', { expirationTtl: 6 * 60 * 60 });
  return false;
}

export async function assertReplyEmail(env: Env, raw: unknown) {
  const check = inspectEmail(raw);
  if (!check.ok) return check;
  const mail = await domainCanReceiveMail(env, check.domain);
  if (mail === false) {
    return {
      ok: false as const,
      error: 'That domain cannot receive email. Check the spelling or use another address.',
    };
  }
  return check;
}
