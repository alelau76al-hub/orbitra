ALTER TABLE orders ADD COLUMN payment_provider TEXT DEFAULT 'manual';
ALTER TABLE orders ADD COLUMN provider_reference TEXT;
ALTER TABLE orders ADD COLUMN payment_intent_id TEXT;
ALTER TABLE orders ADD COLUMN checkout_id TEXT;
ALTER TABLE orders ADD COLUMN idempotency_key TEXT;
ALTER TABLE orders ADD COLUMN currency TEXT DEFAULT 'EUR';
ALTER TABLE orders ADD COLUMN terms_accepted_at TEXT;
ALTER TABLE orders ADD COLUMN privacy_accepted_at TEXT;

ALTER TABLE media_items ADD COLUMN size INTEGER DEFAULT 0;
ALTER TABLE media_items ADD COLUMN mime_type TEXT;
ALTER TABLE media_items ADD COLUMN storage_provider TEXT DEFAULT 'url';
ALTER TABLE media_items ADD COLUMN storage_key TEXT;

CREATE TABLE IF NOT EXISTS payment_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider TEXT NOT NULL DEFAULT 'stripe',
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL DEFAULT '',
  order_id INTEGER,
  status TEXT NOT NULL DEFAULT 'received',
  payload_digest TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_idempotency_key
ON orders (idempotency_key);

CREATE INDEX IF NOT EXISTS idx_orders_payment_provider
ON orders (payment_provider, payment_status);

CREATE INDEX IF NOT EXISTS idx_orders_provider_reference
ON orders (provider_reference);

CREATE INDEX IF NOT EXISTS idx_media_items_storage_provider
ON media_items (storage_provider);

CREATE INDEX IF NOT EXISTS idx_payment_events_order_id
ON payment_events (order_id);

INSERT OR IGNORE INTO site_settings (key, value, group_name, type, label)
VALUES
  ('payment_provider', 'manual', 'payments', 'select', 'Provider pagamento'),
  ('stripe_enabled', '0', 'payments', 'boolean', 'Stripe abilitato'),
  ('stripe_mode', 'test', 'payments', 'select', 'Modalita Stripe'),
  ('stripe_public_key', '', 'payments', 'text', 'Stripe publishable key');
