-- Keep the souvenir pineapple cake box options aligned with the official product page.
UPDATE products SET metadata_json = json_set(COALESCE(metadata_json, '{}'),
  '$.size', '8入、12入', '$.spec', '8入、12入')
WHERE slug = 'souvenir-pineapple-cake';
