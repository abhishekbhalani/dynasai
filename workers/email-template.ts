const LOGO = 'https://dynasai.ai/img/colored-logo.svg';
const SITE = 'https://dynasai.ai';

function esc(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function row(label: string, value: unknown) {
  const text = String(value ?? '').trim();
  if (!text) return '';
  return rowHtml(label, esc(text));
}

function rowHtml(label: string, html: string) {
  if (!html.trim()) return '';
  return `<tr>
    <td style="padding:8px 0;width:160px;color:#4b5563;font-size:13px;vertical-align:top;">${esc(label)}</td>
    <td style="padding:8px 0;color:#0b1f3a;font-size:14px;font-weight:600;">${html}</td>
  </tr>`;
}

export type ContactEmailPayload = {
  name: string;
  email: string;
  company: string;
  job: string;
  industry: string;
  cloud: string;
  residency: string;
  start: string;
  recommendedService: string;
  recommendedCloud: string;
  notes: string;
  path: string;
  ip: string;
  country: string;
  region: string;
  city: string;
  postal: string;
  continent: string;
  timezone: string;
  colo: string;
  isp: string;
  protocol: string;
  tls: string;
  coordinates: string;
  userAgent: string;
  language: string;
  viewport: string;
  landing: string;
  referrer: string;
  sessionReferrer: string;
  pages: string[];
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
};

export function contactEmailHtml(data: ContactEmailPayload) {
  const pages = data.pages.length
    ? data.pages.map((p, i) => `${i + 1}. ${esc(p)}`).join('<br>')
    : '';
  const location = [data.city, data.region, data.country].filter(Boolean).join(', ');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f8fc;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f8fc;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="padding:24px 28px;background:#0b1f3a;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#ffffff;border-radius:8px;padding:8px 12px;">
                  <img src="${LOGO}" alt="DynasAI" width="148" style="display:block;border:0;max-width:148px;height:auto;">
                </td>
                <td style="padding-left:14px;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.02em;">DynasAI</td>
              </tr>
            </table>
            <p style="margin:16px 0 0;color:#d9e3f7;font-size:13px;">New contact enquiry</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px;">
            <p style="margin:0 0 16px;color:#0b1f3a;font-size:16px;">${esc(data.name)} submitted the contact form.</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${row('Name', data.name)}
              ${row('Email', data.email)}
              ${row('Company', data.company)}
              ${row('Page submitted', data.path)}
              ${row('What AI should do', data.job)}
              ${row('Industry', data.industry)}
              ${row('Cloud today', data.cloud)}
              ${row('Data residency', data.residency)}
              ${row('How to start', data.start)}
              ${row('Recommended service', data.recommendedService)}
              ${row('Recommended cloud', data.recommendedCloud)}
              ${row('Notes', data.notes)}
            </table>
            <p style="margin:24px 0 8px;color:#2563eb;font-size:13px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">Location &amp; network</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${row('Location', location)}
              ${row('City', data.city)}
              ${row('Region', data.region)}
              ${row('Country', data.country)}
              ${row('Postal', data.postal)}
              ${row('Continent', data.continent)}
              ${row('Timezone', data.timezone)}
              ${row('IP', data.ip)}
              ${row('Coordinates', data.coordinates)}
              ${row('ISP / ASN', data.isp)}
              ${row('Cloudflare colo', data.colo)}
              ${row('Protocol', data.protocol)}
              ${row('TLS', data.tls)}
            </table>
            <p style="margin:24px 0 8px;color:#2563eb;font-size:13px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">How they arrived</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${row('Landing page', data.landing)}
              ${row('HTTP referrer', data.referrer)}
              ${row('First-touch referrer', data.sessionReferrer)}
              ${row('UTM source', data.utmSource)}
              ${row('UTM medium', data.utmMedium)}
              ${row('UTM campaign', data.utmCampaign)}
              ${rowHtml('Pages in this session', pages)}
            </table>
            <p style="margin:24px 0 8px;color:#2563eb;font-size:13px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">Browser</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${row('User agent', data.userAgent)}
              ${row('Language', data.language)}
              ${row('Viewport', data.viewport)}
            </table>
            <p style="margin:28px 0 0;font-size:12px;color:#4b5563;">Reply to this email to reach ${esc(data.email)}. <a href="${SITE}" style="color:#2563eb;">dynasai.ai</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function contactEmailText(data: ContactEmailPayload) {
  const location = [data.city, data.region, data.country].filter(Boolean).join(', ');
  return [
    `New contact enquiry from ${data.name}`,
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Company: ${data.company || '—'}`,
    `Page: ${data.path}`,
    `Job: ${data.job || '—'}`,
    `Industry: ${data.industry || '—'}`,
    `Cloud: ${data.cloud || '—'}`,
    `Residency: ${data.residency || '—'}`,
    `Start: ${data.start || '—'}`,
    `Recommended service: ${data.recommendedService || '—'}`,
    `Recommended cloud: ${data.recommendedCloud || '—'}`,
    `Notes: ${data.notes || '—'}`,
    '',
    `Location: ${location || '—'}`,
    `IP: ${data.ip}`,
    `Coordinates: ${data.coordinates || '—'}`,
    `ISP: ${data.isp || '—'}`,
    `Timezone: ${data.timezone || '—'}`,
    `Landing: ${data.landing || '—'}`,
    `Referrer: ${data.referrer || data.sessionReferrer || '—'}`,
    `UTM: ${[data.utmSource, data.utmMedium, data.utmCampaign].filter(Boolean).join(' / ') || '—'}`,
    `Pages: ${(data.pages || []).join(' → ') || '—'}`,
    `UA: ${data.userAgent || '—'}`,
  ].join('\n');
}
