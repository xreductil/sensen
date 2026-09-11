-- Migration number: 0020  2026-09-12
-- Allow the same product to be added to the cart with different size prices.

ALTER TABLE cart_items RENAME TO cart_items_legacy;
DROP INDEX IF EXISTS idx_cart_items_guest;

CREATE TABLE cart_items (
    guest_id TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    variant_key TEXT NOT NULL DEFAULT '',
    selected_options_json TEXT NOT NULL DEFAULT '{}',
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (guest_id, product_id, variant_key),
    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);

INSERT INTO cart_items (guest_id, product_id, variant_key, selected_options_json, quantity, created_at, updated_at)
SELECT guest_id, product_id, '', '{}', quantity, created_at, updated_at
FROM cart_items_legacy;

DROP TABLE cart_items_legacy;

CREATE INDEX IF NOT EXISTS idx_cart_items_guest
ON cart_items(guest_id);
