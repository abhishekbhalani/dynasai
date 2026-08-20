const EMAIL_RE =
  /^[a-z0-9](?:[a-z0-9._%+-]{0,62}[a-z0-9])?@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

const RESERVED_TLDS = new Set(['test', 'invalid', 'localhost', 'example', 'local', 'onion', 'internal']);

const BLOCKED_DOMAINS = new Set([
  'example.com',
  'example.net',
  'example.org',
  'example.edu',
  'test.com',
  'test.org',
  'test.net',
  'localhost',
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamailblock.com',
  'sharklasers.com',
  'grr.la',
  'yopmail.com',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'throwawaymail.com',
  'trashmail.com',
  'fakeinbox.com',
  'getnada.com',
  'mailnesia.com',
  'dispostable.com',
  'moakt.com',
  'discard.email',
]);

const TYPO_DOMAINS: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'hotnail.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'outlook.con': 'outlook.com',
};

const TEST_LOCAL = /^(test|testing|tester|dummy|fake|sample|asdf|qwerty|foo|bar|xxx|noreply|no-?reply|donotreply)([._+-]?\d*)?$/i;

export type EmailCheck = { ok: true; email: string; domain: string } | { ok: false; error: string };

export function inspectEmail(raw: unknown): EmailCheck {
  const email = String(raw || '').trim().toLowerCase();
  if (!email) return { ok: false, error: 'Enter your email.' };
  if (email.length > 120 || email.includes('..') || email.startsWith('.') || email.includes('@.')) {
    return { ok: false, error: 'Enter a valid email address.' };
  }
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Enter a valid email address.' };

  const at = email.lastIndexOf('@');
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const tld = domain.split('.').pop() || '';

  if (RESERVED_TLDS.has(tld) || BLOCKED_DOMAINS.has(domain)) {
    return { ok: false, error: 'Use a real inbox we can reply to — test and disposable addresses are not accepted.' };
  }
  if (TEST_LOCAL.test(local)) {
    return { ok: false, error: 'Use your work email, not a test address.' };
  }
  const typo = TYPO_DOMAINS[domain];
  if (typo) {
    return { ok: false, error: `That domain looks mistyped. Did you mean ${typo}?` };
  }
  return { ok: true, email, domain };
}
