-- Publish the existing black knight ice-cream cake record so its legacy
-- product detail route is backed by the public products API.
UPDATE products
SET name = '黑爵士',
    description = '巧克力風味冰淇淋蛋糕。',
    price = 880,
    stock = 15,
    image_key = 'images/cake-2024-13.png',
    is_active = 1,
    metadata_json = '{"priceValue":880,"day":"7","img":"/assets/images/cake-2024-13.png","desc":"巧克力風味冰淇淋蛋糕。","size":"限定 6吋、8吋"}',
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'black-knight-ice-cream';

INSERT OR IGNORE INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, 'images/cake-2024-13.png', 0, 1
FROM products
WHERE slug = 'black-knight-ice-cream';
