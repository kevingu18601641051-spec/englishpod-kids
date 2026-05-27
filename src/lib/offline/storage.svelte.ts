import Dexie, { type Table } from 'dexie';
import type { Episode, Segment, VocabItem, DailyProgress, WordInteraction } from '$lib/types';

class EnglishPodDB extends Dexie {
  episodes!: Table<Episode, string>;
  segments!: Table<Segment & { episodeId: string }, number>;
  vocabulary!: Table<VocabItem & { episodeId: string }, number>;
  progress!: Table<DailyProgress, number>;
  interactions!: Table<WordInteraction, number>;

  constructor() {
    super('englishpod-kids');

    this.version(1).stores({
      episodes: 'id, topic, difficulty, status',
      segments: '++id, episodeId, seq',
      vocabulary: '++id, episodeId, word',
      progress: '++id, userId, date, episodeId',
      interactions: '++id, userId, word'
    });
  }
}

let db: EnglishPodDB | null = null;

function getDB(): EnglishPodDB {
  if (!db) db = new EnglishPodDB();
  return db;
}

export async function cacheEpisode(
  episode: Episode,
  segments: Segment[],
  vocab: VocabItem[]
) {
  const d = getDB();
  await d.episodes.put(episode);

  // Delete old segments/vocab for this episode
  await d.segments.where('episodeId').equals(episode.id).delete();
  await d.vocabulary.where('episodeId').equals(episode.id).delete();

  await d.segments.bulkAdd(
    segments.map((s) => ({ ...s, episodeId: episode.id }))
  );
  await d.vocabulary.bulkAdd(
    vocab.map((v) => ({ ...v, episodeId: episode.id }))
  );
}

export async function getCachedEpisode(id: string) {
  const d = getDB();
  const episode = await d.episodes.get(id);
  if (!episode) return null;
  const segments = await d.segments.where('episodeId').equals(id).sortBy('seq');
  const vocabulary = await d.vocabulary.where('episodeId').equals(id).toArray();
  return { episode, segments, vocabulary };
}

export async function getCachedEpisodes(limit = 30) {
  const d = getDB();
  return d.episodes.orderBy('publishedAt').reverse().limit(limit).toArray();
}

export async function saveProgress(p: DailyProgress) {
  const d = getDB();
  await d.progress.put(p);
}

export async function getProgress(userId: string, date: string) {
  const d = getDB();
  return d.progress.where({ userId, date }).first();
}

export async function getRecentProgress(userId: string, days = 7) {
  const d = getDB();
  return d.progress.where('userId').equals(userId).reverse().sortBy('date');
}

export async function recordLookup(
  userId: string,
  word: string,
  episodeId: string,
  contextSentence: string
) {
  const d = getDB();
  const existing = await d.interactions.where({ userId, word }).first();

  if (existing) {
    await d.interactions.update(existing.id!, {
      lookupCount: existing.lookupCount + 1,
      lastLookup: new Date().toISOString(),
      familiarity: Math.min(5, existing.familiarity + 1)
    });
  } else {
    await d.interactions.add({
      userId,
      word,
      episodeId,
      firstSeen: contextSentence,
      lookupCount: 1,
      lastLookup: new Date().toISOString(),
      familiarity: 1
    });
  }
}

export async function getLearnedWords(userId: string) {
  const d = getDB();
  return d.interactions.where('userId').equals(userId).reverse().sortBy('familiarity');
}

export async function getStorageEstimate() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const est = await navigator.storage.estimate();
    return {
      usage: est.usage ?? 0,
      quota: est.quota ?? 0
    };
  }
  return { usage: 0, quota: 0 };
}
