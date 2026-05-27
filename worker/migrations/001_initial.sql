CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  last_active   TEXT,
  difficulty_level INTEGER NOT NULL DEFAULT 5,
  topic_preferences TEXT DEFAULT '[]',
  commute_time  TEXT DEFAULT '08:00',
  timezone      TEXT DEFAULT 'Asia/Shanghai',
  streak_days   INTEGER NOT NULL DEFAULT 0,
  total_listen_minutes INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS episodes (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  title_cn        TEXT,
  description     TEXT,
  difficulty      INTEGER NOT NULL,
  topic           TEXT NOT NULL,
  duration_sec    INTEGER NOT NULL,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  published_at    TEXT,
  audio_url       TEXT NOT NULL,
  cover_url       TEXT,
  illustration_prompt TEXT,
  total_words     INTEGER,
  unique_words    INTEGER,
  status          TEXT DEFAULT 'ready'
);

CREATE TABLE IF NOT EXISTS segments (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  episode_id  TEXT NOT NULL REFERENCES episodes(id),
  seq         INTEGER NOT NULL,
  start_time  REAL NOT NULL,
  end_time    REAL NOT NULL,
  text        TEXT NOT NULL,
  text_cn     TEXT,
  is_song     INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_segments_episode ON segments(episode_id, seq);

CREATE TABLE IF NOT EXISTS episode_vocabulary (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  episode_id    TEXT NOT NULL REFERENCES episodes(id),
  word          TEXT NOT NULL,
  definition_cn TEXT NOT NULL,
  pronunciation TEXT,
  part_of_speech TEXT,
  difficulty    INTEGER DEFAULT 1,
  UNIQUE(episode_id, word)
);
CREATE INDEX IF NOT EXISTS idx_vocab_episode ON episode_vocabulary(episode_id);

CREATE TABLE IF NOT EXISTS daily_progress (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id           TEXT NOT NULL REFERENCES users(id),
  date              TEXT NOT NULL,
  episode_id        TEXT NOT NULL REFERENCES episodes(id),
  listen_seconds    INTEGER NOT NULL DEFAULT 0,
  completed         INTEGER DEFAULT 0,
  avg_speed         REAL DEFAULT 1.0,
  lookups           INTEGER DEFAULT 0,
  replay_count      INTEGER DEFAULT 0,
  created_at        TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, date, episode_id)
);
CREATE INDEX IF NOT EXISTS idx_progress_user_date ON daily_progress(user_id, date);

CREATE TABLE IF NOT EXISTS word_interactions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       TEXT NOT NULL REFERENCES users(id),
  word          TEXT NOT NULL,
  first_seen    TEXT NOT NULL,
  episode_id    TEXT NOT NULL,
  lookup_count  INTEGER DEFAULT 1,
  last_lookup   TEXT DEFAULT (datetime('now')),
  familiarity   INTEGER DEFAULT 1,
  UNIQUE(user_id, word)
);
CREATE INDEX IF NOT EXISTS idx_word_interactions_user ON word_interactions(user_id);

CREATE TABLE IF NOT EXISTS daily_recommendations (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       TEXT NOT NULL REFERENCES users(id),
  date          TEXT NOT NULL,
  episode_id    TEXT NOT NULL REFERENCES episodes(id),
  slot          INTEGER DEFAULT 1,
  reason        TEXT,
  UNIQUE(user_id, date, slot)
);
CREATE INDEX IF NOT EXISTS idx_daily_rec_user_date ON daily_recommendations(user_id, date);

CREATE TABLE IF NOT EXISTS user_settings (
  user_id    TEXT PRIMARY KEY REFERENCES users(id),
  settings   TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT DEFAULT (datetime('now'))
);
