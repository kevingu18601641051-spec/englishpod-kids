import type { Env, Episode, Segment, VocabItem, User, DailyProgress } from '../types';

export async function getUser(env: Env, userId: string): Promise<User | null> {
  return env.DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(userId).first<User>();
}

export async function createUser(env: Env, userId: string) {
  return env.DB.prepare('INSERT OR IGNORE INTO users (id) VALUES (?)')
    .bind(userId).run();
}

export async function updateUserDifficulty(env: Env, userId: string, level: number) {
  return env.DB.prepare('UPDATE users SET difficulty_level = ? WHERE id = ?')
    .bind(level, userId).run();
}

export async function updateUserStreak(env: Env, userId: string, streak: number, totalMin: number) {
  return env.DB.prepare('UPDATE users SET streak_days = ?, total_listen_minutes = ?, last_active = datetime(\'now\') WHERE id = ?')
    .bind(streak, totalMin, userId).run();
}

export async function getTodayEpisode(env: Env, userId: string, date: string): Promise<Episode | null> {
  return env.DB.prepare(`
    SELECT e.* FROM episodes e
    JOIN daily_recommendations dr ON e.id = dr.episode_id
    WHERE dr.user_id = ? AND dr.date = ?
    ORDER BY dr.slot ASC LIMIT 1
  `).bind(userId, date).first<Episode>();
}

export async function getEpisode(env: Env, id: string): Promise<Episode | null> {
  return env.DB.prepare('SELECT * FROM episodes WHERE id = ?')
    .bind(id).first<Episode>();
}

export async function getLibrary(env: Env, limit = 30): Promise<Episode[]> {
  return env.DB.prepare('SELECT * FROM episodes ORDER BY published_at DESC LIMIT ?')
    .bind(limit).all<Episode>().then(r => r.results);
}

export async function insertEpisode(env: Env, ep: Episode): Promise<D1Result> {
  return env.DB.prepare(`
    INSERT OR REPLACE INTO episodes (id, title, title_cn, description, difficulty, topic, duration_sec, audio_url, total_words, unique_words, status, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(ep.id, ep.title, ep.title_cn, ep.description, ep.difficulty, ep.topic, ep.duration_sec, ep.audio_url, ep.total_words, ep.unique_words, ep.status, ep.published_at).run();
}

export async function insertSegments(env: Env, episodeId: string, segs: Segment[]): Promise<D1Result> {
  const stmt = env.DB.prepare('INSERT INTO segments (episode_id, seq, start_time, end_time, text, text_cn, is_song) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const batch = segs.map(s => stmt.bind(episodeId, s.seq, s.start_time, s.end_time, s.text, s.text_cn, s.is_song));
  return env.DB.batch(batch);
}

export async function insertVocabulary(env: Env, episodeId: string, vocab: VocabItem[]): Promise<D1Result> {
  const stmt = env.DB.prepare('INSERT OR REPLACE INTO episode_vocabulary (episode_id, word, definition_cn, pronunciation, part_of_speech, difficulty) VALUES (?, ?, ?, ?, ?, ?)');
  const batch = vocab.map(v => stmt.bind(episodeId, v.word, v.definition_cn, v.pronunciation, v.part_of_speech, v.difficulty));
  return env.DB.batch(batch);
}

export async function getSegments(env: Env, episodeId: string): Promise<Segment[]> {
  return env.DB.prepare('SELECT * FROM segments WHERE episode_id = ? ORDER BY seq')
    .bind(episodeId).all<Segment>().then(r => r.results);
}

export async function getVocabulary(env: Env, episodeId: string): Promise<VocabItem[]> {
  return env.DB.prepare('SELECT * FROM episode_vocabulary WHERE episode_id = ?')
    .bind(episodeId).all<VocabItem>().then(r => r.results);
}

export async function saveProgress(env: Env, p: DailyProgress): Promise<D1Result> {
  return env.DB.prepare(`
    INSERT OR REPLACE INTO daily_progress (user_id, date, episode_id, listen_seconds, completed, avg_speed, lookups, replay_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(p.user_id, p.date, p.episode_id, p.listen_seconds, p.completed, p.avg_speed, p.lookups, p.replay_count).run();
}

export async function getRecentProgress(env: Env, userId: string, days = 7) {
  return env.DB.prepare(`
    SELECT * FROM daily_progress WHERE user_id = ? AND date >= date('now', ?)
    ORDER BY date DESC
  `).bind(userId, `-${days} days`).all<DailyProgress>().then(r => r.results);
}

export async function recordLookup(env: Env, userId: string, word: string, episodeId: string, sentence: string): Promise<D1Result> {
  const existing = await env.DB.prepare('SELECT * FROM word_interactions WHERE user_id = ? AND word = ?')
    .bind(userId, word).first<{ id: number; lookup_count: number; familiarity: number }>();

  if (existing) {
    return env.DB.prepare('UPDATE word_interactions SET lookup_count = ?, last_lookup = datetime(\'now\'), familiarity = ? WHERE id = ?')
      .bind(existing.lookup_count + 1, Math.min(5, existing.familiarity + 1), existing.id).run();
  }
  return env.DB.prepare('INSERT INTO word_interactions (user_id, word, first_seen, episode_id, lookup_count, familiarity) VALUES (?, ?, ?, ?, 1, 1)')
    .bind(userId, word, sentence, episodeId).run();
}

export async function createRecommendation(env: Env, userId: string, date: string, episodeId: string, reason: string): Promise<D1Result> {
  return env.DB.prepare('INSERT OR REPLACE INTO daily_recommendations (user_id, date, episode_id, slot, reason) VALUES (?, ?, ?, 1, ?)')
    .bind(userId, date, episodeId, reason).run();
}

export async function lookupWordInDict(env: Env, word: string): Promise<VocabItem | null> {
  return env.DB.prepare('SELECT * FROM episode_vocabulary WHERE word = ? LIMIT 1')
    .bind(word).first<VocabItem>();
}

export async function countEpisodesByDate(env: Env, date: string): Promise<number> {
  return env.DB.prepare('SELECT COUNT(*) as count FROM episodes WHERE published_at = ?')
    .bind(date).first<{ count: number }>().then(r => r?.count ?? 0);
}
