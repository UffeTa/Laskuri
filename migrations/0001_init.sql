-- Laskurit ja kirjautumisyritysten hidastus.
-- Aja paikallisesti: npm run db:migrate:local
-- Aja tuotantoon: npm run db:migrate:remote

CREATE TABLE IF NOT EXISTS counters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  target_time_ms INTEGER NOT NULL,
  start_time_ms INTEGER NOT NULL,
  music_enabled INTEGER NOT NULL DEFAULT 0,
  dance_style TEXT NOT NULL DEFAULT 'groove',
  counter_mode TEXT NOT NULL DEFAULT 'days_hours_seconds',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_counters_updated ON counters (updated_at DESC);

CREATE TABLE IF NOT EXISTS login_attempts (
  ip TEXT PRIMARY KEY,
  failures INTEGER NOT NULL DEFAULT 0,
  window_start INTEGER NOT NULL,
  locked_until INTEGER NOT NULL DEFAULT 0
);
