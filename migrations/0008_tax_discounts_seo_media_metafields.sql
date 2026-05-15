CREATE TABLE IF NOT EXISTS tax_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'text',
  label TEXT NOT NULL DEFAULT '',
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO tax_settings (
  key,
  value,
  type,
  label
)
VALUES
  ('vat_rate', '22', 'number', 'Aliquota IVA base'),
  ('prices_include_tax', '1', 'boolean', 'Prezzi IVA inclusa');

CREATE TABLE IF NOT EXISTS discount_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'percentage',
  value INTEGER NOT NULL DEFAULT 0,
  starts_at TEXT,
  ends_at TEXT,
  min_subtotal_cents INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'image',
  alt_text TEXT,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seo_metadata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS metafield_definitions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text',
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(entity_type, key)
);

CREATE TABLE IF NOT EXISTS metafield_values (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  definition_id INTEGER NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(definition_id, entity_type, entity_id),
  FOREIGN KEY(definition_id) REFERENCES metafield_definitions(id)
);

ALTER TABLE orders ADD COLUMN discount_code TEXT;
ALTER TABLE orders ADD COLUMN discount_cents INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN tax_cents INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN tax_rate REAL DEFAULT 0;
ALTER TABLE orders ADD COLUMN prices_include_tax INTEGER DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_discount_codes_code
ON discount_codes (code);

CREATE INDEX IF NOT EXISTS idx_discount_codes_active
ON discount_codes (active);

CREATE INDEX IF NOT EXISTS idx_media_items_active
ON media_items (active);

CREATE INDEX IF NOT EXISTS idx_seo_metadata_entity
ON seo_metadata (entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_metafield_definitions_entity
ON metafield_definitions (entity_type, active);

CREATE INDEX IF NOT EXISTS idx_metafield_values_entity
ON metafield_values (entity_type, entity_id);
