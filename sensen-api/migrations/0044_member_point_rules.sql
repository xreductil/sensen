-- Migration number: 0044  2026-10-01
-- Configurable reward-point rules managed by staff.

CREATE TABLE IF NOT EXISTS member_point_rules (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    enabled INTEGER NOT NULL DEFAULT 0,
    spend_amount INTEGER NOT NULL DEFAULT 100,
    earn_points INTEGER NOT NULL DEFAULT 1,
    minimum_order_amount INTEGER NOT NULL DEFAULT 0,
    redeem_points INTEGER NOT NULL DEFAULT 1,
    redeem_amount INTEGER NOT NULL DEFAULT 1,
    description TEXT NOT NULL DEFAULT '訂單完成後依規則發放紅利點數。',
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO member_point_rules (
    id, enabled, spend_amount, earn_points, minimum_order_amount,
    redeem_points, redeem_amount, description
)
VALUES (1, 0, 100, 1, 0, 1, 1, '訂單完成後依規則發放紅利點數。')
ON CONFLICT(id) DO NOTHING;

CREATE UNIQUE INDEX IF NOT EXISTS idx_member_point_transactions_source
ON member_point_transactions(source_type, source_id)
WHERE source_id IS NOT NULL;
