-- Restore the dietary label that was present on the original static product page.
UPDATE products
SET metadata_json = json_set(
  COALESCE(NULLIF(metadata_json, ''), '{}'),
  '$.dietary', '奶蛋素',
  '$.dietaryImage', 'icon-vlml.png'
)
WHERE slug = 'souvenir-almond-layer';
