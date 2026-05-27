import { network } from '$lib/stores/network.svelte';
import { cacheEpisode, getCachedEpisode } from './storage.svelte';
import { getEpisodeContent } from '$lib/data/seed-content';
import type { Episode } from '$lib/types';

const PRECACHE_AHEAD = 3;

export async function precacheTodayContent() {
  // Cache today's seed content
  const todayEp = getEpisodeContent('seed-001');
  if (todayEp) {
    const cached = await getCachedEpisode('seed-001');
    if (!cached) {
      await cacheEpisode(todayEp.episode, todayEp.segments, todayEp.vocabulary);
    }
  }
}

export async function precacheAudioFile(url: string): Promise<boolean> {
  if (!network.online) return false;

  try {
    const cache = await caches.open('audio-v1');
    const cached = await cache.match(url);
    if (cached) return true;

    const response = await fetch(url);
    if (response.ok) {
      await cache.put(url, response.clone());
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function isAudioCached(url: string): Promise<boolean> {
  try {
    const cache = await caches.open('audio-v1');
    return (await cache.match(url)) !== undefined;
  } catch {
    return false;
  }
}

export async function cleanupOldCache(maxEntries = 30) {
  const cache = await caches.open('audio-v1');
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    const toDelete = keys.slice(0, keys.length - maxEntries);
    for (const key of toDelete) {
      await cache.delete(key);
    }
    console.log(`Cleaned up ${toDelete.length} old audio caches`);
  }
}

export async function precacheAllSeedContent() {
  const { seedEpisodes } = await import('$lib/data/seed-content');

  for (const ep of seedEpisodes) {
    const cached = await getCachedEpisode(ep.id);
    if (!cached) {
      const content = getEpisodeContent(ep.id);
      if (content) {
        await cacheEpisode(content.episode, content.segments, content.vocabulary);
      }
    }
  }

  console.log('All seed content cached to IndexedDB');
}

export function schedulePrecache(commuteTime: string) {
  const now = new Date();
  const [hours, minutes] = commuteTime.split(':').map(Number);
  const commute = new Date(now);
  commute.setHours(hours, minutes, 0, 0);

  // Precache 20 min before commute
  const precacheTime = new Date(commute.getTime() - 20 * 60 * 1000);
  const delay = precacheTime.getTime() - now.getTime();

  if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
    console.log(`Scheduling precache in ${Math.round(delay / 60000)} minutes`);
    setTimeout(() => {
      precacheAllSeedContent();
    }, delay);
  }
}
