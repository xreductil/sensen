-- Add the four-choice / select-three flavor options to the online-only assorted egg yolk gift box.
UPDATE products
SET metadata_json = json_set(
  COALESCE(NULLIF(metadata_json, ''), '{}'),
  '$.variants.flavors', json('["烏豆沙","芋頭","抹茶","棗泥"]'),
  '$.variants.flavorCount', 3
)
WHERE name = '玫瑰鹽綜合蛋黃酥禮盒';
