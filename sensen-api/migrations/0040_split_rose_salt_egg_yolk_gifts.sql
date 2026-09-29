-- Split rose-salt egg-yolk gift boxes into a single-flavor product and a
-- separate assorted product. The old individual URLs are redirected by the
-- static site to the new single-flavor card.
PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO products (
  category_id, name, slug, description, price, stock, image_key, is_active, metadata_json
)
VALUES (
  (SELECT id FROM categories WHERE slug = '伴手禮' LIMIT 1),
  '玫瑰鹽蛋黃酥禮盒（9入）',
  'rose-salt-egg-yolk-gift',
  '玫瑰鹽蛋黃酥禮盒（9入），可選烏豆沙、芋頭、抹茶或棗泥其中一種口味。',
  675,
  120,
  'images/S__294150156_0.webp',
  1,
  json_object(
    'priceValue', 675,
    'price', '$675.00',
    'day', '5',
    'size', '9入',
    'spec', '9入；四選一',
    'img', '/assets/images/S__294150156_0.webp',
    'desc', '玫瑰鹽蛋黃酥禮盒（9入），可選烏豆沙、芋頭、抹茶或棗泥其中一種口味。',
    'dietary', '蛋奶素',
    'variants', json_object(
      'sizes', json_object('9入', 675),
      'flavors', json_array('烏豆沙', '芋頭', '抹茶', '棗泥'),
      'flavorCount', 1,
      'flavorPrices', json_object('烏豆沙', 675, '芋頭', 675, '抹茶', 675, '棗泥', 675)
    )
  )
);

UPDATE products
SET
  name = '玫瑰鹽蛋黃酥禮盒（9入）',
  description = '玫瑰鹽蛋黃酥禮盒（9入），可選烏豆沙、芋頭、抹茶或棗泥其中一種口味。',
  price = 675,
  stock = 120,
  image_key = 'images/S__294150156_0.webp',
  is_active = 1,
  metadata_json = json_object(
    'priceValue', 675,
    'price', '$675.00',
    'day', '5',
    'size', '9入',
    'spec', '9入；四選一',
    'img', '/assets/images/S__294150156_0.webp',
    'desc', '玫瑰鹽蛋黃酥禮盒（9入），可選烏豆沙、芋頭、抹茶或棗泥其中一種口味。',
    'dietary', '蛋奶素',
    'variants', json_object(
      'sizes', json_object('9入', 675),
      'flavors', json_array('烏豆沙', '芋頭', '抹茶', '棗泥'),
      'flavorCount', 1,
      'flavorPrices', json_object('烏豆沙', 675, '芋頭', 675, '抹茶', 675, '棗泥', 675)
    )
  ),
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'rose-salt-egg-yolk-gift';

INSERT OR IGNORE INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, 'images/S__294150156_0.webp', 0, 1
FROM products
WHERE slug = 'rose-salt-egg-yolk-gift';

UPDATE products
SET
  name = '玫瑰鹽綜合蛋黃酥禮盒（9入）',
  description = '玫瑰鹽綜合蛋黃酥禮盒（9入），烏豆沙、芋頭、抹茶、棗泥任選三入。',
  metadata_json = json_set(
    COALESCE(NULLIF(metadata_json, ''), '{}'),
    '$.desc', '玫瑰鹽綜合蛋黃酥禮盒（9入），烏豆沙、芋頭、抹茶、棗泥任選三入。',
    '$.size', '9入',
    '$.spec', '9入；四選三',
    '$.variants.flavorCount', 3
  ),
  updated_at = CURRENT_TIMESTAMP
WHERE slug = '玫瑰鹽綜合蛋黃酥禮盒';
