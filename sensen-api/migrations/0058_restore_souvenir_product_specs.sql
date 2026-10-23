-- Restore Sensen souvenir product specs from the official product pages.
-- Keep product descriptions, prices, stock, images, and variants unchanged.

UPDATE products SET metadata_json = json_set(COALESCE(metadata_json, '{}'),
  '$.size', '6入、9入', '$.spec', '6入、9入',
  '$.storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。',
  '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'souvenir-bean-tower';

UPDATE products SET metadata_json = json_set(COALESCE(metadata_json, '{}'),
  '$.size', '8入', '$.spec', '8入',
  '$.storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。',
  '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'souvenir-pork-floss';

UPDATE products SET metadata_json = json_set(COALESCE(metadata_json, '{}'),
  '$.size', '8入', '$.spec', '8入',
  '$.storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。',
  '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'souvenir-palmier';

UPDATE products SET metadata_json = json_set(COALESCE(metadata_json, '{}'),
  '$.size', '130g', '$.spec', '130g',
  '$.storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。',
  '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'souvenir-almond-layer';

UPDATE products SET metadata_json = json_set(COALESCE(metadata_json, '{}'),
  '$.size', '10入', '$.spec', '10入',
  '$.storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。',
  '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'souvenir-butter-cake';

UPDATE products SET metadata_json = json_set(COALESCE(metadata_json, '{}'),
  '$.size', '10入/盒', '$.spec', '10入/盒',
  '$.storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。',
  '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'souvenir-egg-roll';

UPDATE products SET metadata_json = json_set(COALESCE(metadata_json, '{}'),
  '$.size', '200g', '$.spec', '200g',
  '$.storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。',
  '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'souvenir-button-nougat';

UPDATE products SET metadata_json = json_set(COALESCE(metadata_json, '{}'),
  '$.size', '6入、9入', '$.spec', '6入、9入',
  '$.storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。',
  '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'souvenir-dacquoise';

UPDATE products SET metadata_json = json_set(COALESCE(metadata_json, '{}'),
  '$.size', '8入、12入', '$.spec', '8入、12入',
  '$.storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。',
  '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'souvenir-pineapple-cake';

UPDATE products SET metadata_json = json_set(COALESCE(metadata_json, '{}'),
  '$.size', '6入', '$.spec', '6入',
  '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢',
  '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'souvenir-daifuku';
