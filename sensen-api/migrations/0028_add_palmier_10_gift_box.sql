-- Add the 10-piece Isigny butter palmier gift box as a separate package size.
PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO products (
  category_id, name, slug, description, price, stock, image_key, is_active, metadata_json
)
VALUES (
  (SELECT id FROM categories WHERE slug = '伴手禮'),
  '蝴蝶酥禮盒（10入）',
  'souvenir-palmier-10',
  '選用伊思尼奶油製成，歐盟 AOP 認證。',
  400,
  25,
  'images/palmiers-2.jpg',
  1,
  '{"priceValue":400,"day":5,"size":"10入","img":"/assets/images/palmiers-2.jpg","desc":"選用伊思尼奶油製成，歐盟 AOP 認證。","sku":"souvenir-palmier-10"}'
);

INSERT OR IGNORE INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, 'images/palmiers-2.jpg', 0, 1
FROM products
WHERE slug = 'souvenir-palmier-10';
