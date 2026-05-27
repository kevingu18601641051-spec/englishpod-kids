export type Topic = 'magic' | 'animals' | 'friendship' | 'nature' | 'adventure' | 'art' | 'songs' | 'mystery';

export interface Env {
  DB: D1Database;
  OPENAI_API_KEY: string;
  API_KEY: string;
  ENVIRONMENT?: string;
}

export interface Episode {
  id: string;
  title: string;
  title_cn: string;
  description: string;
  difficulty: number;
  topic: Topic;
  duration_sec: number;
  audio_url: string;
  cover_url?: string;
  total_words: number;
  unique_words: number;
  status: 'generating' | 'ready' | 'failed';
  published_at: string;
}

export interface Segment {
  id?: number;
  episode_id: string;
  seq: number;
  start_time: number;
  end_time: number;
  text: string;
  text_cn: string;
  is_song: number;
}

export interface VocabItem {
  id?: number;
  episode_id: string;
  word: string;
  definition_cn: string;
  pronunciation: string;
  part_of_speech: string;
  difficulty: number;
}

export interface User {
  id: string;
  difficulty_level: number;
  topic_preferences: string;
  commute_time: string;
  streak_days: number;
  total_listen_minutes: number;
}

export interface DailyProgress {
  id?: number;
  user_id: string;
  date: string;
  episode_id: string;
  listen_seconds: number;
  completed: number;
  avg_speed: number;
  lookups: number;
  replay_count: number;
}

export interface DifficultyMapping {
  wordLimit: number;
  sentenceLen: string;
  tense: string;
  label: string;
}

export const DIFFICULTY_MAP: Record<number, DifficultyMapping> = {
  1:  { label: 'A1 (Easy)',   wordLimit: 80,  sentenceLen: '3-5',  tense: 'present simple only' },
  2:  { label: 'A1',          wordLimit: 120, sentenceLen: '4-6',  tense: 'present simple only' },
  3:  { label: 'A1+',         wordLimit: 150, sentenceLen: '4-7',  tense: 'present simple + can/cannot' },
  4:  { label: 'A1-2',        wordLimit: 200, sentenceLen: '5-8',  tense: 'present simple + present continuous' },
  5:  { label: 'A2 (Medium)', wordLimit: 250, sentenceLen: '5-9',  tense: 'add past simple' },
  6:  { label: 'A2',          wordLimit: 300, sentenceLen: '6-10', tense: 'past simple + going to' },
  7:  { label: 'A2+',         wordLimit: 350, sentenceLen: '6-12', tense: 'mixed basic tenses' },
  8:  { label: 'A2-Strong',   wordLimit: 400, sentenceLen: '7-14', tense: 'mixed tenses + connectives' },
  9:  { label: 'A2 Upper',    wordLimit: 450, sentenceLen: '8-15', tense: 'mixed tenses + some clauses' },
  10: { label: 'A2+',         wordLimit: 500, sentenceLen: '10-18', tense: 'advanced A2' },
};

export const TOPICS: Topic[] = ['magic', 'animals', 'friendship', 'nature', 'adventure', 'art', 'songs', 'mystery'];

export const TOPIC_PROMPTS: Record<Topic, string> = {
  magic: 'a fairy, a magical creature, or a tiny magical world (like a fairy helping a lost bunny)',
  animals: 'cute animals having a gentle adventure (like a bunny making a new friend in the forest)',
  friendship: 'two children becoming friends or helping each other (like sharing lunch at school)',
  nature: 'discovering something beautiful in nature (like watching the sky change colors, finding a rainbow)',
  adventure: 'a child going on a small everyday adventure (like a day at the park, visiting grandma)',
  art: 'a child making art, drawing, singing, or doing a craft project',
  songs: 'a simple, rhythmic, rhyming story that almost feels like a song',
  mystery: 'a very gentle, cute mystery (like finding where a lost toy went)',
};
