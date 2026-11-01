-- Profile fields synchronized from LINE after a successful LINE Login.

ALTER TABLE users ADD COLUMN line_display_name TEXT;
ALTER TABLE users ADD COLUMN line_picture_url TEXT;
ALTER TABLE users ADD COLUMN line_status_message TEXT;
