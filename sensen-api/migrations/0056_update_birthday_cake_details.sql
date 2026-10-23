-- Publish the confirmed descriptions and size prices for three new birthday cakes.
-- Additive and idempotent: stock, orders, carts, and existing product IDs are preserved.
PRAGMA foreign_keys = ON;

UPDATE products
SET description = '巧克力蛋糕｜芝麻慕斯+焦糖堅果+布丁',
    price = 750,
    metadata_json = json_remove(
      json_set(
        COALESCE(NULLIF(metadata_json, ''), '{}'),
        '$.priceValue', 750,
        '$.size', '6吋、8吋',
        '$.variants', json('{"sizes":{"6吋":750,"8吋":980}}'),
        '$.desc', '巧克力蛋糕｜芝麻慕斯+焦糖堅果+布丁'
      ),
      '$.temporaryPrice'
    ),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'new-birthday-cake-image-01';

UPDATE products
SET description = '香草蛋糕｜紅心芭樂香堤+洋梨+紅心芭樂果乾',
    price = 750,
    metadata_json = json_remove(
      json_set(
        COALESCE(NULLIF(metadata_json, ''), '{}'),
        '$.priceValue', 750,
        '$.size', '6吋、8吋',
        '$.variants', json('{"sizes":{"6吋":750,"8吋":980}}'),
        '$.desc', '香草蛋糕｜紅心芭樂香堤+洋梨+紅心芭樂果乾'
      ),
      '$.temporaryPrice'
    ),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'new-birthday-cake-image-02';

UPDATE products
SET description = '香草蛋糕｜頂級大甲芋泥餡+布丁',
    price = 750,
    metadata_json = json_remove(
      json_set(
        COALESCE(NULLIF(metadata_json, ''), '{}'),
        '$.priceValue', 750,
        '$.size', '6吋、8吋',
        '$.variants', json('{"sizes":{"6吋":750,"8吋":980}}'),
        '$.desc', '香草蛋糕｜頂級大甲芋泥餡+布丁'
      ),
      '$.temporaryPrice'
    ),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'new-birthday-cake-image-03';
