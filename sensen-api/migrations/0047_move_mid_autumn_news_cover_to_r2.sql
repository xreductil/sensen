-- Keep the published news cover entirely inside R2.
UPDATE news
SET image_key = '/images/photo-1-8.jpg'
WHERE id = 'news-mtn5alyj'
  AND image_key LIKE '%legacy-news%';
