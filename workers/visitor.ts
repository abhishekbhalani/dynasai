import { clip, clientIp } from './http';
import type { ContactEmailPayload } from './email-template';

export function pagesFrom(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => clip(item, 180)).filter(Boolean).slice(0, 24);
}

export function buildContactPayload(
  request: Request,
  body: Record<string, unknown>,
  fields: { name: string; email: string; company?: string; notes?: string; path?: string },
): ContactEmailPayload {
  const cf = request.cf;
  const lat = clip(cf?.latitude, 16);
  const lon = clip(cf?.longitude, 16);
  return {
    name: fields.name,
    email: fields.email,
    company: clip(fields.company, 120),
    job: clip(body.job, 80),
    industry: clip(body.industry, 80),
    cloud: clip(body.cloud, 80),
    residency: clip(body.residency, 80),
    start: clip(body.start, 80),
    recommendedService: clip(body.recommended_service, 160),
    recommendedCloud: clip(body.recommended_cloud, 160),
    notes: clip(fields.notes ?? body.notes, 800),
    path: clip(fields.path || body.path || '/contact', 180),
    ip: clientIp(request),
    country: clip(cf?.country, 8),
    region: clip(cf?.region, 80),
    city: clip(cf?.city, 80),
    postal: clip(cf?.postalCode, 24),
    continent: clip(cf?.continent, 8),
    timezone: clip(body.timezone || cf?.timezone, 64),
    colo: clip(cf?.colo, 8),
    isp: clip(cf?.asOrganization, 120),
    protocol: clip(cf?.httpProtocol, 24),
    tls: clip(cf?.tlsVersion, 24),
    coordinates: lat && lon ? `${lat}, ${lon}` : '',
    userAgent: clip(request.headers.get('user-agent'), 240),
    language: clip(body.language || request.headers.get('accept-language'), 80),
    viewport: clip(body.viewport, 32),
    landing: clip(body.landing, 240),
    referrer: clip(body.referrer, 240),
    sessionReferrer: clip(body.sessionReferrer, 240),
    pages: pagesFrom(body.pages),
    utmSource: clip(body.utmSource, 80),
    utmMedium: clip(body.utmMedium, 80),
    utmCampaign: clip(body.utmCampaign, 80),
  };
}
