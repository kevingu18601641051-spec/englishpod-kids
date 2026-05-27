import type { Env, Episode, Segment, VocabItem, Topic } from '../types';
import { DIFFICULTY_MAP } from '../types';
import { TOPIC_PROMPTS } from '../types';
import { createClient, generateStory } from '../lib/ai';
import { insertEpisode, insertSegments, insertVocabulary } from '../db/queries';

export async function generateEpisode(
  env: Env,
  topic: Topic,
  difficulty: number
): Promise<{ episode: Episode; segments: Segment[]; vocabulary: VocabItem[] }> {
  const client = createClient(env.OPENAI_API_KEY); // Using field for DeepSeek key
  const dm = DIFFICULTY_MAP[difficulty] ?? DIFFICULTY_MAP[5];
  const topicDesc = TOPIC_PROMPTS[topic];

  const story = await generateStory(
    client,
    topicDesc,
    difficulty,
    dm.wordLimit,
    dm.sentenceLen,
    dm.tense
  );

  const dateStr = new Date().toISOString().split('T')[0];
  const episodeId = `ep-${dateStr}-${String(difficulty).padStart(2, '0')}`;

  // Estimate duration: ~0.45s per word for child-friendly pace
  const totalWords = story.segments.reduce((sum, s) => sum + s.text.split(' ').length, 0);
  const estimatedDuration = Math.round(totalWords * 0.45);
  const segmentDuration = estimatedDuration / story.segments.length;

  const segments: Segment[] = story.segments.map((s, i) => ({
    episode_id: episodeId,
    seq: i,
    start_time: Math.round(i * segmentDuration * 10) / 10,
    end_time: Math.round((i + 1) * segmentDuration * 10) / 10,
    text: s.text,
    text_cn: s.textCn,
    is_song: topic === 'songs' ? 1 : 0
  }));

  const vocabulary: VocabItem[] = story.vocab.map(v => ({
    episode_id: episodeId,
    word: v.word.toLowerCase(),
    definition_cn: v.definitionCn,
    pronunciation: '',
    part_of_speech: v.partOfSpeech,
    difficulty: Math.max(1, Math.min(5, Math.ceil(difficulty / 2)))
  }));

  const episode: Episode = {
    id: episodeId,
    title: story.title,
    title_cn: story.titleCn,
    description: story.description,
    difficulty,
    topic,
    duration_sec: estimatedDuration,
    audio_url: '', // No TTS - audio generated client-side
    total_words: totalWords,
    unique_words: new Set(
      story.segments.flatMap(s =>
        s.text.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z]/g, ''))
      )
    ).size,
    status: 'ready',
    published_at: dateStr
  };

  return { episode, segments, vocabulary };
}

export async function saveEpisodeToDB(
  env: Env,
  episode: Episode,
  segments: Segment[],
  vocabulary: VocabItem[]
) {
  await insertEpisode(env, episode);
  await insertSegments(env, episode.id, segments);
  await insertVocabulary(env, episode.id, vocabulary);
}
