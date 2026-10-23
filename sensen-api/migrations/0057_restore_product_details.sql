-- Restore the product detail fields retained by the local Sensen catalog backup.
-- Only the description/detail metadata is changed; prices, stock, images, and
-- variant pricing remain untouched.

UPDATE products SET
  description = '香草蛋糕│進口熱帶水果餡+布丁',
  metadata_json = json_set(COALESCE(metadata_json, '{}'),
    '$.desc', '香草蛋糕│進口熱帶水果餡+布丁',
    '$.size', '6吋、8吋 、10吋、12吋', '$.spec', '6吋、8吋 、10吋、12吋',
    '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢',
    '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'colorful-world';

UPDATE products SET
  description = '巧克力蛋糕│咖啡香緹鮮奶油+榛果核桃+布丁',
  metadata_json = json_set(COALESCE(metadata_json, '{}'),
    '$.desc', '巧克力蛋糕│咖啡香緹鮮奶油+榛果核桃+布丁',
    '$.size', '6吋、8吋 、10吋、12吋', '$.spec', '6吋、8吋 、10吋、12吋',
    '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢',
    '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'mocha';

UPDATE products SET
  description = '巧克力蛋糕│巧克力慕斯+法式脆餅餡',
  metadata_json = json_set(COALESCE(metadata_json, '{}'),
    '$.desc', '巧克力蛋糕│巧克力慕斯+法式脆餅餡',
    '$.size', '6吋、8吋', '$.spec', '6吋、8吋',
    '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢',
    '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'hazelnut-crunch';

UPDATE products SET
  description = '巧克力蛋糕│雙層黑櫻桃果餡',
  metadata_json = json_set(COALESCE(metadata_json, '{}'),
    '$.desc', '巧克力蛋糕│雙層黑櫻桃果餡',
    '$.size', '6吋、8吋 、10吋、12吋', '$.spec', '6吋、8吋 、10吋、12吋',
    '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢',
    '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'black-forest';

UPDATE products SET
  description = '香草蛋糕│進口熱帶水果餡+布丁',
  metadata_json = json_set(COALESCE(metadata_json, '{}'),
    '$.desc', '香草蛋糕│進口熱帶水果餡+布丁',
    '$.size', '6吋、8吋', '$.spec', '6吋、8吋',
    '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢',
    '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'souffle';

UPDATE products SET
  description = '巧克力蛋糕│頂級藍莓餡+布丁',
  metadata_json = json_set(COALESCE(metadata_json, '{}'),
    '$.desc', '巧克力蛋糕│頂級藍莓餡+布丁',
    '$.size', '6吋、8吋 、10吋、12吋', '$.spec', '6吋、8吋 、10吋、12吋',
    '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢',
    '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'macaron-forest';

UPDATE products SET
  description = '香草蛋糕│新鮮草莓+布丁',
  metadata_json = json_set(COALESCE(metadata_json, '{}'),
    '$.desc', '香草蛋糕│新鮮草莓+布丁',
    '$.size', '6吋、8吋 、10吋~20吋', '$.spec', '6吋、8吋 、10吋~20吋',
    '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢',
    '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'strawberry-shudo';

UPDATE products SET
  description = '香草蛋糕│玫瑰草莓餡+布丁',
  metadata_json = json_set(COALESCE(metadata_json, '{}'),
    '$.desc', '香草蛋糕│玫瑰草莓餡+布丁',
    '$.size', '6吋、8吋', '$.spec', '6吋、8吋',
    '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢',
    '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'rose-bouquet';

UPDATE products SET
  description = '巧克力蛋糕│雙層香草布丁',
  metadata_json = json_set(COALESCE(metadata_json, '{}'),
    '$.desc', '巧克力蛋糕│雙層香草布丁',
    '$.size', '6吋、8吋', '$.spec', '6吋、8吋',
    '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢',
    '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'bodhi-cake';

UPDATE products SET
  description = '香草蛋糕│雙層頂級大甲芋泥餡',
  metadata_json = json_set(COALESCE(metadata_json, '{}'),
    '$.desc', '香草蛋糕│雙層頂級大甲芋泥餡',
    '$.size', '6吋、8吋、10吋、12吋', '$.spec', '6吋、8吋、10吋、12吋',
    '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢',
    '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'puff-kingdom';

UPDATE products SET
  description = '香草蛋糕│低糖紅豆餡+QQ麻糬+布丁',
  metadata_json = json_set(COALESCE(metadata_json, '{}'),
    '$.desc', '香草蛋糕│低糖紅豆餡+QQ麻糬+布丁',
    '$.size', '6吋、8吋', '$.spec', '6吋、8吋',
    '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢',
    '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'uji-hayakaze';

UPDATE products SET
  description = '香草蛋糕│法國萊思克乳霜、雙層當季新鮮藍莓' || char(10) || '※歐盟AOP認證，純粹乳香及果香交織成法式的質感享受',
  metadata_json = json_set(COALESCE(metadata_json, '{}'),
    '$.desc', '香草蛋糕│法國萊思克乳霜、雙層當季新鮮藍莓' || char(10) || '※歐盟AOP認證，純粹乳香及果香交織成法式的質感享受',
    '$.size', '6吋、8吋', '$.spec', '6吋、8吋',
    '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢',
    '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'blueberry-lysk';

UPDATE products SET
  description = '巧克力蛋糕│進口熱帶水果餡+布丁',
  metadata_json = json_set(COALESCE(metadata_json, '{}'),
    '$.desc', '巧克力蛋糕│進口熱帶水果餡+布丁',
    '$.size', '6吋、8吋 、10吋、12吋', '$.spec', '6吋、8吋 、10吋、12吋',
    '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢',
    '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'angel-cake';

UPDATE products SET
  description = '巧克力蛋糕│頂級藍莓餡+布丁',
  metadata_json = json_set(COALESCE(metadata_json, '{}'),
    '$.desc', '巧克力蛋糕│頂級藍莓餡+布丁',
    '$.size', '限定 6吋、8吋', '$.spec', '限定 6吋、8吋',
    '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢',
    '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'hibachi-shiba';

UPDATE products SET
  description = '巧克力蛋糕│頂級藍莓餡+布丁',
  metadata_json = json_set(COALESCE(metadata_json, '{}'),
    '$.desc', '巧克力蛋糕│頂級藍莓餡+布丁',
    '$.size', '限定 6吋、8吋', '$.spec', '限定 6吋、8吋',
    '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢',
    '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'rilakkuma';

UPDATE products SET
  description = '香草蛋糕│進口草莓果餡+布丁',
  metadata_json = json_set(COALESCE(metadata_json, '{}'),
    '$.desc', '香草蛋糕│進口草莓果餡+布丁',
    '$.size', '限定 6吋、8吋', '$.spec', '限定 6吋、8吋',
    '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢',
    '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'pikachu';

UPDATE products SET
  description = '香草蛋糕│進口草莓果餡+布丁',
  metadata_json = json_set(COALESCE(metadata_json, '{}'),
    '$.desc', '香草蛋糕│進口草莓果餡+布丁',
    '$.size', '限定 6吋、8吋', '$.spec', '限定 6吋、8吋',
    '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢',
    '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'cute-rabbit';

UPDATE products SET
  description = '大湖草莓冰淇淋+義式香草冰淇淋．義式冰淇淋蛋糕',
  metadata_json = json_set(COALESCE(metadata_json, '{}'),
    '$.desc', '大湖草莓冰淇淋+義式香草冰淇淋．義式冰淇淋蛋糕',
    '$.size', '限定 6吋、8吋', '$.spec', '限定 6吋、8吋',
    '$.storage', '需冷凍。離開冷凍，請於1小時內食用完畢。',
    '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'berry-melody';

UPDATE products SET
  description = '比利時巧克力冰淇淋+義式香草冰淇淋．義式冰淇淋蛋糕',
  metadata_json = json_set(COALESCE(metadata_json, '{}'),
    '$.desc', '比利時巧克力冰淇淋+義式香草冰淇淋．義式冰淇淋蛋糕',
    '$.size', '限定 6吋、8吋', '$.spec', '限定 6吋、8吋',
    '$.storage', '需冷凍。離開冷凍，請於1小時內食用完畢。',
    '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。')
WHERE slug = 'black-knight-ice-cream';
