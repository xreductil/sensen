-- Publish the birthday-cake image products so the customer storefront reads
-- the same image records as the admin inventory.
UPDATE products
SET is_active = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE slug IN (
  'new-birthday-cake-image-01',
  'new-birthday-cake-image-02',
  'new-birthday-cake-image-03',
  'new-birthday-cake-image-04',
  'new-birthday-cake-image-05',
  'new-birthday-cake-image-06',
  'new-birthday-cake-image-07'
);

INSERT OR IGNORE INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, image_key, 0, 1
FROM products
WHERE slug IN (
  'new-birthday-cake-image-01',
  'new-birthday-cake-image-02',
  'new-birthday-cake-image-03',
  'new-birthday-cake-image-04',
  'new-birthday-cake-image-05',
  'new-birthday-cake-image-06',
  'new-birthday-cake-image-07'
)
  AND image_key IS NOT NULL;
