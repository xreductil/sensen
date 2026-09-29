-- Merge the three 6-piece mung bean pastry boxes into one product with flavor options.
PRAGMA foreign_keys = ON;

UPDATE products
SET
  name = '綠豆椪禮盒（6入）',
  description = '綠豆椪禮盒（6入），可選純綠豆椪、蛋黃綠豆椪或綜合綠豆椪。',
  price = 450,
  stock = (
    SELECT COALESCE(SUM(stock), 0)
    FROM products
    WHERE slug IN ('new-souvenir-image-08', '蛋黃綠豆椪禮盒-mu5bhpph', '綜合綠豆椪禮盒')
  ),
  image_key = 'images/S__294150155_0.webp',
  is_active = 1,
  metadata_json = json_object(
    'priceValue', 450,
    'price', '$450.00',
    'day', '5',
    'size', '6入',
    'spec', '6入',
    'img', '/assets/images/S__294150155_0.webp',
    'desc', '綠豆椪禮盒（6入），可選純綠豆椪、蛋黃綠豆椪或綜合綠豆椪。',
    'storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。',
    'other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。',
    'variants', json_object(
      'sizes', json_object('6入', 450),
      'flavors', json_array('純綠豆椪', '蛋黃綠豆椪', '綜合綠豆椪'),
      'flavorCount', 1,
      'flavorPrices', json_object('純綠豆椪', 450, '蛋黃綠豆椪', 450, '綜合綠豆椪', 450)
    )
  ),
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'new-souvenir-image-08';

DELETE FROM product_images
WHERE product_id = (SELECT id FROM products WHERE slug = 'new-souvenir-image-08');

INSERT OR IGNORE INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, 'images/S__294150155_0.webp', 0, 1
FROM products
WHERE slug = 'new-souvenir-image-08';

UPDATE products
SET is_active = 0, updated_at = CURRENT_TIMESTAMP
WHERE slug IN ('蛋黃綠豆椪禮盒-mu5bhpph', '綜合綠豆椪禮盒');
