-- Migration number: 0045  2026-10-09
-- Remove only the legacy 10-inch/12-inch entries from the affected size text.
-- Other products, specifications, and price options are not changed.
UPDATE products
SET metadata_json = json_set(
  COALESCE(NULLIF(metadata_json, ''), '{}'),
  '$.size', '6吋、8吋',
  '$.spec', '6吋、8吋'
)
WHERE json_extract(metadata_json, '$.size') IN (
    '6吋、8吋 、10吋、12吋',
    '6吋、8吋、10吋、12吋',
    '6吋、8吋 、10吋~20吋'
  )
  OR json_extract(metadata_json, '$.spec') IN (
    '6吋、8吋 、10吋、12吋',
    '6吋、8吋、10吋、12吋',
    '6吋、8吋 、10吋~20吋'
  );
