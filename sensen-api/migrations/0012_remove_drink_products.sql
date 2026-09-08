-- Remove drink products from the inventory after the drink menu was retired.
PRAGMA foreign_keys = ON;

DELETE FROM product_images
WHERE product_id IN (
  SELECT p.id
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
  WHERE c.slug = '飲品-menu'
     OR c.name = '飲品 MENU'
     OR p.slug LIKE 'drink-%'
);

DELETE FROM products
WHERE id IN (
  SELECT p.id
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
  WHERE c.slug = '飲品-menu'
     OR c.name = '飲品 MENU'
     OR p.slug LIKE 'drink-%'
);
