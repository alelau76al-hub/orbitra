INSERT OR IGNORE INTO site_settings (key, value, group_name, type, label)
VALUES
  ('logo_width', '140', 'brand', 'text', 'Larghezza logo'),

  ('body_font_family', 'Inter', 'theme', 'select', 'Font testo'),
  ('heading_font_family', 'Inter', 'theme', 'select', 'Font titoli'),
  ('font_scale', 'standard', 'theme', 'select', 'Scala tipografica'),
  ('button_radius', 'pill', 'theme', 'select', 'Stile bottoni'),
  ('container_width', 'standard', 'theme', 'select', 'Larghezza contenitore'),
  ('section_spacing', 'standard', 'theme', 'select', 'Spaziatura sezioni'),

  ('header_style', 'standard', 'header', 'select', 'Stile header'),
  ('footer_layout', 'simple', 'footer', 'select', 'Layout footer');