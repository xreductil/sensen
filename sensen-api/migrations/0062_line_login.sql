-- LINE Login identity mapping and short-lived OAuth state storage.
-- The production users table already contains line_user_id from the existing
-- account integration schema; this migration adds the constraints/state store.

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_line_user_id
ON users(line_user_id)
WHERE line_user_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS line_login_states (
    state TEXT PRIMARY KEY,
    nonce TEXT NOT NULL,
    return_to TEXT NOT NULL DEFAULT '/customer/admin/backup/',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_line_login_states_created_at
ON line_login_states(created_at);
