import type { Env, Topic } from '../types';
import { TOPICS } from '../types';
import { generateEpisode, saveEpisodeToDB } from './generator';
import { getRecentProgress, countEpisodesByDate, createRecommendation, getUser } from '../db/queries';
import { computeDifficultyAdjustment } from '../lib/difficulty';

export async function runDailyPipeline(env: Env): Promise<{ ok: boolean; details: string }> {
  const dateStr = new Date().toISOString().split('T')[0];

  // Check if we already have content for today
  const count = await countEpisodesByDate(env, dateStr);
  if (count > 0) {
    console.log(`Already have ${count} episodes for ${dateStr}, skipping generation`);
    return { ok: true, details: `Skipped: ${count} episodes already exist for ${dateStr}` };
  }

  // Topic rotation: based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const topic: Topic = TOPICS[dayOfYear % TOPICS.length];

  // Generate at 3 difficulty levels to cover all users
  const results: string[] = [];

  for (const difficulty of [3, 5, 7]) {
    try {
      console.log(`Generating episode: topic=${topic}, difficulty=${difficulty}`);
      const { episode, segments, vocabulary } = await generateEpisode(env, topic, difficulty);
      await saveEpisodeToDB(env, episode, segments, vocabulary);

      // Create recommendations for users at this difficulty level
      const users = await env.DB.prepare(
        'SELECT id FROM users WHERE difficulty_level BETWEEN ? AND ?'
      ).bind(difficulty - 1, difficulty + 1).all<{ id: string }>();

      for (const user of users.results) {
        await createRecommendation(env, user.id, dateStr, episode.id, `Matched difficulty ${difficulty}`);
      }

      results.push(`difficulty=${difficulty}: "${episode.title}"`);
      console.log('Episode saved:', episode.id, episode.title);
    } catch (e: any) {
      console.error(`Failed generating difficulty ${difficulty}:`, e.message);
      results.push(`difficulty=${difficulty}: FAILED - ${e.message}`);
    }
  }

  return {
    ok: results.some(r => !r.includes('FAILED')),
    details: `Generated ${dateStr} topic=${topic}: ${results.join(' | ')}`
  };
}
