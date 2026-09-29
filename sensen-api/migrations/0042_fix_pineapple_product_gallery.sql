UPDATE products
SET metadata_json = json_set(
  COALESCE(NULLIF(metadata_json, ''), '{}'),
  '$.desc', '土鳳梨酥禮盒（12入），可選鐵觀音土鳳梨酥、綜合土鳳梨酥或土鳳梨酥禮盒款式。',
  '$.size', '12入',
  '$.spec', '12入；包裝款式可選',
  '$.variants.flavors', json_array(
    '鐵觀音土鳳梨酥（深藍包裝）',
    '綜合土鳳梨酥（黃銀、深藍包裝）',
    '土鳳梨酥禮盒（黃銀包裝）'
  ),
  '$.variants.flavorCount', 1,
  '$.variants.flavorImages', json_object(
    '鐵觀音土鳳梨酥（深藍包裝）', '/images/S__294150148_0.webp',
    '綜合土鳳梨酥（黃銀、深藍包裝）', '/images/S__294150149_0.webp',
    '土鳳梨酥禮盒（黃銀包裝）', '/images/S__294150150_0.webp'
  )
),
updated_at = CURRENT_TIMESTAMP
WHERE slug = 'souvenir-pineapple-cake';

DELETE FROM product_images
WHERE product_id = (SELECT id FROM products WHERE slug = 'souvenir-pineapple-cake');

INSERT INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, 'images/S__294150148_0.webp', 0, 1
FROM products
WHERE slug = 'souvenir-pineapple-cake';

INSERT INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, 'images/S__294150149_0.webp', 1, 0
FROM products
WHERE slug = 'souvenir-pineapple-cake';

INSERT INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, 'images/S__294150150_0.webp', 2, 0
FROM products
WHERE slug = 'souvenir-pineapple-cake';
