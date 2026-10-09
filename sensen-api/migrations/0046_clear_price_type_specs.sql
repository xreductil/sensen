-- Migration number: 0046  2026-10-10
-- Remove legacy price-type labels that were incorrectly stored as product specs.
UPDATE products
SET metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.spec', '')
WHERE json_extract(metadata_json, '$.spec') IN ('原價', '特價', '不指定', '售價');

UPDATE products
SET metadata_json = json_set(COALESCE(NULLIF(metadata_json, ''), '{}'), '$.size', '')
WHERE json_extract(metadata_json, '$.size') IN ('原價', '特價', '不指定', '售價');
