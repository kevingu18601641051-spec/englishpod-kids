const API_BASE = '/api';
const RETRY_DELAY = 2000;
const MAX_RETRIES = 2;

async function getUserId(): Promise<string> {
  return localStorage.getItem('epkids_device_id') || '';
}

async function fetchWithRetry(url: string, options?: RequestInit, retries = MAX_RETRIES): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (e) {
      if (i === retries) throw e;
      await new Promise(r => setTimeout(r, RETRY_DELAY * (i + 1)));
    }
  }
  throw new Error('Network error');
}

export async function fetchTodayContent(): Promise<any | null> {
  const uid = await getUserId();
  if (!uid) return null;

  const res = await fetch(`${API_BASE}/content/today?user=${uid}`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchEpisode(id: string): Promise<any | null> {
  const res = await fetch(`${API_BASE}/content/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchLibrary(limit = 30): Promise<any | null> {
  const res = await fetch(`${API_BASE}/content/library?limit=${limit}`);
  if (!res.ok) return null;
  return res.json();
}

export async function reportSession(data: {
  user: string;
  episode: string;
  listenSeconds: number;
  completed: boolean;
  avgSpeed: number;
  lookups: number;
  replayCount: number;
}) {
  const res = await fetch(`${API_BASE}/progress/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function reportLookup(data: {
  user: string;
  word: string;
  episode: string;
  contextSentence: string;
}) {
  const res = await fetch(`${API_BASE}/progress/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function lookupWord(word: string) {
  const res = await fetch(`${API_BASE}/dictionary/lookup?word=${encodeURIComponent(word)}`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchPrecacheList() {
  const uid = await getUserId();
  const res = await fetch(`${API_BASE}/schedule/precache?user=${uid}`);
  if (!res.ok) return null;
  return res.json();
}

export async function initUser(id: string) {
  const res = await fetch(`${API_BASE}/user/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  return res.json();
}

export async function fetchUserStats() {
  const uid = await getUserId();
  if (!uid) return null;
  const res = await fetch(`${API_BASE}/user/stats?user=${uid}`);
  if (!res.ok) return null;
  return res.json();
}
