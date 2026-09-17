-- Migration number: 0033  2026-09-18
-- LINE Pay production payment tracking for customer orders.

ALTER TABLE orders ADD COLUMN payment_method TEXT;
ALTER TABLE orders ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'unpaid';
ALTER TABLE orders ADD COLUMN payment_transaction_id TEXT;
ALTER TABLE orders ADD COLUMN payment_request_id TEXT;
ALTER TABLE orders ADD COLUMN payment_url TEXT;
ALTER TABLE orders ADD COLUMN paid_at TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_payment_transaction
ON orders(payment_transaction_id);
