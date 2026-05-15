CREATE TABLE IF NOT EXISTS policies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO policies (type, slug, title, content, status)
VALUES
  ('privacy_policy', 'privacy-policy', 'Privacy Policy', '', 'draft'),
  ('terms_conditions', 'terms-and-conditions', 'Termini e condizioni', '', 'draft'),
  ('refund_policy', 'refund-policy', 'Refund Policy', '', 'draft'),
  ('shipping_policy', 'shipping-policy', 'Shipping Policy', '', 'draft'),
  ('cookie_policy', 'cookie-policy', 'Cookie Policy', '', 'draft');

CREATE TABLE IF NOT EXISTS domains (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  domain TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'preview',
  status TEXT NOT NULL DEFAULT 'pending',
  dns_notes TEXT,
  is_primary INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tenants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  handle TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  is_default INTEGER DEFAULT 0,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO tenants (handle, name, status, is_default, notes)
VALUES ('default', 'Store default', 'active', 1, 'Tenant default per lo store attuale. Predisposizione multi-cliente senza isolamento dati obbligatorio.');

CREATE TABLE IF NOT EXISTS performance_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'text',
  label TEXT NOT NULL DEFAULT '',
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO performance_settings (key, value, type, label)
VALUES
  ('public_cache_seconds', '120', 'number', 'Cache API pubbliche read-only in secondi'),
  ('lazy_images', '1', 'boolean', 'Lazy loading immagini pubbliche'),
  ('fetch_timeout_ms', '8000', 'number', 'Timeout fetch pubbliche lato browser'),
  ('admin_checklist', 'cache_headers,lazy_images,fallbacks,build_verified', 'text', 'Checklist produzione MVP');

CREATE TABLE IF NOT EXISTS import_export_jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  summary TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_policies_status
ON policies (status, slug);

CREATE INDEX IF NOT EXISTS idx_domains_primary
ON domains (is_primary, status);

CREATE INDEX IF NOT EXISTS idx_tenants_default
ON tenants (is_default, status);

CREATE INDEX IF NOT EXISTS idx_import_export_jobs_created
ON import_export_jobs (created_at);
