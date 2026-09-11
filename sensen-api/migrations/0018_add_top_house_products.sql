-- Add Top House baby-month products for ordering from their original pages.
-- The category is intentionally not part of the online商城 category menu.
PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO categories (name, slug) VALUES ('頂家彌月', 'top-house');

INSERT OR IGNORE INTO products
  (category_id, name, slug, description, price, stock, image_key, is_active)
VALUES
  ((SELECT id FROM categories WHERE slug = 'top-house'), '波士頓派（經典口味）', 'top-house-boston-classic', '9吋波士頓派，經典口味。', 260, 25, 'images/poston-cream-pie-1.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '波士頓派（新品口味）', 'top-house-boston-new', '9吋波士頓派，新品口味。', 300, 25, 'images/poston-cream-pie-1.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'PA1', 'top-house-pa1-boston-gift', '9吋波士頓派×1、油飯8兩×1、紅蛋×2', 375, 25, 'images/boston-pa1.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'PA2', 'top-house-pa2-boston-gift', '9吋波士頓派×1、小檸檬×1、KT蛋糕×1、手工餅乾×1', 430, 25, 'images/boston-pa2.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'PA3', 'top-house-pa3-boston-gift', '9吋波士頓派×1、草莓大福×3', 425, 25, 'images/boston-pa3.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'PA4', 'top-house-pa4-boston-gift', '9吋波士頓派×1、草莓大理石×1', 458, 25, 'images/boston-pa4.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'C1', 'top-house-c1-big-bear', '草莓大理石×1、經典巧克力×1、油飯8兩×1、紅蛋×2', 511, 25, 'images/c1.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'C2', 'top-house-c2-big-bear', '草莓大理石×1、鈕釦牛軋餅×1、珍珠脆糖小泡芙×1、達克瓦茲×3', 508, 25, 'images/c2.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'C3', 'top-house-c3-big-bear', '9吋烤布蕾×1、油飯8兩×1、紅蛋×2', 495, 25, 'images/c7.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'C4', 'top-house-c4-big-bear', '6吋輕乳酪蛋糕×1、油飯8兩×1、紅蛋×2', 470, 25, 'images/c8.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'B1', 'top-house-b1-little-bear', '草莓大理石×1、經典巧克力×1', 396, 25, 'images/b1-copy.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'B2', 'top-house-b2-little-bear', '草莓大理石×1、小檸檬×1、KT貓蛋糕×1、手工餅干×2', 368, 25, 'images/b2.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'B3', 'top-house-b3-little-bear', '草莓大理石×1、油飯8兩×1、紅蛋×2', 313, 25, 'images/b3.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'B4', 'top-house-b4-little-bear', '草莓大理石×1、小檸檬×1、KT貓蛋糕×1、手工餅干×1、紅蛋×2', 353, 25, 'images/b4.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'L1', 'top-house-l1-country-cheese', '6吋檸檬老奶奶×1、小檸檬×1、KT貓蛋糕×1、手工餅乾×1、草莓大理石×1', 660, 25, 'images/country-cheese-l1.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'L2', 'top-house-l2-country-cheese', '6吋比利時巧克力×1、紫羅蘭×1、油飯8兩×1、紅蛋×2', 748, 25, 'images/country-cheese-l2.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'L3', 'top-house-l3-country-cheese', '8吋烤布蕾×1、手工餅乾×1、熊大×1、小檸檬×1、油飯8兩×1、紅蛋×2', 620, 25, 'images/country-cheese-l3.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'K1 烤布蕾', 'top-house-k1-creme-brulee', '圓圓派烤布蕾口味。', 380, 25, 'images/k2.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'K2 開心果雲石', 'top-house-k2-pistachio-marble', '圓圓派開心果雲石口味。', 380, 25, 'images/k2-copy.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'K3 重乳酪(草莓/藍莓)', 'top-house-k3-cheesecake', '圓圓派重乳酪口味，可選草莓或藍莓。', 380, 25, 'images/k3-2.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'K4 輕乳酪', 'top-house-k4-light-cheesecake', '圓圓派輕乳酪口味。', 355, 25, 'images/light-cheese.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'K5 比利時巧克力', 'top-house-k5-belgian-chocolate', '圓圓派比利時巧克力口味。', 355, 25, 'images/k3.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'K6 檸檬老奶奶', 'top-house-k6-lemon-cheesecake', '圓圓派檸檬老奶奶口味。', 355, 25, 'images/k4.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'A1 草莓大理石', 'top-house-a1-strawberry-marble', '彌月長條蛋糕。', 198, 25, 'images/strawberry-marble.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'A2 蜂蜜蛋糕', 'top-house-a2-honey-cake', '彌月長條蛋糕。', 198, 25, 'images/a14.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'A3 藍莓天使', 'top-house-a3-blueberry-angel', '彌月長條蛋糕。', 198, 25, 'images/blueberry-angel.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'A4 檸檬之戀', 'top-house-a4-lemon-love', '彌月長條蛋糕。', 198, 25, 'images/lemon-love.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'A5 經典巧克力', 'top-house-a5-classic-chocolate', '彌月長條蛋糕。', 198, 25, 'images/classic-chocolate.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'A6 左岸咖啡捲', 'top-house-a6-left-bank-coffee-roll', '彌月長條蛋糕。', 288, 25, 'images/a7.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'A7 香草拿破崙派', 'top-house-a7-vanilla-napoleon', '彌月長條蛋糕拿破崙派。', 288, 25, 'images/f1-1.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'A7 巧克力拿破崙派', 'top-house-a7-chocolate-napoleon', '彌月長條蛋糕拿破崙派。', 288, 25, 'images/f2.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'A8 伯爵甜心捲', 'top-house-a8-earl-grey-roll', '彌月長條蛋糕。', 288, 25, 'images/a6.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'A9 摩卡巧克力', 'top-house-a9-mocha-chocolate', '彌月長條蛋糕。', 288, 25, 'images/a5.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'A10 紫羅蘭', 'top-house-a10-violet', '彌月長條蛋糕。', 288, 25, 'images/a2-2.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'A11 日式千層', 'top-house-a11-japanese-layer', '彌月長條蛋糕。', 288, 25, 'images/japanese-layer-cake.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'A12 桂花烏龍甜心', 'top-house-a12-osmanthus-oolong', '彌月長條蛋糕。', 288, 25, 'images/osmanthus-oolong-cake.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '黃金乳酪球', 'top-house-pairing-golden-cheese-ball', '彌月搭配單品。', 60, 25, 'images/s12.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '草莓大福', 'top-house-pairing-strawberry-daifuku', '彌月搭配單品。', 55, 25, 'images/s10.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '泡芙', 'top-house-pairing-cream-puff', '彌月搭配單品。', 45, 25, 'images/s14.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), 'KT蛋糕', 'top-house-pairing-kt-cake', '彌月搭配單品。', 45, 25, 'images/s8.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '熊大蛋糕', 'top-house-pairing-brown-bear-cake', '彌月搭配單品。', 45, 25, 'images/s41.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '小檸檬', 'top-house-pairing-mini-lemon', '彌月搭配單品。', 35, 25, 'images/s9.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '珍珠脆糖小泡芙', 'top-house-pairing-pearl-crunch-puff', '彌月搭配單品。', 60, 25, 'images/pearl-crunch-puff.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '鈕釦牛軋餅', 'top-house-pairing-button-nougat', '彌月搭配單品。', 70, 25, 'images/button.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '杏仁千層酥', 'top-house-pairing-almond-layer', '彌月搭配單品。', 130, 25, 'images/mille-feuille.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '杏加', 'top-house-pairing-almond-cracker', '彌月搭配單品。', 60, 25, 'images/photo-1-6.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '手工餅乾', 'top-house-pairing-handmade-cookie-s13', '彌月搭配單品。', 45, 25, 'images/s13.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '手工餅乾', 'top-house-pairing-handmade-cookie-s22', '彌月搭配單品。', 45, 25, 'images/s22.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '夏威夷豆塔', 'top-house-pairing-hawaiian-nut-tart', '彌月搭配單品。', 50, 25, 'images/hawaiian.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '達克瓦茲', 'top-house-pairing-dacquoise', '彌月搭配單品。', 60, 25, 'images/dacquoise-3.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '蝴蝶酥', 'top-house-pairing-palmiers', '彌月搭配單品。', 40, 25, 'images/palmiers.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '手工餅乾', 'top-house-pairing-handmade-cookie-2', '彌月搭配單品。', 45, 25, 'images/cookies-2.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '手工餅乾', 'top-house-pairing-handmade-cookie-1', '彌月搭配單品。', 45, 25, 'images/cookies-1.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '栗子燒', 'top-house-pairing-chestnut-cake', '彌月搭配單品。', 60, 25, 'images/chestnut-cake.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '洋菓子（草莓）', 'top-house-pairing-japanese-pastry-strawberry', '彌月搭配單品。', 45, 25, 'images/japanese-pastry-2.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '洋菓子（巧克力）', 'top-house-pairing-japanese-pastry-chocolate', '彌月搭配單品。', 45, 25, 'images/japanese-pastry.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '油飯-1斤', 'top-house-pairing-oil-rice-1-jin', '彌月搭配單品。', 180, 25, 'images/s3.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '油飯-半斤', 'top-house-pairing-oil-rice-half-jin', '彌月搭配單品。', 90, 25, 'images/s4.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '1斤油飯禮盒', 'top-house-pairing-oil-rice-gift-box', '含紅蛋2入。', 260, 25, 'images/s7.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '紅蛋-2入', 'top-house-pairing-red-eggs', '彌月搭配單品。', 30, 25, 'images/s6.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '大雞腿', 'top-house-pairing-chicken-leg', '彌月搭配單品。', 90, 25, 'images/simg-1.jpg', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '紅龜', 'top-house-pairing-red-turtle', '彌月搭配單品。', 45, 25, 'images/red-turtle.png', 1),
  ((SELECT id FROM categories WHERE slug = 'top-house'), '紅圓', 'top-house-pairing-red-round', '彌月搭配單品。', 45, 25, 'images/s24.jpg', 1);

INSERT OR IGNORE INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, image_key, 0, 1
FROM products
WHERE slug LIKE 'top-house-%' AND image_key IS NOT NULL;
