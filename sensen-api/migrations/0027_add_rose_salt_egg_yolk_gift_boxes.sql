-- Add the four 9-piece rose-salt egg-yolk pastry gift boxes to the live catalog.
PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO products (
  category_id, name, slug, description, price, stock, image_key, is_active, metadata_json
)
VALUES
  ((SELECT id FROM categories WHERE slug = '伴手禮'), '玫瑰鹽烏豆沙蛋黃酥禮盒（9入）', 'rose-salt-red-bean-egg-yolk-gift', '玫瑰鹽烏豆沙蛋黃酥禮盒，9入。', 675, 25, 'images/S__294150156_0.jpg', 1, '{"priceValue":675,"day":5,"size":"9入","img":"/assets/images/S__294150156_0.jpg","desc":"玫瑰鹽烏豆沙蛋黃酥禮盒，9入。","sku":"rose-salt-red-bean-egg-yolk-gift"}'),
  ((SELECT id FROM categories WHERE slug = '伴手禮'), '玫瑰鹽芋頭蛋黃酥禮盒（9入）', 'rose-salt-taro-egg-yolk-gift', '玫瑰鹽芋頭蛋黃酥禮盒，9入。', 675, 25, 'images/S__294150156_0.jpg', 1, '{"priceValue":675,"day":5,"size":"9入","img":"/assets/images/S__294150156_0.jpg","desc":"玫瑰鹽芋頭蛋黃酥禮盒，9入。","sku":"rose-salt-taro-egg-yolk-gift"}'),
  ((SELECT id FROM categories WHERE slug = '伴手禮'), '玫瑰鹽抹茶蛋黃酥禮盒（9入）', 'rose-salt-matcha-egg-yolk-gift', '玫瑰鹽抹茶蛋黃酥禮盒，9入。', 675, 25, 'images/S__294150156_0.jpg', 1, '{"priceValue":675,"day":5,"size":"9入","img":"/assets/images/S__294150156_0.jpg","desc":"玫瑰鹽抹茶蛋黃酥禮盒，9入。","sku":"rose-salt-matcha-egg-yolk-gift"}'),
  ((SELECT id FROM categories WHERE slug = '伴手禮'), '玫瑰鹽棗泥蛋黃酥禮盒（9入）', 'rose-salt-date-egg-yolk-gift', '玫瑰鹽棗泥蛋黃酥禮盒，9入。', 675, 25, 'images/S__294150156_0.jpg', 1, '{"priceValue":675,"day":5,"size":"9入","img":"/assets/images/S__294150156_0.jpg","desc":"玫瑰鹽棗泥蛋黃酥禮盒，9入。","sku":"rose-salt-date-egg-yolk-gift"}');

INSERT OR IGNORE INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, 'images/S__294150156_0.jpg', 0, 1
FROM products
WHERE slug IN (
  'rose-salt-red-bean-egg-yolk-gift',
  'rose-salt-taro-egg-yolk-gift',
  'rose-salt-matcha-egg-yolk-gift',
  'rose-salt-date-egg-yolk-gift'
);
