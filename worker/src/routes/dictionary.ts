import { error, json } from 'itty-router';
import type { Env } from '../types';
import { lookupWordInDict } from '../db/queries';

const COMMON_WORDS: Record<string, { def: string; pron: string; pos: string }> = {
  'the': { def: '这个/那个（定冠词）', pron: '/ðə/', pos: 'art.' },
  'a': { def: '一个', pron: '/ə/', pos: 'art.' },
  'is': { def: '是', pron: '/ɪz/', pos: 'v.' },
  'are': { def: '是', pron: '/ɑːr/', pos: 'v.' },
  'i': { def: '我', pron: '/aɪ/', pos: 'pron.' },
  'you': { def: '你/你们', pron: '/juː/', pos: 'pron.' },
  'he': { def: '他', pron: '/hiː/', pos: 'pron.' },
  'she': { def: '她', pron: '/ʃiː/', pos: 'pron.' },
  'it': { def: '它', pron: '/ɪt/', pos: 'pron.' },
  'we': { def: '我们', pron: '/wiː/', pos: 'pron.' },
  'they': { def: '他们/她们', pron: '/ðeɪ/', pos: 'pron.' },
  'and': { def: '和', pron: '/ænd/', pos: 'conj.' },
  'in': { def: '在...里面', pron: '/ɪn/', pos: 'prep.' },
  'on': { def: '在...上面', pron: '/ɒn/', pos: 'prep.' },
  'to': { def: '到/去', pron: '/tuː/', pos: 'prep.' },
};

export const dictionaryRoutes = {
  async lookup(req: Request, env: Env) {
    const url = new URL(req.url);
    const word = url.searchParams.get('word')?.toLowerCase();
    if (!word) return error(400, { error: 'word required' });

    if (COMMON_WORDS[word]) {
      const c = COMMON_WORDS[word];
      return json({ word, definitionCn: c.def, pronunciation: c.pron, partOfSpeech: c.pos });
    }

    const found = await lookupWordInDict(env, word);
    if (found) {
      return json({
        word: found.word,
        definitionCn: found.definition_cn,
        pronunciation: found.pronunciation,
        partOfSpeech: found.part_of_speech
      });
    }

    return json({
      word,
      definitionCn: '（暂无释义）',
      pronunciation: '',
      partOfSpeech: ''
    });
  }
};
