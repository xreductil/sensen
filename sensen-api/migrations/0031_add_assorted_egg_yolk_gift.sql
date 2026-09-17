-- Add the assorted rose-salt egg-yolk pastry gift box.
INSERT OR IGNORE INTO products
  (category_id, name, slug, description, price, stock, image_key, is_active, metadata_json)
VALUES
  ((SELECT id FROM categories WHERE slug = '伴手禮' LIMIT 1),
   '玫瑰鹽綜合蛋黃酥禮盒',
   'rose-salt-assorted-egg-yolk-gift',
   '玫瑰鹽綜合蛋黃酥禮盒，烏豆沙、芋頭、抹茶、棗泥任選三入。',
   225,
   25,
   'images/S__294150156_0.jpg',
   1,
   '{"id":"rose-salt-assorted-egg-yolk-gift","title":"玫瑰鹽綜合蛋黃酥禮盒","cat":"伴手禮","price":"$225","priceValue":225,"quantity":25,"day":"5","size":"3入","img":"/assets/images/S__294150156_0.jpg","desc":"玫瑰鹽綜合蛋黃酥禮盒，烏豆沙、芋頭、抹茶、棗泥任選三入。","variants":{"flavors":["烏豆沙","芋頭","抹茶","棗泥"],"flavorCount":3,"sizes":{"3入":225}},"published":true}');

INSERT OR IGNORE INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, image_key, 0, 1
FROM products
WHERE slug = 'rose-salt-assorted-egg-yolk-gift';
