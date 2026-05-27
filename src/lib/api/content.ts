import { seedEpisodes, getEpisodeContent } from '$lib/data/seed-content';
import { fetchTodayContent, fetchEpisode, fetchLibrary } from './client';
import type { EpisodeContent } from '$lib/types';

export async function getTodayContent(): Promise<EpisodeContent | null> {
  try {
    const data = await fetchTodayContent();
    if (data?.episode) {
      return {
        episode: data.episode,
        segments: data.segments,
        vocabulary: data.vocabulary
      };
    }
  } catch {
    // API unavailable, use seed data
  }

  return getEpisodeContent('seed-001');
}

export async function getContent(id: string): Promise<EpisodeContent | null> {
  try {
    const data = await fetchEpisode(id);
    if (data?.episode) {
      return {
        episode: data.episode,
        segments: data.segments,
        vocabulary: data.vocabulary
      };
    }
  } catch {
    // fall back to seed data
  }

  return getEpisodeContent(id);
}

export async function getLibrary(): Promise<EpisodeContent['episode'][]> {
  try {
    const data = await fetchLibrary();
    if (data?.episodes?.length) return data.episodes;
  } catch {
    // fall back
  }

  return seedEpisodes;
}
