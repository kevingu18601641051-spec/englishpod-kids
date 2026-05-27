import { player as store } from '$lib/stores/player.svelte';
import type { Segment, PlaybackSpeed } from '$lib/types';

let segments: Segment[] = [];
let currentIndex = 0;
let onEndCallback: (() => void) | null = null;
let _speed: PlaybackSpeed = 1;
let paused = false;
let wasPlaying = false;

function getVoice(): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices();
  return voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'))
    || voices.find(v => v.lang.startsWith('en-US'))
    || voices.find(v => v.lang.startsWith('en'))
    || null;
}

function speakSegment(index: number) {
  if (index >= segments.length) {
    store.setPlaying(false);
    onEndCallback?.();
    return;
  }

  const seg = segments[index];
  const utterance = new SpeechSynthesisUtterance(seg.text);
  utterance.lang = 'en-US';
  utterance.rate = _speed * 0.85;
  utterance.pitch = 1.0;

  const voice = getVoice();
  if (voice) utterance.voice = voice;

  utterance.onstart = () => {
    store.setPlaying(true);
    store.setSegmentIndex(index);
  };

  utterance.onend = () => {
    if (paused) return;
    currentIndex = index + 1;
    speakSegment(currentIndex);
  };

  utterance.onerror = (e) => {
    if (e.error === 'canceled' || e.error === 'interrupted') return;
    console.error('SpeechSynthesis error:', e.error);
    currentIndex = index + 1;
    speakSegment(currentIndex);
  };

  speechSynthesis.speak(utterance);
}

export function loadContent(segs: Segment[], onEnd?: () => void) {
  stop();
  segments = segs;
  currentIndex = 0;
  paused = false;
  onEndCallback = onEnd ?? null;
  store.setDuration(segs[segs.length - 1]?.endTime ?? 0);
}

export function play() {
  if (speechSynthesis.speaking && paused) {
    speechSynthesis.resume();
    paused = false;
    store.setPlaying(true);
  } else if (!speechSynthesis.speaking || paused) {
    paused = false;
    speakSegment(currentIndex);
  }
}

export function pause() {
  paused = true;
  speechSynthesis.cancel();
  store.setPlaying(false);
}

export function toggle() {
  if (speechSynthesis.speaking && !paused) {
    pause();
  } else {
    play();
  }
}

export function seekToSegment(index: number) {
  speechSynthesis.cancel();
  currentIndex = Math.max(0, Math.min(index, segments.length - 1));
  paused = false;
  speakSegment(currentIndex);
}

export function seekToTime(time: number) {
  const idx = segments.findIndex(s => time >= s.startTime && time < s.endTime);
  if (idx >= 0) {
    seekToSegment(idx);
  }
}

export function skipForward() {
  speechSynthesis.cancel();
  currentIndex = Math.min(currentIndex + 1, segments.length);
  if (currentIndex >= segments.length) {
    store.setPlaying(false);
    onEndCallback?.();
    return;
  }
  paused = false;
  speakSegment(currentIndex);
}

export function skipBack() {
  speechSynthesis.cancel();
  currentIndex = Math.max(currentIndex - 1, 0);
  paused = false;
  speakSegment(currentIndex);
}

export function setSpeed(speed: PlaybackSpeed) {
  _speed = speed;
  store.setSpeed(speed);
  if (speechSynthesis.speaking && !paused) {
    speechSynthesis.cancel();
    speakSegment(currentIndex);
  }
}

export function stop() {
  speechSynthesis.cancel();
  segments = [];
  currentIndex = 0;
  paused = false;
  onEndCallback = null;
  store.reset();
}

export function getCurrentSegmentIndex(): number {
  return currentIndex;
}
