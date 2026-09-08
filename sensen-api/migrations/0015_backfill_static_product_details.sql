-- Backfill product detail fields from the static product pages at 607a1ee7^.
-- Preserve current product names, prices, stock, categories, and publishing state.

UPDATE products
SET description = 'OREO冰淇淋．義式冰淇淋蛋糕',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', 'OREO冰淇淋．義式冰淇淋蛋糕', '$.size', '限定 6吋、8吋', '$.spec', '限定 6吋、8吋', '$.storage', '需冷凍。離開冷凍，請於1小時內食用完畢。', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 36, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-vlml.png')
WHERE slug = 'oreo-ice-cream';

UPDATE products
SET description = '香草蛋糕│進口草莓果餡+布丁',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '香草蛋糕│進口草莓果餡+布丁', '$.size', '限定 6吋', '$.spec', '限定 6吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 11, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-foraging.png')
WHERE slug = 'polar-bear';

UPDATE products
SET description = '巧克力蛋糕│法式脆餅餡+布丁',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '巧克力蛋糕│法式脆餅餡+布丁', '$.size', '6吋、8吋', '$.spec', '6吋、8吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 14, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-foraging.png')
WHERE slug = 'gulava';

UPDATE products
SET description = '香草蛋糕│進口草莓果餡+布丁',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '香草蛋糕│進口草莓果餡+布丁', '$.size', '限定 6吋、8吋', '$.spec', '限定 6吋、8吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 5, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-foraging.png')
WHERE slug = 'cute-rabbit';

UPDATE products
SET description = '巧克力蛋糕│頂級藍莓餡+布丁',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '巧克力蛋糕│頂級藍莓餡+布丁', '$.size', '限定 6吋、8吋', '$.spec', '限定 6吋、8吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 5, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-vlml.png')
WHERE slug = 'hibachi-shiba';

UPDATE products
SET description = '採用在地鳳梨新鮮熬煮，搭配黃金比例的金黃內餡，酸甜滋味，口齒留香。',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '採用在地鳳梨新鮮熬煮，搭配黃金比例的金黃內餡，酸甜滋味，口齒留香。', '$.size', '規格：8入、12入', '$.spec', '規格：8入、12入', '$.storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '', '$.likes', 7, '$.dietary', '', '$.dietaryImage', '')
WHERE slug = 'souvenir-pineapple-cake';

UPDATE products
SET description = '巧克力蛋糕│進口熱帶水果餡+布丁',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '巧克力蛋糕│進口熱帶水果餡+布丁', '$.size', '6吋、8吋 、10吋、12吋', '$.spec', '6吋、8吋 、10吋、12吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 6, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-vlml.png')
WHERE slug = 'angel-cake';

UPDATE products
SET description = '採用麥芽、手工自製的傳統口味，香、酥、多層次的餅皮搭配甜而不膩的內餡，懷念的味道依舊完美。',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '採用麥芽、手工自製的傳統口味，香、酥、多層次的餅皮搭配甜而不膩的內餡，懷念的味道依舊完美。', '$.size', '規格：10入', '$.spec', '規格：10入', '$.storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '', '$.likes', 6, '$.dietary', '', '$.dietaryImage', '')
WHERE slug = 'souvenir-butter-cake';

UPDATE products
SET description = '香草蛋糕│低糖紅豆餡+QQ麻糬+布丁',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '香草蛋糕│低糖紅豆餡+QQ麻糬+布丁', '$.size', '6吋、8吋', '$.spec', '6吋、8吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 3, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-foraging.png')
WHERE slug = 'uji-hayakaze';

UPDATE products
SET description = '嚴選新鮮雞蛋等高級食材以純手工自製而成。低糖少油且無添加防腐劑或其它食品添加物，給您最純粹的食材原味！',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '嚴選新鮮雞蛋等高級食材以純手工自製而成。低糖少油且無添加防腐劑或其它食品添加物，給您最純粹的食材原味！', '$.size', '口味：原味、芝麻；規格：10入/盒', '$.spec', '口味：原味、芝麻；規格：10入/盒', '$.storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '', '$.likes', 4, '$.dietary', '', '$.dietaryImage', '')
WHERE slug = 'souvenir-egg-roll';

UPDATE products
SET description = '巧克力蛋糕│頂級藍莓餡+布丁',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '巧克力蛋糕│頂級藍莓餡+布丁', '$.size', '限定 6吋、8吋', '$.spec', '限定 6吋、8吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 5, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-foraging.png')
WHERE slug = 'rilakkuma';

UPDATE products
SET description = '巧克力蛋糕│咖啡香緹鮮奶油+榛果核桃+布丁',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '巧克力蛋糕│咖啡香緹鮮奶油+榛果核桃+布丁', '$.size', '6吋、8吋 、10吋、12吋', '$.spec', '6吋、8吋 、10吋、12吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 16, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-vlml.png')
WHERE slug = 'mocha';

UPDATE products
SET description = '最具代表性的熱銷伴手，草莓大福採用自製紅豆餡，綿密滑順的口感搭配新鮮酸甜草莓，每一顆皆為手工製作，新鮮吃的到。',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '最具代表性的熱銷伴手，草莓大福採用自製紅豆餡，綿密滑順的口感搭配新鮮酸甜草莓，每一顆皆為手工製作，新鮮吃的到。', '$.size', '口味：草莓紅豆、紅豆(無草莓)、芋泥(無草莓)、提拉米蘇(無草莓)；規格：6入', '$.spec', '口味：草莓紅豆、紅豆(無草莓)、芋泥(無草莓)、提拉米蘇(無草莓)；規格：6入', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '', '$.likes', 10, '$.dietary', '', '$.dietaryImage', '')
WHERE slug = 'souvenir-daifuku';

UPDATE products
SET description = '樸實無華的外表，有著香酥肉鬆的內在， 誘人的手作餅皮香氣與切開來爆餡的肉鬆。 肉鬆控的你絕對無法抵擋它的誘惑！ 一口咬下滿滿的肉鬆和香氣瞬間炸出！ 絕對讓你大滿足。',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '樸實無華的外表，有著香酥肉鬆的內在， 誘人的手作餅皮香氣與切開來爆餡的肉鬆。 肉鬆控的你絕對無法抵擋它的誘惑！ 一口咬下滿滿的肉鬆和香氣瞬間炸出！ 絕對讓你大滿足。', '$.size', '規格：8入', '$.spec', '規格：8入', '$.storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '', '$.likes', 17, '$.dietary', '', '$.dietaryImage', '')
WHERE slug = 'souvenir-pork-floss';

UPDATE products
SET description = '巧克力蛋糕│巧克力慕斯+法式脆餅餡',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '巧克力蛋糕│巧克力慕斯+法式脆餅餡', '$.size', '6吋、8吋', '$.spec', '6吋、8吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 10, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-foraging.png')
WHERE slug = 'hazelnut-crunch';

UPDATE products
SET description = '外表猶如蝴蝶的 經典法式甜點 採用高規格進口麵粉&法國發酵奶油， 揉合成層層堆疊的手工派皮，外層再佐糖粒一起經過高溫烘烤， 形成略帶焦糖味的酥脆派餅，酥脆的口感且甜而不膩。 同時也能吃出細緻的奶油香氣及糖粒帶來的層次口感。',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '外表猶如蝴蝶的 經典法式甜點 採用高規格進口麵粉&法國發酵奶油， 揉合成層層堆疊的手工派皮，外層再佐糖粒一起經過高溫烘烤， 形成略帶焦糖味的酥脆派餅，酥脆的口感且甜而不膩。 同時也能吃出細緻的奶油香氣及糖粒帶來的層次口感。', '$.size', '規格：8入', '$.spec', '規格：8入', '$.storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '', '$.likes', 8, '$.dietary', '', '$.dietaryImage', '')
WHERE slug = 'souvenir-palmier';

UPDATE products
SET description = '香草蛋糕│雙層頂級大甲芋泥餡',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '香草蛋糕│雙層頂級大甲芋泥餡', '$.size', '6吋、8吋、10吋、12吋', '$.spec', '6吋、8吋、10吋、12吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 9, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-vlml.png')
WHERE slug = 'puff-kingdom';

UPDATE products
SET description = '巧克力蛋糕│雙層香草布丁',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '巧克力蛋糕│雙層香草布丁', '$.size', '6吋、8吋', '$.spec', '6吋、8吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 3, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-vlml.png')
WHERE slug = 'bodhi-cake';

UPDATE products
SET description = '巧克力蛋糕│焦糖堅果+布丁',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '巧克力蛋糕│焦糖堅果+布丁', '$.size', '6吋、8吋', '$.spec', '6吋、8吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 31, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-vlml.png')
WHERE slug = 'caramel-party';

UPDATE products
SET description = '香草蛋糕│玫瑰草莓餡+布丁',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '香草蛋糕│玫瑰草莓餡+布丁', '$.size', '6吋、8吋', '$.spec', '6吋、8吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 3, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-vlml.png')
WHERE slug = 'rose-bouquet';

UPDATE products
SET description = '香草蛋糕│百香果洋梨餡+布丁',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '香草蛋糕│百香果洋梨餡+布丁', '$.size', '6吋、8吋', '$.spec', '6吋、8吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 25, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-vlml.png')
WHERE slug = 'passion-pear';

UPDATE products
SET description = '香草蛋糕│進口草莓果餡+布丁',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '香草蛋糕│進口草莓果餡+布丁', '$.size', '限定 6吋、8吋', '$.spec', '限定 6吋、8吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 9, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-vlml.png')
WHERE slug = 'pikachu';

UPDATE products
SET description = '香草蛋糕│法國萊思克乳霜、雙層當季新鮮綠葡萄' || char(10) || '※歐盟AOP認證，純粹乳香及果香交織成法式的質感享受',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '香草蛋糕│法國萊思克乳霜、雙層當季新鮮綠葡萄' || char(10) || '※歐盟AOP認證，純粹乳香及果香交織成法式的質感享受', '$.size', '6吋、8吋', '$.spec', '6吋、8吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 10, '$.dietary', '奶蛋素', '$.dietaryImage', 'icon-vlml.png')
WHERE slug = 'emerald-lysk';

UPDATE products
SET description = '香草蛋糕│進口熱帶水果餡+布丁',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '香草蛋糕│進口熱帶水果餡+布丁', '$.size', '6吋、8吋 、10吋、12吋', '$.spec', '6吋、8吋 、10吋、12吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 34, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-vlml.png')
WHERE slug = 'colorful-world';

UPDATE products
SET description = '香草蛋糕│新鮮草莓+布丁',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '香草蛋糕│新鮮草莓+布丁', '$.size', '6吋、8吋 、10吋~20吋', '$.spec', '6吋、8吋 、10吋~20吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 5, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-vlml.png')
WHERE slug = 'strawberry-shudo';

UPDATE products
SET description = '香草蛋糕│法國萊思克乳霜、雙層當季新鮮草莓' || char(10) || '※歐盟AOP認證，純粹乳香及果香交織成法式的質感享受',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '香草蛋糕│法國萊思克乳霜、雙層當季新鮮草莓' || char(10) || '※歐盟AOP認證，純粹乳香及果香交織成法式的質感享受', '$.size', '6吋、8吋', '$.spec', '6吋、8吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 17, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-vlml.png')
WHERE slug = 'strawberry-lysk';

UPDATE products
SET description = '大湖草莓冰淇淋+義式香草冰淇淋．義式冰淇淋蛋糕',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '大湖草莓冰淇淋+義式香草冰淇淋．義式冰淇淋蛋糕', '$.size', '限定 6吋、8吋', '$.spec', '限定 6吋、8吋', '$.storage', '需冷凍。離開冷凍，請於1小時內食用完畢。', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 24, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-vlml.png')
WHERE slug = 'berry-melody';

UPDATE products
SET description = '香草蛋糕│法國萊思克乳霜、雙層當季新鮮藍莓' || char(10) || '※歐盟AOP認證，純粹乳香及果香交織成法式的質感享受',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '香草蛋糕│法國萊思克乳霜、雙層當季新鮮藍莓' || char(10) || '※歐盟AOP認證，純粹乳香及果香交織成法式的質感享受', '$.size', '6吋、8吋', '$.spec', '6吋、8吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 2, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-vlml.png')
WHERE slug = 'blueberry-lysk';

UPDATE products
SET description = '巧克力蛋糕│頂級藍莓餡+布丁',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '巧克力蛋糕│頂級藍莓餡+布丁', '$.size', '限定 6吋', '$.spec', '限定 6吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 8, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-foraging.png')
WHERE slug = 'spiderman';

UPDATE products
SET description = '不同手法的餅皮呈現帶出奶油與食材間的平衡。' || char(10) || '夏威夷豆和果乾拌入蜂蜜綴在酥香豆塔餅皮上，也是我們的經典不敗款。',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '不同手法的餅皮呈現帶出奶油與食材間的平衡。' || char(10) || '夏威夷豆和果乾拌入蜂蜜綴在酥香豆塔餅皮上，也是我們的經典不敗款。', '$.size', '規格：6入、9入', '$.spec', '規格：6入、9入', '$.storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '', '$.likes', 9, '$.dietary', '', '$.dietaryImage', '')
WHERE slug = 'souvenir-bean-tower';

UPDATE products
SET description = '杏仁千層酥 閃電酥 NEW 嚴選法國奶油、進口麵粉、香酥杏仁片 純手工製作，沒有過多奶香味，只有烤得酥脆自然散發的餅皮香! 一口接一口停不下來的小茶點。 為甚麼叫閃電酥呢? 因為一開封就快速食完！ 有如閃電一般迅雷不及掩耳的速度！',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '杏仁千層酥 閃電酥 NEW 嚴選法國奶油、進口麵粉、香酥杏仁片 純手工製作，沒有過多奶香味，只有烤得酥脆自然散發的餅皮香! 一口接一口停不下來的小茶點。 為甚麼叫閃電酥呢? 因為一開封就快速食完！ 有如閃電一般迅雷不及掩耳的速度！', '$.size', '規格：130g', '$.spec', '規格：130g', '$.storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '', '$.likes', 10, '$.dietary', '', '$.dietaryImage', '')
WHERE slug = 'souvenir-almond-layer';

UPDATE products
SET description = '濃郁奶香的鈕扣餅夾上軟Q的牛軋糖內餡，小巧形狀讓您一口接一口！',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '濃郁奶香的鈕扣餅夾上軟Q的牛軋糖內餡，小巧形狀讓您一口接一口！', '$.size', '規格：200g', '$.spec', '規格：200g', '$.storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '', '$.likes', 7, '$.dietary', '', '$.dietaryImage', '')
WHERE slug = 'souvenir-button-nougat';

UPDATE products
SET description = '香草蛋糕│進口熱帶水果餡+布丁',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '香草蛋糕│進口熱帶水果餡+布丁', '$.size', '6吋、8吋', '$.spec', '6吋、8吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 20, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-foraging.png')
WHERE slug = 'souffle';

UPDATE products
SET description = '巧克力蛋糕│頂級藍莓餡+布丁',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '巧克力蛋糕│頂級藍莓餡+布丁', '$.size', '6吋、8吋 、10吋、12吋', '$.spec', '6吋、8吋 、10吋、12吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 17, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-vlml.png')
WHERE slug = 'macaron-forest';

UPDATE products
SET description = '法式常溫甜點新登場 美味組合讓每一口都是濃郁香氣的享受 ​ 以精選食材和堅持的心態，每一口都能品嚐到我們的用心與對品質的堅持。 ​ 適合與家人朋友一同分享品味這份傳統與創新的融合。',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '法式常溫甜點新登場 美味組合讓每一口都是濃郁香氣的享受 ​ 以精選食材和堅持的心態，每一口都能品嚐到我們的用心與對品質的堅持。 ​ 適合與家人朋友一同分享品味這份傳統與創新的融合。', '$.size', '規格：6入、9入', '$.spec', '規格：6入、9入', '$.storage', '可常溫保存，賞味期限詳見盒上標示，請避免放置潮濕高溫或曝曬之場所。', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '', '$.likes', 4, '$.dietary', '', '$.dietaryImage', '')
WHERE slug = 'souvenir-dacquoise';

UPDATE products
SET description = '芒果冰淇淋+義式香草冰淇淋．義式冰淇淋蛋糕',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '芒果冰淇淋+義式香草冰淇淋．義式冰淇淋蛋糕', '$.size', '限定 6吋、8吋', '$.spec', '限定 6吋、8吋', '$.storage', '需冷凍。離開冷凍，請於1小時內食用完畢。', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 23, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-vlml.png')
WHERE slug = 'yellow-duck-ice-cream';

UPDATE products
SET description = '巧克力蛋糕│雙層黑櫻桃果餡',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '巧克力蛋糕│雙層黑櫻桃果餡', '$.size', '6吋、8吋 、10吋、12吋', '$.spec', '6吋、8吋 、10吋、12吋', '$.storage', '需冷藏。離開冷藏，請於1小時內食用完畢', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 17, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-vlml.png')
WHERE slug = 'black-forest';

UPDATE products
SET description = '比利時巧克力冰淇淋+義式香草冰淇淋．義式冰淇淋蛋糕',
    metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.desc', '比利時巧克力冰淇淋+義式香草冰淇淋．義式冰淇淋蛋糕', '$.size', '限定 6吋、8吋', '$.spec', '限定 6吋、8吋', '$.storage', '需冷凍。離開冷凍，請於1小時內食用完畢。', '$.other', '無添加防腐劑等食品添加物，天然食品效期較短，請於賞味期限內儘早食用完畢。', '$.note', '※蛋糕造型或裝飾水果若有變更，請以門市販售為準', '$.likes', 22, '$.dietary', '蛋奶素', '$.dietaryImage', 'icon-vlml.png')
WHERE slug = 'black-knight-ice-cream';
