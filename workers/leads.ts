export type LeadRow = {
  id: string;
  source: string;
  name: string;
  email: string;
  company: string;
  message: string;
  path: string;
  created_at: string;
};

const INDEX_KEY = 'leads:index';
const ROW_PREFIX = 'leads:row:';

function asLead(value: Partial<LeadRow> & { source: string; email: string }): LeadRow {
  return {
    id: value.id || crypto.randomUUID(),
    source: value.source,
    name: value.name || '',
    email: value.email,
    company: value.company || '',
    message: value.message || '',
    path: value.path || '',
    created_at: value.created_at || new Date().toISOString(),
  };
}

async function ensureD1(db: D1Database) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL,
      company TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL DEFAULT '',
      path TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at DESC)`),
  ]);
}

async function insertKv(env: Env, lead: LeadRow) {
  const raw = (await env.LEADS.get(INDEX_KEY)) || '[]';
  let ids: string[] = [];
  try {
    ids = JSON.parse(raw) as string[];
  } catch {
    ids = [];
  }
  ids = [lead.id, ...ids.filter((id) => id !== lead.id)].slice(0, 2000);
  await env.LEADS.put(`${ROW_PREFIX}${lead.id}`, JSON.stringify(lead));
  await env.LEADS.put(INDEX_KEY, JSON.stringify(ids));
}

export async function insertLead(
  env: Env,
  input: { source: string; name?: string; email: string; company?: string; message?: string; path?: string },
) {
  const lead = asLead(input);
  if (env.DB) {
    await ensureD1(env.DB);
    await env.DB.prepare(
      `INSERT INTO leads (id, source, name, email, company, message, path, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(lead.id, lead.source, lead.name, lead.email, lead.company, lead.message, lead.path, lead.created_at)
      .run();
    return lead;
  }
  await insertKv(env, lead);
  return lead;
}

export async function listLeads(env: Env, limit = 100): Promise<LeadRow[]> {
  if (env.DB) {
    await ensureD1(env.DB);
    const result = await env.DB.prepare(
      `SELECT id, source, name, email, company, message, path, created_at
       FROM leads ORDER BY created_at DESC LIMIT ?`,
    )
      .bind(limit)
      .all<LeadRow>();
    return result.results || [];
  }

  const raw = (await env.LEADS.get(INDEX_KEY)) || '[]';
  let ids: string[] = [];
  try {
    ids = JSON.parse(raw) as string[];
  } catch {
    ids = [];
  }
  const rows: LeadRow[] = [];
  for (const id of ids.slice(0, limit)) {
    const item = await env.LEADS.get(`${ROW_PREFIX}${id}`);
    if (!item) continue;
    try {
      rows.push(JSON.parse(item) as LeadRow);
    } catch {
      /* skip bad row */
    }
  }
  return rows;
}
