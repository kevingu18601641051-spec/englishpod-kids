import { error, json } from 'itty-router';
import type { Env } from '../types';
import { getLibrary } from '../db/queries';

export const scheduleRoutes = {
  async precache(req: Request, env: Env) {
    const url = new URL(req.url);
    const userId = url.searchParams.get('user');
    if (!userId) return error(400, { error: 'user required' });

    const episodes = await getLibrary(env, 3);
    const audioUrls = episodes.map(e => e.audio_url);

    return json({ episodes, audioUrls });
  },

  async confirm(_req: Request, _env: Env) {
    return json({ ok: true });
  }
};
