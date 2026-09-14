-- Split the former single 頂家彌月 category into the same sections used by the storefront.
PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO categories (name, slug) VALUES
  ('頂家彌月｜波士頓派系列', 'top-house-boston'),
  ('頂家彌月｜大熊／小熊禮盒', 'top-house-bears'),
  ('頂家彌月｜圓圓派', 'top-house-round-pie'),
  ('頂家彌月｜鄉村乳酪禮盒', 'top-house-country-cheese'),
  ('頂家彌月｜彌月長條蛋糕', 'top-house-long-cake'),
  ('頂家彌月｜搭配單品', 'top-house-pairing');

UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'top-house-boston'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug IN (
  'top-house-boston-classic', 'top-house-boston-new',
  'top-house-pa1-boston-gift', 'top-house-pa2-boston-gift',
  'top-house-pa3-boston-gift', 'top-house-pa4-boston-gift'
);

UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'top-house-bears'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug IN (
  'top-house-c1-big-bear', 'top-house-c2-big-bear',
  'top-house-c3-big-bear', 'top-house-c4-big-bear',
  'top-house-b1-little-bear', 'top-house-b2-little-bear',
  'top-house-b3-little-bear', 'top-house-b4-little-bear'
);

UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'top-house-round-pie'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug IN (
  'top-house-k1-creme-brulee', 'top-house-k2-pistachio-marble',
  'top-house-k3-cheesecake', 'top-house-k4-light-cheesecake',
  'top-house-k5-belgian-chocolate', 'top-house-k6-lemon-cheesecake'
);

UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'top-house-country-cheese'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug IN (
  'top-house-l1-country-cheese', 'top-house-l2-country-cheese',
  'top-house-l3-country-cheese'
);

UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'top-house-long-cake'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug IN (
  'top-house-a1-strawberry-marble', 'top-house-a2-honey-cake',
  'top-house-a3-blueberry-angel', 'top-house-a4-lemon-love',
  'top-house-a5-classic-chocolate', 'top-house-a6-left-bank-coffee-roll',
  'top-house-a7-vanilla-napoleon', 'top-house-a7-chocolate-napoleon',
  'top-house-a8-earl-grey-roll', 'top-house-a9-mocha-chocolate',
  'top-house-a10-violet', 'top-house-a11-japanese-layer',
  'top-house-a12-osmanthus-oolong'
);

UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'top-house-pairing'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug LIKE 'top-house-pairing-%';
