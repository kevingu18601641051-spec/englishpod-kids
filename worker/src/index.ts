import { AutoRouter, cors, error, json } from 'itty-router';
import type { Env } from './types';
import { contentRoutes } from './routes/content';
import { progressRoutes } from './routes/progress';
import { dictionaryRoutes } from './routes/dictionary';
import { scheduleRoutes } from './routes/schedule';
import { userRoutes } from './routes/user';
import { runDailyPipeline } from './pipeline/daily';

const { preflight, corsify } = cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
});

const router = AutoRouter({
  before: [preflight],
  finally: [corsify]
});

// Health check
router.get('/api/health', () => json({ ok: true, time: new Date().toISOString() }));

// Content
router.get('/api/content/today', contentRoutes.today);
router.get('/api/content/library', contentRoutes.library);
router.get('/api/content/:id', contentRoutes.getOne);

// Progress
router.post('/api/progress/session', progressRoutes.session);
router.post('/api/progress/lookup', progressRoutes.lookup);
router.get('/api/progress/stats', progressRoutes.stats);

// Dictionary
router.get('/api/dictionary/lookup', dictionaryRoutes.lookup);

// Schedule
router.get('/api/schedule/precache', scheduleRoutes.precache);
router.post('/api/schedule/precache/confirm', scheduleRoutes.confirm);

// User
router.post('/api/user/init', userRoutes.init);
router.put('/api/user/settings', userRoutes.settingsUpdate);
router.get('/api/user/stats', userRoutes.stats);

// Cron trigger for daily content generation
router.get('/api/cron/daily', async (req, env: Env) => {
  const key = req.query?.key;
  if (key !== env.API_KEY) {
    return new Response('Unauthorized', { status: 401 });
  }
  try {
    const result = await runDailyPipeline(env);
    return json(result);
  } catch (e: any) {
    return error(500, { error: e.message });
  }
});

// Scheduled trigger (Cloudflare Cron)
export default {
  async fetch(req: Request, env: Env) {
    return router.fetch(req, env);
  },
  async scheduled(_event: ScheduledEvent, env: Env) {
    try {
      await runDailyPipeline(env);
      console.log('Daily pipeline completed successfully');
    } catch (e: any) {
      console.error('Daily pipeline failed:', e.message);
    }
  }
};
