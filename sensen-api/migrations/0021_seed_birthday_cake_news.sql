-- Publish the birthday cake content in the latest-news category.
-- The insert is idempotent so it is safe to apply once per environment.

INSERT INTO news
  (id, title, slug, category, excerpt, content, image_key, publish_at, is_published)
SELECT
  'birthday-cake-2026',
  '生日蛋糕',
  'birthday-cake-2026',
  'sensen-coffee',
  '森森點心坊提供多款生日蛋糕，歡迎依照口味與尺寸選擇，訂購前請洽門市確認。',
  '森森點心坊不定期推出各式生日蛋糕，從經典口味到季節限定款，陪你一起慶祝每個重要時刻。' || char(10) || char(10) || '蛋糕口味、造型與裝飾會依季節及門市供應調整，歡迎訂購前先洽門市確認。' || char(10) || char(10) || '歡迎持續關注森森點心坊最新消息，選一份喜歡的蛋糕，為生日留下甜甜的回憶。',
  'images/photo-1-9.jpg',
  '2026-09-12T00:00:00.000Z',
  1
WHERE NOT EXISTS (
  SELECT 1 FROM news WHERE id = 'birthday-cake-2026'
);
