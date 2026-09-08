-- Restore dietary labels that were present on the original souvenir pages.
UPDATE products
SET metadata_json = json_set(
  COALESCE(NULLIF(metadata_json, ''), '{}'),
  '$.dietary', '奶蛋素',
  '$.dietaryImage', 'icon-vlml.png'
)
WHERE slug IN (
  'souvenir-pineapple-cake',
  'souvenir-egg-roll',
  'souvenir-daifuku',
  'souvenir-pork-floss',
  'souvenir-palmier',
  'souvenir-bean-tower',
  'souvenir-almond-layer',
  'souvenir-button-nougat',
  'souvenir-dacquoise'
);

UPDATE products
SET metadata_json = json_set(
  COALESCE(NULLIF(metadata_json, ''), '{}'),
  '$.dietary', '奶蛋素',
  '$.dietaryImage', 'icon-milk-vega.png'
)
WHERE slug = 'souvenir-butter-cake';
