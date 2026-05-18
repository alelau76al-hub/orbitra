-- TakeOff Operations Suite: order operations, fulfillment, customer account metadata.
-- Non-destructive migration. Adds optional columns and supporting timeline tables.

ALTER TABLE orders ADD COLUMN fulfillment_status TEXT DEFAULT 'unfulfilled';
ALTER TABLE orders ADD COLUMN tracking_number TEXT;
ALTER TABLE orders ADD COLUMN tracking_carrier TEXT;
ALTER TABLE orders ADD COLUMN tracking_url TEXT;
ALTER TABLE orders ADD COLUMN fulfilled_at TEXT;
ALTER TABLE orders ADD COLUMN shipping_note TEXT;
ALTER TABLE orders ADD COLUMN internal_note TEXT;
ALTER TABLE orders ADD COLUMN refund_status TEXT DEFAULT 'none';
ALTER TABLE orders ADD COLUMN refund_amount_cents INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN refund_note TEXT;

ALTER TABLE customers ADD COLUMN account_status TEXT DEFAULT 'guest';
ALTER TABLE customers ADD COLUMN tags TEXT;
ALTER TABLE customers ADD COLUMN note TEXT;
ALTER TABLE customers ADD COLUMN last_invite_at TEXT;

CREATE TABLE IF NOT EXISTS order_timeline (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_order_timeline_order_id
ON order_timeline (order_id, created_at);

CREATE TABLE IF NOT EXISTS fulfillment_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'fulfilled',
  carrier TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  shipping_note TEXT,
  fulfilled_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_fulfillment_records_order_id
ON fulfillment_records (order_id, created_at);
