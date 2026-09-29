-- Merge the duplicate classic butter cake gift-box product into the canonical
-- 太陽餅禮盒 route and keep both product images in its gallery.
PRAGMA foreign_keys = ON;

UPDATE products
SET
  name = '經典奶油餅禮盒',
  description = '採用麥芽、手工自製的傳統口味，香、酥、多層次的餅皮搭配甜而不膩的內餡。',
  price = 380,
  stock = (
    SELECT COALESCE(SUM(stock), 0)
    FROM products
    WHERE slug IN ('souvenir-butter-cake', 'new-souvenir-image-05')
  ),
  image_key = 'images/sun-cake-thumbnail-copy.webp',
  is_active = 1,
  metadata_json = json_object(
    'priceValue', 380,
    'price', '$380.00',
    'day', '5',
    'size', '規格：10入',
    'spec', '規格：10入',
    'img', '/assets/images/sun-cake-thumbnail-copy.webp',
    'desc', '採用麥芽、手工自製的傳統口味，香、酥、多層次的餅皮搭配甜而不膩的內餡。',
    'storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。',
    'other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。',
    'likes', 6,
    'dietary', '奶蛋素',
    'dietaryImage', 'icon-milk-vega.png'
  ),
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'souvenir-butter-cake';

DELETE FROM product_images
WHERE product_id = (SELECT id FROM products WHERE slug = 'souvenir-butter-cake');

INSERT OR IGNORE INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, 'images/sun-cake-thumbnail-copy.webp', 0, 1
FROM products
WHERE slug = 'souvenir-butter-cake';

INSERT OR IGNORE INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, 'images/S__294150152_0.webp', 1, 0
FROM products
WHERE slug = 'souvenir-butter-cake';

UPDATE products
SET is_active = 0, updated_at = CURRENT_TIMESTAMP
WHERE slug = 'new-souvenir-image-05';
