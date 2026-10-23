-- Keep the standard food-safety note on every 頂家彌月 product.
UPDATE products
SET metadata_json = json_set(
      COALESCE(metadata_json, '{}'),
      '$.other',
      '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。'
    ),
    updated_at = CURRENT_TIMESTAMP
WHERE slug LIKE 'top-house-%';
