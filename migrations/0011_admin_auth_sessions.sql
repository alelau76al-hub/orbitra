ALTER TABLE admin_users ADD COLUMN password_hash TEXT;
ALTER TABLE admin_users ADD COLUMN password_salt TEXT;
ALTER TABLE admin_users ADD COLUMN password_iterations INTEGER DEFAULT 150000;
ALTER TABLE admin_users ADD COLUMN last_login_at TEXT;

CREATE TABLE IF NOT EXISTS admin_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_user_id INTEGER NOT NULL,
  session_token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT,
  revoked_at TEXT,
  FOREIGN KEY(admin_user_id) REFERENCES admin_users(id)
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token
ON admin_sessions (session_token_hash);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_user
ON admin_sessions (admin_user_id, expires_at);
