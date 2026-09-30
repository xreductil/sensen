-- Migration number: 0043  2026-10-01
-- Member reward-point ledger used by the customer centre.

CREATE TABLE IF NOT EXISTS member_point_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    points INTEGER NOT NULL,
    description TEXT NOT NULL,
    source_type TEXT NOT NULL DEFAULT 'manual',
    source_id TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_member_point_transactions_user_created
ON member_point_transactions(user_id, created_at DESC);
