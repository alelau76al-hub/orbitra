CREATE TABLE IF NOT EXISTS metaobject_definitions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  fields_json TEXT NOT NULL DEFAULT '[]',
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS metaobject_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  definition_id INTEGER NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  data_json TEXT NOT NULL DEFAULT '{}',
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(definition_id, slug),
  FOREIGN KEY(definition_id) REFERENCES metaobject_definitions(id)
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  author TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS markets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  handle TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT 'IT',
  language_code TEXT NOT NULL DEFAULT 'it',
  currency_code TEXT NOT NULL DEFAULT 'EUR',
  active INTEGER DEFAULT 1,
  is_default INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO markets (
  handle,
  name,
  country_code,
  language_code,
  currency_code,
  active,
  is_default
)
VALUES ('it-eur', 'Italia / EUR', 'IT', 'it', 'EUR', 1, 1);

CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  path TEXT,
  entity_type TEXT,
  entity_id TEXT,
  session_id TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  starts_at TEXT,
  ends_at TEXT,
  active INTEGER DEFAULT 1,
  discount_code TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS integrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'custom',
  active INTEGER DEFAULT 1,
  config_json TEXT NOT NULL DEFAULT '{}',
  webhook_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'viewer',
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  description TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notification_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subject TEXT,
  body TEXT,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notification_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  template_id INTEGER,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'mocked',
  description TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(template_id) REFERENCES notification_templates(id)
);

INSERT OR IGNORE INTO notification_templates (
  type,
  title,
  subject,
  body,
  active
)
VALUES
  ('order_created', 'Ordine creato', 'Ordine ricevuto', 'Grazie, il tuo ordine e stato ricevuto.', 1),
  ('payment_pending', 'Pagamento in attesa', 'Pagamento in attesa', 'Il pagamento risulta in attesa.', 1),
  ('customer_created', 'Cliente creato', 'Benvenuto', 'Il tuo profilo cliente e stato creato.', 1),
  ('generic', 'Notifica generica', 'Aggiornamento', 'Messaggio generico dal negozio.', 1);

CREATE INDEX IF NOT EXISTS idx_metaobject_entries_definition
ON metaobject_entries (definition_id, active);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status
ON blog_posts (status, created_at);

CREATE INDEX IF NOT EXISTS idx_markets_active
ON markets (active, is_default);

CREATE INDEX IF NOT EXISTS idx_analytics_events_type
ON analytics_events (event_type, created_at);

CREATE INDEX IF NOT EXISTS idx_activity_log_created
ON activity_log (created_at);
