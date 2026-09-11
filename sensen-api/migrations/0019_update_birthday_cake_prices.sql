-- Migration number: 0019  2026-09-12
-- Birthday cake prices transcribed from birthday-cake-DM (1).pdf.
-- The products.price column keeps the 6-inch base price used by the cart;
-- priceOptions preserves every size/price pair shown in the DM.

UPDATE products SET price = 980,
  metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.priceOptions', json('{"6吋":980,"8吋":1580}'))
WHERE slug IN ('emerald-lysk', 'strawberry-lysk', 'blueberry-lysk');

UPDATE products SET price = 750,
  metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.priceOptions', json('{"6吋":750,"8吋":980}'))
WHERE slug IN (
  'colorful-world', 'mocha', 'bodhi-cake', 'gulava', 'caramel-party',
  'souffle', 'macaron-forest', 'black-forest', 'hazelnut-crunch',
  'passion-pear', 'uji-hayakaze'
);

UPDATE products SET price = 720,
  metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.priceOptions', json('{"6吋":720,"8吋":980}'))
WHERE slug = 'angel-cake';

UPDATE products SET price = 720,
  metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.priceOptions', json('{"6吋":720,"8吋":980}'))
WHERE slug = 'rose-bouquet';

UPDATE products SET price = 780,
  metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.priceOptions', json('{"6吋":780,"8吋":1080}'))
WHERE slug = 'puff-kingdom';

UPDATE products SET price = 850,
  metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.priceOptions', json('{"6吋":850,"8吋":1080}'))
WHERE slug = 'strawberry-shudo';

UPDATE products SET price = 1080,
  metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.priceOptions', json('{"6吋":1080,"8吋":1580}'))
WHERE slug IN ('oreo-ice-cream', 'yellow-duck-ice-cream', 'black-knight-ice-cream', 'berry-melody');

UPDATE products SET price = 880,
  metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.priceOptions', json('{"6吋":880}'))
WHERE slug IN ('polar-bear', 'spiderman');

UPDATE products SET price = 880,
  metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.priceOptions', json('{"6吋":880,"8吋":1180}'))
WHERE slug IN ('rilakkuma', 'cute-rabbit', 'hibachi-shiba', 'pikachu');
