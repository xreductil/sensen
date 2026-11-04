-- Restore currently available souvenir products, except all egg-yolk pastry products.
UPDATE products
SET is_active = CASE
  WHEN name LIKE '%蛋黃酥%' OR slug LIKE '%egg-yolk%' OR slug = 'new-souvenir-image-07' THEN 0
  ELSE 1
END,
    stock = CASE
      WHEN slug IN ('new-souvenir-image-06', 'new-souvenir-image-11') AND stock <= 0 THEN 25
      ELSE stock
    END,
    metadata_json = CASE
      WHEN slug IN ('souvenir-daifuku', 'souvenir-dacquoise')
        THEN json_set(metadata_json, '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢')
      ELSE metadata_json
    END,
    updated_at = CURRENT_TIMESTAMP
WHERE category_id = (SELECT id FROM categories WHERE name = '伴手禮' LIMIT 1);
