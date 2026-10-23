-- Migration number: 0049  2026-10-23
-- Restore the Sensen employee account after the shared Nooboo/Sensen data was separated.
-- Keep the existing row and its related records, but put the Sensen identity back.

UPDATE users
SET name = '管理員',
    email = 'admin@sensen.local',
    role = 'admin',
    storefront_channel = 'b2c',
    password_salt = '48498e29ce68865eb84fd30ed153264d',
    password_hash = '6b07c03531d89bc3663efa33bb54eecec627d1888aed7ac96eecd033e0bef5ab1efb80fac3e21b215ff6dd469aaf8b5ad8dff3d93084a7b16cc2f492541d5f1a',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 27
  AND lower(email) = 'admin@nooboo.local';
