CREATE TABLE IF NOT EXISTS translations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  locale TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id INTEGER NOT NULL DEFAULT 0,
  entity_key TEXT NOT NULL DEFAULT '',
  field_key TEXT NOT NULL,
  source_value TEXT DEFAULT '',
  translated_value TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(locale, entity_type, entity_id, entity_key, field_key)
);

CREATE INDEX IF NOT EXISTS idx_translations_locale_entity
ON translations (locale, entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_translations_entity_key
ON translations (entity_type, entity_key);

CREATE INDEX IF NOT EXISTS idx_translations_status
ON translations (status);
