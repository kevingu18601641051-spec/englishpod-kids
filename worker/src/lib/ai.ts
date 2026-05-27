import OpenAI from 'openai';

export function createClient(apiKey: string) {
  return new OpenAI({
    apiKey,
    baseURL: 'https://api.deepseek.com'
  });
}

export async function generateStory(
  client: OpenAI,
  topic: string,
  difficulty: number,
  wordLimit: number,
  sentenceLen: string,
  tense: string
): Promise<{
  title: string;
  titleCn: string;
  description: string;
  segments: Array<{ text: string; textCn: string }>;
  vocab: Array<{ word: string; definitionCn: string; partOfSpeech: string }>;
}> {
  const prompt = `You are creating a short English listening story for a 6-9 year old Chinese girl learning English (CEFR A1-A2).

Create a story on this topic: ${topic}
Target word count: ${wordLimit} words
Sentence length: ${sentenceLen} words each
Grammar: use ${tense}

Rules:
1. Each sentence on its own line, separated by a blank line.
2. Use simple words a beginner can understand.
3. Include cute, warm, positive content.
4. Have a clear beginning, middle, and happy ending.
5. Include 1-2 lines of dialogue between characters.

Respond ONLY with this JSON format (no markdown, no \`\`\`):
{
  "title": "English title",
  "titleCn": "Chinese title",
  "description": "A short Chinese description (1 sentence)",
  "segments": [
    { "text": "English sentence 1.", "textCn": "中文翻译1" },
    { "text": "English sentence 2.", "textCn": "中文翻译2" }
  ],
  "vocab": [
    { "word": "example", "definitionCn": "例子", "partOfSpeech": "n." }
  ]
}

Pick 5-8 key vocabulary words from the story that a beginner should learn.`;

  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    max_tokens: 2000
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error('Empty response from DeepSeek');

  const parsed = JSON.parse(content);
  return parsed;
}
