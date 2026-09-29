-- Merge the three pineapple pastry gift products into the existing canonical
-- 土鳳梨酥禮盒 product and expose the package styles as image-backed options.
PRAGMA foreign_keys = ON;

UPDATE products
SET
  name = '土鳳梨酥禮盒（12入）',
  description = '土鳳梨酥禮盒（12入），鐵觀音土鳳梨酥、綜合土鳳梨酥或土鳳梨酥禮盒款式任選。',
  price = 360,
  stock = (
    SELECT COALESCE(SUM(stock), 0)
    FROM products
    WHERE slug IN ('souvenir-pineapple-cake', 'new-souvenir-image-02', 'new-souvenir-image-03', 'new-souvenir-image-04')
  ),
  image_key = 'images/S__294150148_0.webp',
  is_active = 1,
  metadata_json = json_object(
    'priceValue', 360,
    'price', '$360.00',
    'day', '5',
    'size', '12入',
    'spec', '12入；包裝款式可選',
    'img', '/assets/images/S__294150148_0.webp',
    'desc', '土鳳梨酥禮盒（12入），鐵觀音土鳳梨酥、綜合土鳳梨酥或土鳳梨酥禮盒款式任選。',
    'variants', json_object(
      'sizes', json_object('12入', 360),
      'flavors', json_array('鐵觀音土鳳梨酥（深藍包裝）', '綜合土鳳梨酥（黃銀、深藍包裝）', '土鳳梨酥禮盒（黃銀包裝）'),
      'flavorCount', 1,
      'flavorImages', json_object(
        '鐵觀音土鳳梨酥（深藍包裝）', '/images/S__294150148_0.webp',
        '綜合土鳳梨酥（黃銀、深藍包裝）', '/images/S__294150149_0.webp',
        '土鳳梨酥禮盒（黃銀包裝）', '/images/S__294150150_0.webp'
      )
    )
  ),
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'souvenir-pineapple-cake';

DELETE FROM product_images
WHERE product_id = (SELECT id FROM products WHERE slug = 'souvenir-pineapple-cake');

INSERT OR IGNORE INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, 'images/S__294150148_0.webp', 0, 1
FROM products
WHERE slug = 'souvenir-pineapple-cake';

UPDATE products
SET is_active = 0, updated_at = CURRENT_TIMESTAMP
WHERE slug IN ('new-souvenir-image-02', 'new-souvenir-image-03', 'new-souvenir-image-04');
