-- Permanently remove the assorted rose-salt egg-yolk pastry gift box.
DELETE FROM cart_items
WHERE product_id IN (
  SELECT id FROM products WHERE slug = 'rose-salt-assorted-egg-yolk-gift'
);

DELETE FROM product_images
WHERE product_id IN (
  SELECT id FROM products WHERE slug = 'rose-salt-assorted-egg-yolk-gift'
);

DELETE FROM products
WHERE slug = 'rose-salt-assorted-egg-yolk-gift';
