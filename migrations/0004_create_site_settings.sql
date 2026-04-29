CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  group_name TEXT NOT NULL DEFAULT 'general',
  type TEXT NOT NULL DEFAULT 'text',
  label TEXT NOT NULL DEFAULT '',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO site_settings (key, value, group_name, type, label)
VALUES
  ('site_name', 'Orbitra', 'brand', 'text', 'Nome sito'),
  ('logo_text', 'ORBITRA', 'brand', 'text', 'Testo logo'),
  ('logo_url', '', 'brand', 'url', 'URL logo immagine'),

  ('primary_color', '#00f5ff', 'theme', 'color', 'Colore principale'),
  ('accent_color', '#52ff9f', 'theme', 'color', 'Colore accento'),
  ('background_color', '#030307', 'theme', 'color', 'Colore sfondo'),
  ('text_color', '#ffffff', 'theme', 'color', 'Colore testo'),

  ('font_family', 'Inter', 'theme', 'text', 'Font principale'),

  ('header_cta_text', 'Launch Pass', 'header', 'text', 'Testo bottone header'),
  ('header_cta_url', '#booking', 'header', 'text', 'Link bottone header'),

  ('footer_text', 'ORBITRA © 2026 — Space travel for the impossible generation.', 'footer', 'text', 'Testo footer'),
  ('footer_cta_text', 'Request launch access', 'footer', 'text', 'Testo link footer'),
  ('footer_cta_url', '#booking', 'footer', 'text', 'Link footer'),

  ('instagram_url', '', 'social', 'url', 'Instagram URL'),
  ('linkedin_url', '', 'social', 'url', 'LinkedIn URL'),
  ('youtube_url', '', 'social', 'url', 'YouTube URL'),

  ('contact_email', '', 'general', 'email', 'Email contatto');