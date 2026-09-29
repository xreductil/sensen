-- Merge the five rose-salt egg-yolk pastry gift boxes into the canonical
-- assorted product with a select-three flavor option.
PRAGMA foreign_keys = ON;

UPDATE products
SET
  name = '玫瑰鹽綜合蛋黃酥禮盒',
  description = '玫瑰鹽綜合蛋黃酥禮盒（9入），烏豆沙、芋頭、抹茶、棗泥任選三入。',
  price = 675,
  stock = (
    SELECT COALESCE(SUM(stock), 0)
    FROM products
    WHERE slug IN (
      '玫瑰鹽綜合蛋黃酥禮盒',
      'rose-salt-red-bean-egg-yolk-gift',
      'rose-salt-taro-egg-yolk-gift',
      'rose-salt-matcha-egg-yolk-gift',
      'rose-salt-date-egg-yolk-gift'
    )
  ),
  image_key = 'images/S__294150156_0.webp',
  is_active = 1,
  metadata_json = json_object(
    'priceValue', 675,
    'price', '$675.00',
    'day', '5',
    'size', '9入',
    'spec', '9入；烏豆沙、芋頭、抹茶、棗泥任選三入',
    'img', '/assets/images/S__294150156_0.webp',
    'desc', '玫瑰鹽綜合蛋黃酥禮盒（9入），烏豆沙、芋頭、抹茶、棗泥任選三入。',
    'storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。',
    'other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。',
    'dietary', '蛋奶素',
    'variants', json_object(
      'sizes', json_object('9入', 675),
      'flavors', json_array('烏豆沙', '芋頭', '抹茶', '棗泥'),
      'flavorCount', 3
    )
  ),
  updated_at = CURRENT_TIMESTAMP
WHERE slug = '玫瑰鹽綜合蛋黃酥禮盒';

DELETE FROM product_images
WHERE product_id = (SELECT id FROM products WHERE slug = '玫瑰鹽綜合蛋黃酥禮盒');

INSERT OR IGNORE INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, 'images/S__294150156_0.webp', 0, 1
FROM products
WHERE slug = '玫瑰鹽綜合蛋黃酥禮盒';

UPDATE products
SET is_active = 0, updated_at = CURRENT_TIMESTAMP
WHERE slug IN (
  'rose-salt-red-bean-egg-yolk-gift',
  'rose-salt-taro-egg-yolk-gift',
  'rose-salt-matcha-egg-yolk-gift',
  'rose-salt-date-egg-yolk-gift'
);
