-- Migration number: 0054 2026-10-18
-- Keep B2B and B2C operational data independent while sharing the catalog for now.

ALTER TABLE users ADD COLUMN storefront_channel TEXT NOT NULL DEFAULT 'b2c';

ALTER TABLE sessions ADD COLUMN storefront_channel TEXT NOT NULL DEFAULT 'b2c';
UPDATE sessions
SET storefront_channel = COALESCE((
  SELECT storefront_channel FROM users WHERE users.id = sessions.user_id
), 'b2c');
CREATE INDEX IF NOT EXISTS idx_sessions_channel_expiry
ON sessions(storefront_channel, expires_at);

ALTER TABLE orders ADD COLUMN storefront_channel TEXT NOT NULL DEFAULT 'b2c';
UPDATE orders
SET storefront_channel = COALESCE((
  SELECT storefront_channel FROM users WHERE users.id = orders.user_id
), 'b2c');
CREATE INDEX IF NOT EXISTS idx_orders_channel_created
ON orders(storefront_channel, created_at DESC);

ALTER TABLE cart_items RENAME TO cart_items_0054_legacy;
CREATE TABLE cart_items (
    storefront_channel TEXT NOT NULL DEFAULT 'b2c',
    guest_id TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    variant_key TEXT NOT NULL DEFAULT '',
    selected_options_json TEXT NOT NULL DEFAULT '{}',
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (storefront_channel, guest_id, product_id, variant_key),
    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);
INSERT INTO cart_items (
  storefront_channel, guest_id, product_id, variant_key,
  selected_options_json, quantity, created_at, updated_at
)
SELECT 'b2c', guest_id, product_id, variant_key,
       selected_options_json, quantity, created_at, updated_at
FROM cart_items_0054_legacy;
DROP TABLE cart_items_0054_legacy;
CREATE INDEX IF NOT EXISTS idx_cart_items_channel_guest
ON cart_items(storefront_channel, guest_id);

ALTER TABLE coupons RENAME TO coupons_0054_legacy;
CREATE TABLE coupons (
    storefront_channel TEXT NOT NULL DEFAULT 'b2c',
    code TEXT NOT NULL,
    label TEXT NOT NULL,
    type TEXT NOT NULL,
    value REAL NOT NULL DEFAULT 0,
    min_amount REAL NOT NULL DEFAULT 0,
    enabled INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (storefront_channel, code)
);
INSERT INTO coupons (storefront_channel, code, label, type, value, min_amount, enabled, updated_at)
SELECT 'b2c', code, label, type, value, min_amount, enabled, updated_at
FROM coupons_0054_legacy;
INSERT INTO coupons (storefront_channel, code, label, type, value, min_amount, enabled, updated_at)
SELECT 'b2b', code, label, type, value, min_amount, enabled, updated_at
FROM coupons_0054_legacy;
DROP TABLE coupons_0054_legacy;
CREATE INDEX IF NOT EXISTS idx_coupons_channel_updated
ON coupons(storefront_channel, updated_at DESC);

ALTER TABLE legacy_records RENAME TO legacy_records_0054_legacy;
CREATE TABLE legacy_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    storefront_channel TEXT NOT NULL DEFAULT 'b2c',
    entity_type TEXT NOT NULL,
    source_key TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (storefront_channel, entity_type, source_key)
);
INSERT INTO legacy_records (
  storefront_channel, entity_type, source_key, payload_json, created_at, updated_at
)
SELECT 'b2c', entity_type, source_key, payload_json, created_at, updated_at
FROM legacy_records_0054_legacy;
DROP TABLE legacy_records_0054_legacy;
CREATE INDEX IF NOT EXISTS idx_legacy_records_channel_type
ON legacy_records(storefront_channel, entity_type, updated_at DESC);

ALTER TABLE engagement_records ADD COLUMN storefront_channel TEXT NOT NULL DEFAULT 'b2c';
CREATE INDEX IF NOT EXISTS idx_engagement_records_channel_type
ON engagement_records(storefront_channel, record_type, created_at DESC);

ALTER TABLE member_point_transactions ADD COLUMN storefront_channel TEXT NOT NULL DEFAULT 'b2c';
UPDATE member_point_transactions
SET storefront_channel = COALESCE((
  SELECT storefront_channel FROM users WHERE users.id = member_point_transactions.user_id
), 'b2c');
DROP INDEX IF EXISTS idx_member_point_transactions_source;
CREATE UNIQUE INDEX IF NOT EXISTS idx_member_point_transactions_source
ON member_point_transactions(storefront_channel, source_type, source_id)
WHERE source_id IS NOT NULL;

ALTER TABLE member_point_rules RENAME TO member_point_rules_0054_legacy;
CREATE TABLE member_point_rules (
    storefront_channel TEXT NOT NULL DEFAULT 'b2c',
    id INTEGER NOT NULL CHECK (id = 1),
    enabled INTEGER NOT NULL DEFAULT 0,
    spend_amount INTEGER NOT NULL DEFAULT 100,
    earn_points INTEGER NOT NULL DEFAULT 1,
    minimum_order_amount INTEGER NOT NULL DEFAULT 0,
    redeem_points INTEGER NOT NULL DEFAULT 1,
    redeem_amount INTEGER NOT NULL DEFAULT 1,
    description TEXT NOT NULL DEFAULT '訂單完成後依規則發放紅利點數。',
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (storefront_channel, id)
);
INSERT INTO member_point_rules (
  storefront_channel, id, enabled, spend_amount, earn_points,
  minimum_order_amount, redeem_points, redeem_amount, description, updated_at
)
SELECT 'b2c', id, enabled, spend_amount, earn_points,
       minimum_order_amount, redeem_points, redeem_amount, description, updated_at
FROM member_point_rules_0054_legacy;
INSERT INTO member_point_rules (
  storefront_channel, id, enabled, spend_amount, earn_points,
  minimum_order_amount, redeem_points, redeem_amount, description, updated_at
)
SELECT 'b2b', id, enabled, spend_amount, earn_points,
       minimum_order_amount, redeem_points, redeem_amount, description, updated_at
FROM member_point_rules_0054_legacy;
DROP TABLE member_point_rules_0054_legacy;
