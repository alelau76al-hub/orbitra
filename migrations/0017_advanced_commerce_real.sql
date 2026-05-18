-- Advanced Commerce real implementation pass.
-- Non-destructive: creates optional tables and adds optional discount columns.

CREATE TABLE IF NOT EXISTS gift_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  initial_balance_cents INTEGER NOT NULL DEFAULT 0,
  balance_cents INTEGER NOT NULL DEFAULT 0,
  customer_email TEXT,
  expires_at TEXT,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_gift_cards_status ON gift_cards(status, active);
CREATE INDEX IF NOT EXISTS idx_gift_cards_customer_email ON gift_cards(customer_email);

CREATE TABLE IF NOT EXISTS store_credits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER,
  customer_email TEXT,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  remaining_amount_cents INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_store_credits_customer_id ON store_credits(customer_id);
CREATE INDEX IF NOT EXISTS idx_store_credits_customer_email ON store_credits(customer_email);
CREATE INDEX IF NOT EXISTS idx_store_credits_status ON store_credits(status, active);

CREATE TABLE IF NOT EXISTS store_credit_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_credit_id INTEGER NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'created',
  amount_cents INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_store_credit_events_credit_id ON store_credit_events(store_credit_id, created_at);

CREATE TABLE IF NOT EXISTS abandoned_carts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE,
  email TEXT,
  items_json TEXT NOT NULL DEFAULT '[]',
  total_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open',
  last_activity_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  recovered_order_id INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_abandoned_carts_status ON abandoned_carts(status, last_activity_at);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_email ON abandoned_carts(email);

CREATE TABLE IF NOT EXISTS seo_redirects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_path TEXT NOT NULL UNIQUE,
  to_path TEXT NOT NULL,
  status_code INTEGER NOT NULL DEFAULT 301,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_seo_redirects_active ON seo_redirects(active);

CREATE TABLE IF NOT EXISTS webhooks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event TEXT NOT NULL,
  target_url TEXT NOT NULL,
  secret_hash TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_webhooks_event ON webhooks(event, active);

CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  webhook_id INTEGER,
  event TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'mocked',
  response_status INTEGER,
  request_body TEXT,
  response_body TEXT,
  error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id, created_at);

CREATE TABLE IF NOT EXISTS supplier_feeds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  source_url TEXT,
  format TEXT NOT NULL DEFAULT 'json',
  active INTEGER NOT NULL DEFAULT 0,
  schedule TEXT NOT NULL DEFAULT 'manual',
  import_target TEXT NOT NULL DEFAULT 'products',
  last_run_at TEXT,
  last_status TEXT,
  last_message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_supplier_feeds_active ON supplier_feeds(active, schedule);

CREATE TABLE IF NOT EXISTS supplier_feed_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  feed_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'dry_run',
  records_found INTEGER NOT NULL DEFAULT 0,
  errors_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_supplier_feed_runs_feed_id ON supplier_feed_runs(feed_id, created_at);

CREATE TABLE IF NOT EXISTS subscription_products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL UNIQUE,
  frequency TEXT NOT NULL DEFAULT 'monthly',
  subscription_price_cents INTEGER NOT NULL DEFAULT 0,
  trial_days INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscription_products_active ON subscription_products(active);

ALTER TABLE discount_codes ADD COLUMN discount_kind TEXT DEFAULT 'standard';
ALTER TABLE discount_codes ADD COLUMN usage_limit INTEGER DEFAULT 0;
ALTER TABLE discount_codes ADD COLUMN usage_count INTEGER DEFAULT 0;
ALTER TABLE discount_codes ADD COLUMN customer_eligibility TEXT DEFAULT 'all';
ALTER TABLE discount_codes ADD COLUMN market_handle TEXT;
ALTER TABLE discount_codes ADD COLUMN currency_code TEXT;
ALTER TABLE discount_codes ADD COLUMN combinable INTEGER DEFAULT 0;
