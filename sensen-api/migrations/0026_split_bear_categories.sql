-- Split the combined bear gift-box category into separate big-bear and little-bear labels.
PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO categories (name, slug) VALUES
  ('頂家彌月｜大熊禮盒', 'top-house-big-bear'),
  ('頂家彌月｜小熊禮盒', 'top-house-little-bear');

UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'top-house-big-bear'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug IN (
  'top-house-c1-big-bear', 'top-house-c2-big-bear',
  'top-house-c3-big-bear', 'top-house-c4-big-bear'
);

UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'top-house-little-bear'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug IN (
  'top-house-b1-little-bear', 'top-house-b2-little-bear',
  'top-house-b3-little-bear', 'top-house-b4-little-bear'
);
