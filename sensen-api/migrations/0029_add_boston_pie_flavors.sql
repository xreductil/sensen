-- Add the selectable flavors for the Boston pie gift box.
UPDATE products
SET metadata_json = json_set(
  COALESCE(NULLIF(metadata_json, ''), '{}'),
  '$.variants',
  json('{"flavors":["草莓","藍莓","香草"],"sizes":{"單杯":300}}'),
  '$.desc',
  '9吋波士頓派禮盒，可選草莓、藍莓或香草口味。'
),
updated_at = CURRENT_TIMESTAMP
WHERE slug = 'top-house-boston-new';
