-- Ensure every ice-cream cake in the storefront catalog is present and active.
-- Existing rows keep their current names, prices, and metadata.
PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO categories (name, slug)
VALUES ('冰淇淋蛋糕', '冰淇淋蛋糕');

INSERT OR IGNORE INTO products
  (category_id, name, slug, description, price, stock, image_key, is_active, metadata_json)
VALUES
  ((SELECT id FROM categories WHERE name = '冰淇淋蛋糕' LIMIT 1), 'OREO', 'oreo-ice-cream', 'OREO 冰淇淋蛋糕。', 1080, 15, 'images/cake-2024-15.png', 1, '{"priceValue":1080,"day":"7","img":"/assets/images/cake-2024-15.png","desc":"OREO 冰淇淋蛋糕。","priceOptions":{"6吋":1080,"8吋":1580}}'),
  ((SELECT id FROM categories WHERE name = '冰淇淋蛋糕' LIMIT 1), '黃色小鴨', 'yellow-duck-ice-cream', '黃色小鴨冰淇淋蛋糕。', 1080, 15, 'images/cake-2024-14.png', 1, '{"priceValue":1080,"day":"7","img":"/assets/images/cake-2024-14.png","desc":"黃色小鴨冰淇淋蛋糕。","priceOptions":{"6吋":1080,"8吋":1580}}'),
  ((SELECT id FROM categories WHERE name = '冰淇淋蛋糕' LIMIT 1), '黑爵士', 'black-knight-ice-cream', '巧克力風味冰淇淋蛋糕。', 1080, 15, 'images/cake-2024-13.png', 1, '{"priceValue":1080,"day":"7","img":"/assets/images/cake-2024-13.png","desc":"巧克力風味冰淇淋蛋糕。","priceOptions":{"6吋":1080,"8吋":1580}}'),
  ((SELECT id FROM categories WHERE name = '冰淇淋蛋糕' LIMIT 1), '莓麗朵', 'berry-melody', '冰淇淋蛋糕商品。', 1080, 15, 'images/cake-2024-12.png', 1, '{"priceValue":1080,"day":"7","img":"/assets/images/cake-2024-12.png","desc":"冰淇淋蛋糕商品。","priceOptions":{"6吋":1080,"8吋":1580}}');

UPDATE products
SET is_active = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE slug IN ('oreo-ice-cream', 'yellow-duck-ice-cream', 'black-knight-ice-cream', 'berry-melody');

INSERT OR IGNORE INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, image_key, 0, 1
FROM products
WHERE slug IN ('oreo-ice-cream', 'yellow-duck-ice-cream', 'black-knight-ice-cream', 'berry-melody')
  AND image_key IS NOT NULL;
