CREATE TABLE IF NOT EXISTS page_views (
  id TEXT PRIMARY KEY,
  ts INTEGER NOT NULL,
  hour TEXT NOT NULL,
  day TEXT NOT NULL,
  path TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT '',
  referrer TEXT NOT NULL DEFAULT '',
  visitor TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_page_views_ts ON page_views (ts);
CREATE INDEX IF NOT EXISTS idx_page_views_day ON page_views (day);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON page_views (visitor);
