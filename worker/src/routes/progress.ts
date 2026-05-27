import { error, json } from 'itty-router';
import type { Env } from '../types';
import { saveProgress, getRecentProgress, recordLookup, updateUserStreak, getUser } from '../db/queries';

export const progressRoutes = {
  async session(req: Request, env: Env) {
    const body: any = await req.json();
    if (!body.user || !body.episode) return error(400, { error: 'user and episode required' });

    await saveProgress(env, {
      user_id: body.user,
      date: new Date().toISOString().split('T')[0],
      episode_id: body.episode,
      listen_seconds: body.listenSeconds ?? 0,
      completed: body.completed ? 1 : 0,
      avg_speed: body.avgSpeed ?? 1.0,
      lookups: body.lookups ?? 0,
      replay_count: body.replayCount ?? 0
    });

    const user = await getUser(env, body.user);
    const newStreak = (user?.streak_days ?? 0) + 1;
    const totalMin = (user?.total_listen_minutes ?? 0) + Math.round((body.listenSeconds ?? 0) / 60);

    await updateUserStreak(env, body.user, newStreak, totalMin);

    return json({ ok: true, streakDays: newStreak });
  },

  async lookup(req: Request, env: Env) {
    const body: any = await req.json();
    if (!body.user || !body.word || !body.episode) return error(400, { error: 'user, word, episode required' });

    await recordLookup(env, body.user, body.word, body.episode, body.contextSentence ?? '');

    return json({ ok: true });
  },

  async stats(req: Request, env: Env) {
    const url = new URL(req.url);
    const userId = url.searchParams.get('user');
    if (!userId) return error(400, { error: 'user required' });

    const user = await getUser(env, userId);
    const recent = await getRecentProgress(env, userId, 7);

    return json({
      streakDays: user?.streak_days ?? 0,
      totalMinutes: user?.total_listen_minutes ?? 0,
      recentActivity: recent
    });
  }
};
