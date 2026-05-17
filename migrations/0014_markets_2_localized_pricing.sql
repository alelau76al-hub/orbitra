ALTER TABLE markets ADD COLUMN domain TEXT;
ALTER TABLE markets ADD COLUMN path_prefix TEXT;
ALTER TABLE markets ADD COLUMN notes TEXT;

CREATE TABLE IF NOT EXISTS market_languages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  locale TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  native_name TEXT,
  active INTEGER DEFAULT 1,
  is_default INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO market_languages (locale, name, native_name, active, is_default)
VALUES
  ('it', 'Italiano', 'Italiano', 1, 1),
  ('en', 'Inglese', 'English', 1, 0),
  ('fr', 'Francese', 'Français', 1, 0),
  ('es', 'Spagnolo', 'Español', 1, 0),
  ('de', 'Tedesco', 'Deutsch', 1, 0);

CREATE TABLE IF NOT EXISTS market_currencies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  symbol TEXT,
  active INTEGER DEFAULT 1,
  is_default INTEGER DEFAULT 0,
  manual_rate REAL DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO market_currencies (code, name, symbol, active, is_default, manual_rate)
VALUES
  ('EUR', 'Euro', '€', 1, 1, 1),
  ('USD', 'US Dollar', '$', 1, 0, 1),
  ('GBP', 'British Pound', '£', 1, 0, 1),
  ('CHF', 'Swiss Franc', 'CHF', 1, 0, 1),
  ('SEK', 'Swedish Krona', 'kr', 1, 0, 1);

CREATE TABLE IF NOT EXISTS market_countries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  country_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  market_handle TEXT,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO market_countries (country_code, name, market_handle, active)
VALUES
  ('IT', 'Italia', 'it-eur', 1),
  ('US', 'Stati Uniti', '', 1),
  ('GB', 'Regno Unito', '', 1),
  ('CH', 'Svizzera', '', 1),
  ('SE', 'Svezia', '', 1),
  ('FR', 'Francia', '', 1),
  ('ES', 'Spagna', '', 1),
  ('DE', 'Germania', '', 1);

CREATE TABLE IF NOT EXISTS localized_prices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  variant_id INTEGER NOT NULL DEFAULT 0,
  market_handle TEXT NOT NULL DEFAULT '',
  currency_code TEXT NOT NULL DEFAULT 'EUR',
  price_cents INTEGER NOT NULL,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, variant_id, market_handle, currency_code)
);

CREATE INDEX IF NOT EXISTS idx_localized_prices_product
ON localized_prices (product_id, variant_id, active);

CREATE INDEX IF NOT EXISTS idx_localized_prices_market
ON localized_prices (market_handle, currency_code, active);
