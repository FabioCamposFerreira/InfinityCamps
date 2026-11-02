-- D1 schema for InfinityCamps
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password_hash TEXT,
  role TEXT DEFAULT 'student',
  status TEXT DEFAULT 'pending', -- pending / approved / blocked
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT,
  correct_answer TEXT
);

CREATE TABLE IF NOT EXISTS user_exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  exercise_id INTEGER,
  answer TEXT,
  correct INTEGER DEFAULT 0,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  chapter_id TEXT,
  viewed INTEGER DEFAULT 0,
  completed INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
