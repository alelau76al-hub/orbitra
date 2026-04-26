INSERT OR IGNORE INTO pages (slug, title)
VALUES ('home', 'Homepage');

INSERT INTO sections (page_slug, type, sort_order, data)
SELECT
  'home',
  'hero',
  0,
  '{"eyebrow":"Luxury Space Travel","title":"Compra il tuo posto tra le stelle","subtitle":"Viaggi spaziali privati, esperienze zero-g e missioni interplanetarie.","button_text":"Prenota una missione"}'
WHERE NOT EXISTS (
  SELECT 1 FROM sections WHERE page_slug = 'home' AND type = 'hero'
);