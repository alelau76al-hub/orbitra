CREATE TABLE IF NOT EXISTS menus (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  handle TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  menu_id INTEGER NOT NULL,
  label TEXT NOT NULL,
  link_type TEXT NOT NULL DEFAULT 'url',
  target_slug TEXT,
  url TEXT,
  sort_order INTEGER DEFAULT 0,
  parent_id INTEGER,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (menu_id) REFERENCES menus(id)
);

INSERT OR IGNORE INTO menus (handle, name)
VALUES
  ('main', 'Menu principale'),
  ('footer', 'Menu footer');