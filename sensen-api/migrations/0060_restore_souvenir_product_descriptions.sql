-- Restore souvenir product descriptions from the official Sensen product pages.
-- Keep prices, stock, images, variants, and metadata unchanged.

UPDATE products SET description = '不同手法的餅皮呈現帶出奶油與食材間的平衡。'
WHERE slug = 'souvenir-bean-tower';

UPDATE products SET description = '樸實無華的外表，有著香酥肉鬆的內在，' || char(10) ||
  '誘人的手作餅皮香氣與切開來爆餡的肉鬆。' || char(10) ||
  '肉鬆控的你絕對無法抵擋它的誘惑！' || char(10) ||
  '一口咬下滿滿的肉鬆和香氣瞬間炸出！' || char(10) ||
  '絕對讓你大滿足。'
WHERE slug = 'souvenir-pork-floss';

UPDATE products SET description = '外表猶如蝴蝶的經典法式甜點' || char(10) ||
  '採用高規格進口麵粉&法國發酵奶油，' || char(10) ||
  '揉合成層層堆疊的手工派皮，外層再佐糖粒一起經過高溫烘烤，' || char(10) ||
  '形成略帶焦糖味的酥脆派餅，酥脆的口感且甜而不膩。' || char(10) ||
  '同時也能吃出細緻的奶油香氣及糖粒帶來的層次口感。'
WHERE slug = 'souvenir-palmier';

UPDATE products SET description = '杏仁千層酥 閃電酥 NEW' || char(10) || char(10) ||
  '嚴選法國奶油、進口麵粉、香酥杏仁片'
WHERE slug = 'souvenir-almond-layer';

UPDATE products SET description = '採用麥芽、手工自製的傳統口味，香、酥、多層次的餅皮搭配甜而不膩的內餡，懷念的味道依舊完美。'
WHERE slug = 'souvenir-butter-cake';

UPDATE products SET description = '嚴選新鮮雞蛋等高級食材以純手工自製而成。低糖少油且無添加防腐劑或其它食品添加物，給您最純粹的食材原味！'
WHERE slug = 'souvenir-egg-roll';

UPDATE products SET description = '濃郁奶香的鈕扣餅夾上軟Q的牛軋糖內餡，小巧形狀讓您一口接一口！'
WHERE slug = 'souvenir-button-nougat';

UPDATE products SET description = '法式常溫甜點新登場'
WHERE slug = 'souvenir-dacquoise';

UPDATE products SET description = '採用在地鳳梨新鮮熬煮，搭配黃金比例的金黃內餡，酸甜滋味，口齒留香。'
WHERE slug = 'souvenir-pineapple-cake';

UPDATE products SET description = '最具代表性的熱銷伴手，草莓大福採用自製紅豆餡，綿密滑順的口感搭配新鮮酸甜草莓，每一顆皆為手工製作，新鮮吃的到。'
WHERE slug = 'souvenir-daifuku';
