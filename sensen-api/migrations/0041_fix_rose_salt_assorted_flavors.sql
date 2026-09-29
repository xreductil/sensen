UPDATE products
SET metadata_json = json_set(
  COALESCE(NULLIF(metadata_json, ''), '{}'),
  '$.desc', '玫瑰鹽綜合蛋黃酥禮盒（9入），烏豆沙、芋頭、抹茶、棗泥任選三入。',
  '$.size', '9入',
  '$.spec', '9入；四選三',
  '$.variants.flavors', json_array('烏豆沙', '芋頭', '抹茶', '棗泥'),
  '$.variants.flavorCount', 3
),
updated_at = CURRENT_TIMESTAMP
WHERE slug = '玫瑰鹽綜合蛋黃酥禮盒';
