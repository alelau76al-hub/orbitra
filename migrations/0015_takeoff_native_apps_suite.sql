-- TakeOff native apps suite: reviews, returns, upsells, product feeds.
-- Non-destructive migration. It only creates new optional tables.

CREATE TABLE IF NOT EXISTS product_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  customer_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  title TEXT,
  body TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_status ON product_reviews(status);

CREATE TABLE IF NOT EXISTS return_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER,
  customer_email TEXT NOT NULL DEFAULT '',
  reason TEXT,
  note TEXT,
  internal_note TEXT,
  refund_amount_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'requested',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_return_requests_order_id ON return_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_return_requests_status ON return_requests(status);

CREATE TABLE IF NOT EXISTS upsell_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL DEFAULT 'frequently_bought_together',
  name TEXT NOT NULL,
  base_product_id INTEGER,
  trigger_product_id INTEGER,
  target_product_ids TEXT NOT NULL DEFAULT '[]',
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  discount_value INTEGER NOT NULL DEFAULT 0,
  message TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_upsell_rules_type ON upsell_rules(type);
CREATE INDEX IF NOT EXISTS idx_upsell_rules_base_product_id ON upsell_rules(base_product_id);
CREATE INDEX IF NOT EXISTS idx_upsell_rules_trigger_product_id ON upsell_rules(trigger_product_id);

CREATE TABLE IF NOT EXISTS product_feed_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider TEXT NOT NULL UNIQUE,
  active INTEGER NOT NULL DEFAULT 0,
  title TEXT,
  default_currency TEXT NOT NULL DEFAULT 'EUR',
  default_language TEXT NOT NULL DEFAULT 'it',
  include_out_of_stock INTEGER NOT NULL DEFAULT 0,
  market_handle TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
