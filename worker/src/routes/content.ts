import { error, json } from 'itty-router';
import type { Env } from '../types';
import { getTodayEpisode, getEpisode, getLibrary, getSegments, getVocabulary } from '../db/queries';

export const contentRoutes = {
  async today(req: Request, env: Env) {
    const url = new URL(req.url);
    const userId = url.searchParams.get('user');
    if (!userId) return error(400, { error: 'user required' });

    const date = new Date().toISOString().split('T')[0];
    const ep = await getTodayEpisode(env, userId, date);

    if (!ep) return error(404, { error: 'No content for today' });

    const segments = await getSegments(env, ep.id);
    const vocabulary = await getVocabulary(env, ep.id);

    return json({ episode: ep, segments, vocabulary });
  },

  async getOne(req: Request, env: Env) {
    const ep = await getEpisode(env, req.params.id);
    if (!ep) return error(404, { error: 'Not found' });

    const segments = await getSegments(env, ep.id);
    const vocabulary = await getVocabulary(env, ep.id);

    return json({ episode: ep, segments, vocabulary });
  },

  async library(req: Request, env: Env) {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '30');
    const episodes = await getLibrary(env, limit);
    return json({ episodes });
  }
};
