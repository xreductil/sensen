-- Restore the legacy black knight ice-cream cake so its existing detail page
-- can be hydrated from the public products API.
PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO categories (name, slug)
VALUES ('冰淇淋蛋糕', '冰淇淋蛋糕');

INSERT OR IGNORE INTO products
  (category_id, name, slug, description, price, stock, image_key, is_active, metadata_json)
VALUES
  ((SELECT id FROM categories WHERE name = '冰淇淋蛋糕' LIMIT 1),
   '黑爵士',
   'black-knight-ice-cream',
   '巧克力風味冰淇淋蛋糕。',
   880,
   15,
   'images/cake-2024-13.png',
   1,
   '{"priceValue":880,"day":"7","img":"/assets/images/cake-2024-13.png","desc":"巧克力風味冰淇淋蛋糕。","size":"限定 6吋、8吋"}');

INSERT OR IGNORE INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, 'images/cake-2024-13.png', 0, 1
FROM products
WHERE slug = 'black-knight-ice-cream';
