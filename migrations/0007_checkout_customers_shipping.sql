CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  shipping_address_line1 TEXT,
  shipping_address_city TEXT,
  shipping_address_postal_code TEXT,
  shipping_address_country TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE orders ADD COLUMN customer_id INTEGER;
ALTER TABLE orders ADD COLUMN customer_name TEXT;
ALTER TABLE orders ADD COLUMN phone TEXT;
ALTER TABLE orders ADD COLUMN subtotal_cents INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN shipping_cents INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN payment_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN payment_method TEXT DEFAULT 'manual';
ALTER TABLE orders ADD COLUMN order_status TEXT DEFAULT 'new';
ALTER TABLE orders ADD COLUMN shipping_method TEXT;
ALTER TABLE orders ADD COLUMN shipping_address_line1 TEXT;
ALTER TABLE orders ADD COLUMN shipping_address_city TEXT;
ALTER TABLE orders ADD COLUMN shipping_address_postal_code TEXT;
ALTER TABLE orders ADD COLUMN shipping_address_country TEXT;
ALTER TABLE orders ADD COLUMN updated_at TEXT;

ALTER TABLE order_items ADD COLUMN product_slug TEXT;
ALTER TABLE order_items ADD COLUMN product_name TEXT;
ALTER TABLE order_items ADD COLUMN variant_id INTEGER;
ALTER TABLE order_items ADD COLUMN variant_label TEXT;
ALTER TABLE order_items ADD COLUMN sku TEXT;

CREATE TABLE IF NOT EXISTS shipping_methods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  handle TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL DEFAULT 0,
  free_over_cents INTEGER,
  active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO shipping_methods (
  handle,
  name,
  description,
  price_cents,
  free_over_cents,
  active,
  sort_order
)
VALUES
  (
    'standard',
    'Spedizione standard',
    'Consegna standard non tracciata avanzata.',
    990,
    NULL,
    1,
    1
  ),
  (
    'free_over_100',
    'Spedizione gratuita',
    'Disponibile sopra 100 euro di prodotti.',
    0,
    10000,
    1,
    2
  );

CREATE INDEX IF NOT EXISTS idx_customers_email
ON customers (email);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id
ON orders (customer_id);

CREATE INDEX IF NOT EXISTS idx_orders_created_at
ON orders (created_at);

CREATE INDEX IF NOT EXISTS idx_shipping_methods_active
ON shipping_methods (active);
