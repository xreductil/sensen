-- Restore the active souvenir catalog after the production D1 database was
-- initialized without the legacy souvenir category and products.
-- This migration is additive and safe to run more than once.
PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO categories (name, slug)
VALUES ('伴手禮', '伴手禮');

INSERT OR IGNORE INTO products
  (category_id, name, slug, description, price, stock, image_key, is_active, metadata_json)
VALUES
  ((SELECT id FROM categories WHERE slug = '伴手禮'), '豆塔禮盒', 'souvenir-bean-tower', '暫定價格，正式價格以商品目錄為準。', 480, 25, 'images/photo-2.jpg', 1, '{"priceValue":480,"price":"$480","day":"5","img":"/assets/images/photo-2.jpg","desc":"暫定價格，正式價格以商品目錄為準。","cat":"伴手禮","published":true}'),
  ((SELECT id FROM categories WHERE slug = '伴手禮'), '肉鬆餅禮盒', 'souvenir-pork-floss', '暫定價格，正式價格以商品目錄為準。', 360, 25, 'images/pork-floss-pastry-4.jpg', 1, '{"priceValue":360,"price":"$360","day":"5","img":"/assets/images/pork-floss-pastry-4.jpg","desc":"暫定價格，正式價格以商品目錄為準。","cat":"伴手禮","published":true}'),
  ((SELECT id FROM categories WHERE slug = '伴手禮'), '蝴蝶酥禮盒', 'souvenir-palmier', '暫定價格，正式價格以商品目錄為準。', 320, 25, 'images/palmiers-2.jpg', 1, '{"priceValue":320,"price":"$320","day":"5","img":"/assets/images/palmiers-2.jpg","desc":"暫定價格，正式價格以商品目錄為準。","cat":"伴手禮","published":true}'),
  ((SELECT id FROM categories WHERE slug = '伴手禮'), '蝴蝶酥禮盒（10入）', 'souvenir-palmier-10', '選用伊思尼奶油製成，歐盟 AOP 認證。', 400, 25, 'images/palmiers-2.jpg', 1, '{"priceValue":400,"price":"$400","day":"5","size":"10入","img":"/assets/images/palmiers-2.jpg","desc":"選用伊思尼奶油製成，歐盟 AOP 認證。","cat":"伴手禮","published":true}'),
  ((SELECT id FROM categories WHERE slug = '伴手禮'), '杏仁千層酥', 'souvenir-almond-layer', '暫定價格，正式價格以商品目錄為準。', 320, 25, 'images/almond-layer-pastry.jpg', 1, '{"priceValue":320,"price":"$320","day":"5","img":"/assets/images/almond-layer-pastry.jpg","desc":"暫定價格，正式價格以商品目錄為準。","cat":"伴手禮","published":true}'),
  ((SELECT id FROM categories WHERE slug = '伴手禮'), '經典奶油餅禮盒', 'souvenir-butter-cake', '採用麥芽、手工自製的傳統口味，香、酥、多層次的餅皮搭配甜而不膩的內餡。', 380, 25, 'images/sun-cake-thumbnail-copy.webp', 1, '{"priceValue":380,"price":"$380","day":"5","size":"規格：10入","spec":"規格：10入","img":"/assets/images/sun-cake-thumbnail-copy.webp","desc":"採用麥芽、手工自製的傳統口味，香、酥、多層次的餅皮搭配甜而不膩的內餡。","dietary":"奶蛋素","cat":"伴手禮","published":true}'),
  ((SELECT id FROM categories WHERE slug = '伴手禮'), '手工蛋捲', 'souvenir-egg-roll', '暫定價格，正式價格以商品目錄為準。', 320, 25, 'images/egg-roll-2.jpg', 1, '{"priceValue":320,"price":"$320","day":"5","img":"/assets/images/egg-roll-2.jpg","desc":"暫定價格，正式價格以商品目錄為準。","cat":"伴手禮","published":true}'),
  ((SELECT id FROM categories WHERE slug = '伴手禮'), '鈕釦牛軋餅', 'souvenir-button-nougat', '暫定價格，正式價格以商品目錄為準。', 380, 25, 'images/button-nougat-pastry-inside-page-3-1.jpg', 1, '{"priceValue":380,"price":"$380","day":"5","img":"/assets/images/button-nougat-pastry-inside-page-3-1.jpg","desc":"暫定價格，正式價格以商品目錄為準。","cat":"伴手禮","published":true}'),
  ((SELECT id FROM categories WHERE slug = '伴手禮'), '達克瓦茲禮盒', 'souvenir-dacquoise', '暫定價格，正式價格以商品目錄為準。', 480, 25, 'images/dacquoise.jpg', 1, '{"priceValue":480,"price":"$480","day":"5","img":"/assets/images/dacquoise.jpg","desc":"暫定價格，正式價格以商品目錄為準。","cat":"伴手禮","published":true}'),
  ((SELECT id FROM categories WHERE slug = '伴手禮'), '土鳳梨酥禮盒（12入）', 'souvenir-pineapple-cake', '土鳳梨酥禮盒（12入），鐵觀音土鳳梨酥、綜合土鳳梨酥或土鳳梨酥禮盒款式任選。', 360, 25, 'images/S__294150148_0.webp', 1, '{"priceValue":360,"price":"$360","day":"5","size":"12入","spec":"12入；包裝款式可選","img":"/assets/images/S__294150148_0.webp","desc":"土鳳梨酥禮盒（12入），鐵觀音土鳳梨酥、綜合土鳳梨酥或土鳳梨酥禮盒款式任選。","cat":"伴手禮","published":true,"variants":{"sizes":{"12入":360},"flavors":["鐵觀音土鳳梨酥（深藍包裝）","綜合土鳳梨酥（黃銀、深藍包裝）","土鳳梨酥禮盒（黃銀包裝）"],"flavorCount":1,"flavorImages":{"鐵觀音土鳳梨酥（深藍包裝）":"/images/S__294150148_0.webp","綜合土鳳梨酥（黃銀、深藍包裝）":"/images/S__294150149_0.webp","土鳳梨酥禮盒（黃銀包裝）":"/images/S__294150150_0.webp"}}}'),
  ((SELECT id FROM categories WHERE slug = '伴手禮'), '日式大福禮盒', 'souvenir-daifuku', '暫定價格，正式價格以商品目錄為準。', 420, 25, 'images/daifuku-3.jpg', 1, '{"priceValue":420,"price":"$420","day":"5","img":"/assets/images/daifuku-3.jpg","desc":"暫定價格，正式價格以商品目錄為準。","cat":"伴手禮","published":true}'),
  ((SELECT id FROM categories WHERE slug = '伴手禮'), '玫瑰鹽蛋黃酥禮盒（9入）', 'rose-salt-egg-yolk-gift', '玫瑰鹽蛋黃酥禮盒（9入），可選烏豆沙、芋頭、抹茶或棗泥其中一種口味。', 675, 120, 'images/S__294150156_0.webp', 1, '{"priceValue":675,"price":"$675","day":"5","size":"9入","spec":"9入；四選一","img":"/assets/images/S__294150156_0.webp","desc":"玫瑰鹽蛋黃酥禮盒（9入），可選烏豆沙、芋頭、抹茶或棗泥其中一種口味。","dietary":"蛋奶素","cat":"伴手禮","published":true,"newArrival":true,"variants":{"sizes":{"9入":675},"flavors":["烏豆沙","芋頭","抹茶","棗泥"],"flavorCount":1,"flavorPrices":{"烏豆沙":675,"芋頭":675,"抹茶":675,"棗泥":675}}}'),
  ((SELECT id FROM categories WHERE slug = '伴手禮'), '玫瑰鹽綜合蛋黃酥禮盒（9入）', '玫瑰鹽綜合蛋黃酥禮盒', '玫瑰鹽綜合蛋黃酥禮盒（9入），烏豆沙、芋頭、抹茶、棗泥任選三入。', 675, 120, 'images/S__294150156_0.webp', 1, '{"priceValue":675,"price":"$675","day":"5","size":"9入","spec":"9入；四選三","img":"/assets/images/S__294150156_0.webp","desc":"玫瑰鹽綜合蛋黃酥禮盒（9入），烏豆沙、芋頭、抹茶、棗泥任選三入。","dietary":"蛋奶素","cat":"伴手禮","published":true,"newArrival":true,"variants":{"sizes":{"9入":675},"flavors":["烏豆沙","芋頭","抹茶","棗泥"],"flavorCount":3} }'),
  ((SELECT id FROM categories WHERE slug = '伴手禮'), '綠豆椪禮盒（6入）', 'new-souvenir-image-08', '綠豆椪禮盒（6入），可選純綠豆椪、蛋黃綠豆椪或綜合綠豆椪。', 450, 13, 'images/S__294150155_0.webp', 1, '{"priceValue":450,"price":"$450","day":"5","size":"6入","spec":"6入","img":"/assets/images/S__294150155_0.webp","desc":"綠豆椪禮盒（6入），可選純綠豆椪、蛋黃綠豆椪或綜合綠豆椪。","cat":"伴手禮","published":true,"newArrival":true,"variants":{"sizes":{"6入":450},"flavors":["純綠豆椪","蛋黃綠豆椪","綜合綠豆椪"],"flavorCount":1,"flavorPrices":{"純綠豆椪":450,"蛋黃綠豆椪":450,"綜合綠豆椪":450}}}');

INSERT OR IGNORE INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, image_key, 0, 1
FROM products
WHERE slug IN (
  'souvenir-bean-tower', 'souvenir-pork-floss', 'souvenir-palmier',
  'souvenir-palmier-10', 'souvenir-almond-layer', 'souvenir-butter-cake',
  'souvenir-egg-roll', 'souvenir-button-nougat', 'souvenir-dacquoise',
  'souvenir-pineapple-cake', 'souvenir-daifuku', 'rose-salt-egg-yolk-gift',
  '玫瑰鹽綜合蛋黃酥禮盒', 'new-souvenir-image-08'
)
AND image_key IS NOT NULL;

INSERT OR IGNORE INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, 'images/S__294150152_0.webp', 1, 0
FROM products
WHERE slug = 'souvenir-butter-cake';

INSERT OR IGNORE INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, 'images/S__294150149_0.webp', 1, 0
FROM products
WHERE slug = 'souvenir-pineapple-cake';

INSERT OR IGNORE INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, 'images/S__294150150_0.webp', 2, 0
FROM products
WHERE slug = 'souvenir-pineapple-cake';
