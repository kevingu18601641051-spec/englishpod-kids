export interface Episode {
  id: string;
  title: string;
  titleCn: string;
  description: string;
  difficulty: number;
  topic: Topic;
  durationSec: number;
  audioUrl: string;
  coverUrl?: string;
  totalWords: number;
  uniqueWords: number;
  status: 'generating' | 'ready' | 'failed';
  publishedAt: string;
}

export type Topic = 'magic' | 'animals' | 'friendship' | 'nature' | 'adventure' | 'art' | 'songs' | 'mystery';

export const TOPIC_EMOJI: Record<Topic, string> = {
  magic: '🦄',
  animals: '🐰',
  friendship: '👭',
  nature: '🌿',
  adventure: '🚀',
  art: '🎨',
  songs: '🎵',
  mystery: '🔍'
};

export const TOPIC_LABEL: Record<Topic, string> = {
  magic: '魔法童话',
  animals: '动物朋友',
  friendship: '友谊故事',
  nature: '自然探索',
  adventure: '日常冒险',
  art: '艺术手工',
  songs: '音乐童谣',
  mystery: '可爱谜题'
};

export interface Segment {
  seq: number;
  startTime: number;
  endTime: number;
  text: string;
  textCn: string;
  isSong: boolean;
}

export interface VocabItem {
  word: string;
  definitionCn: string;
  pronunciation: string;
  partOfSpeech: string;
  difficulty: number;
}

export interface EpisodeContent {
  episode: Episode;
  segments: Segment[];
  vocabulary: VocabItem[];
}

export interface DailyProgress {
  id?: number;
  userId: string;
  date: string;
  episodeId: string;
  listenSeconds: number;
  completed: boolean;
  avgSpeed: number;
  lookups: number;
  replayCount: number;
}

export interface WordInteraction {
  id?: number;
  userId: string;
  word: string;
  episodeId: string;
  firstSeen: string;
  lookupCount: number;
  lastLookup: string;
  familiarity: number;
}

export interface UserSettings {
  userId: string;
  commuteTime: string;
  difficultyLevel: number;
  topicPreferences: Topic[];
  streakDays: number;
  totalListenMinutes: number;
}

export type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.2;

export const SPEED_OPTIONS: { speed: PlaybackSpeed; icon: string; label: string }[] = [
  { speed: 0.5, icon: '🐢', label: '0.5x' },
  { speed: 0.75, icon: '🚶', label: '0.75x' },
  { speed: 1, icon: '🐰', label: '1x' },
  { speed: 1.2, icon: '🚀', label: '1.2x' }
];
