import { error, json } from 'itty-router';
import type { Env } from '../types';
import { createUser, getUser, updateUserDifficulty } from '../db/queries';

export const userRoutes = {
  async init(req: Request, env: Env) {
    const body: any = await req.json();
    if (!body.id) return error(400, { error: 'id required' });

    await createUser(env, body.id);
    return json({ ok: true });
  },

  async settingsUpdate(req: Request, env: Env) {
    const body: any = await req.json();
    if (!body.user) return error(400, { error: 'user required' });

    if (body.commuteTime) {
      await env.DB.prepare('UPDATE users SET commute_time = ? WHERE id = ?')
        .bind(body.commuteTime, body.user).run();
    }
    if (body.topicPrefs) {
      await env.DB.prepare('UPDATE users SET topic_preferences = ? WHERE id = ?')
        .bind(JSON.stringify(body.topicPrefs), body.user).run();
    }
    if (body.difficultyLevel) {
      await updateUserDifficulty(env, body.user, body.difficultyLevel);
    }

    return json({ ok: true });
  },

  async stats(req: Request, env: Env) {
    const url = new URL(req.url);
    const userId = url.searchParams.get('user');
    if (!userId) return error(400, { error: 'user required' });

    const user = await getUser(env, userId);
    if (!user) return error(404, { error: 'User not found' });

    return json({
      difficultyLevel: user.difficulty_level,
      streakDays: user.streak_days,
      totalMinutes: user.total_listen_minutes,
      commuteTime: user.commute_time
    });
  }
};
