interface SRSItem {
  word: string;
  ef: number;        // easiness factor (default 2.5, min 1.3)
  interval: number;  // days until next review
  repetitions: number; // times answered correctly in a row
  nextReview: string;  // ISO date
  lastReview: string;
  definitionCn: string;
  pronunciation: string;
}

const DB_KEY = 'epkids_srs';

function load(): SRSItem[] {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
  } catch { return []; }
}

function save(items: SRSItem[]) {
  localStorage.setItem(DB_KEY, JSON.stringify(items));
}

export function addWord(word: string, definitionCn: string, pronunciation: string) {
  const items = load();
  if (items.find(i => i.word === word)) return;

  items.push({
    word,
    ef: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: new Date().toISOString().split('T')[0],
    lastReview: new Date().toISOString().split('T')[0],
    definitionCn,
    pronunciation
  });
  save(items);
}

export function gradeWord(word: string, quality: 0 | 1 | 2 | 3 | 4 | 5) {
  const items = load();
  const item = items.find(i => i.word === word);
  if (!item) return;

  // SM-2 algorithm
  if (quality >= 3) {
    if (item.repetitions === 0) {
      item.interval = 1;
    } else if (item.repetitions === 1) {
      item.interval = 3;
    } else {
      item.interval = Math.round(item.interval * item.ef);
    }
    item.repetitions++;
    item.ef = Math.max(1.3, item.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  } else {
    item.repetitions = 0;
    item.interval = 1;
  }

  item.lastReview = new Date().toISOString().split('T')[0];
  const next = new Date();
  next.setDate(next.getDate() + item.interval);
  item.nextReview = next.toISOString().split('T')[0];

  save(items);
}

export function getDueWords(): SRSItem[] {
  const today = new Date().toISOString().split('T')[0];
  return load().filter(i => i.nextReview <= today);
}

export function getReviewQueue(count = 10): SRSItem[] {
  return getDueWords().slice(0, count);
}

export function getAllWords(): SRSItem[] {
  return load()
    .map(i => ({ ...i, interval: i.interval || 0 }))
    .sort((a, b) => b.repetitions - a.repetitions);
}

export function getSRSStats() {
  const items = load();
  const today = new Date().toISOString().split('T')[0];
  const due = items.filter(i => i.nextReview <= today).length;
  const mastered = items.filter(i => i.repetitions >= 5).length;
  const learning = items.filter(i => i.repetitions > 0 && i.repetitions < 5).length;
  const new_ = items.filter(i => i.repetitions === 0).length;

  return { total: items.length, due, mastered, learning, new: new_ };
}

export function removeWord(word: string) {
  const items = load().filter(i => i.word !== word);
  save(items);
}
