-- Add the six long-cake products requested for the online商城.
PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO categories (name, slug)
VALUES ('長條蛋糕', 'long-cake');

INSERT OR IGNORE INTO products (
  category_id, name, slug, description, price, stock, image_key, is_active, metadata_json
)
VALUES
  ((SELECT id FROM categories WHERE slug = 'long-cake'), '芋香肉鬆', 'long-cake-taro-pork', '大甲芋泥餡、香酥肉鬆。', 200, 25, 'images/long-cake-taro-pork.jpg', 1, '{"priceValue":200,"day":5,"size":"長條蛋糕","storage":"冷藏","dietary":"蛋奶素","img":"/assets/images/long-cake-taro-pork.jpg","desc":"大甲芋泥餡、香酥肉鬆。"}'),
  ((SELECT id FROM categories WHERE slug = 'long-cake'), '香芋布丁捲', 'long-cake-taro-pudding', '大甲芋泥餡、香草布丁。', 200, 25, 'images/long-cake-taro-pudding.jpg', 1, '{"priceValue":200,"day":5,"size":"長條蛋糕","storage":"冷藏","dietary":"蛋奶素","img":"/assets/images/long-cake-taro-pudding.jpg","desc":"大甲芋泥餡、香草布丁。"}'),
  ((SELECT id FROM categories WHERE slug = 'long-cake'), '香草拿破崙', 'long-cake-vanilla-napoleon', '香草蛋糕體、千層派皮。', 220, 25, 'images/long-cake-vanilla-napoleon.jpg', 1, '{"priceValue":220,"day":5,"size":"長條蛋糕","storage":"冷藏","dietary":"蛋奶素","img":"/assets/images/long-cake-vanilla-napoleon.jpg","desc":"香草蛋糕體、千層派皮。"}'),
  ((SELECT id FROM categories WHERE slug = 'long-cake'), '巧克力拿破崙', 'long-cake-chocolate-napoleon', '巧克力蛋糕體、千層派皮。', 200, 25, 'images/long-cake-chocolate-napoleon.jpg', 1, '{"priceValue":200,"day":5,"size":"長條蛋糕","storage":"冷藏","dietary":"蛋奶素","img":"/assets/images/long-cake-chocolate-napoleon.jpg","desc":"巧克力蛋糕體、千層派皮。"}'),
  ((SELECT id FROM categories WHERE slug = 'long-cake'), '蜂蜜蛋糕', 'long-cake-honey-cake', '內餡：無。', 160, 25, 'images/long-cake-honey-cake.jpg', 1, '{"priceValue":160,"day":5,"size":"長條蛋糕","storage":"冷藏","dietary":"蛋奶素","img":"/assets/images/long-cake-honey-cake.jpg","desc":"內餡：無。"}'),
  ((SELECT id FROM categories WHERE slug = 'long-cake'), '黑森林', 'long-cake-black-forest', '藍莓生奶油。', 200, 25, 'images/long-cake-black-forest.jpg', 1, '{"priceValue":200,"day":5,"size":"長條蛋糕","storage":"冷藏","dietary":"蛋奶素","img":"/assets/images/long-cake-black-forest.jpg","desc":"藍莓生奶油。"}');

INSERT OR IGNORE INTO product_images (product_id, image_key, sort_order, is_primary)
SELECT id, image_key, 0, 1
FROM products
WHERE slug IN (
  'long-cake-taro-pork',
  'long-cake-taro-pudding',
  'long-cake-vanilla-napoleon',
  'long-cake-chocolate-napoleon',
  'long-cake-honey-cake',
  'long-cake-black-forest'
);
