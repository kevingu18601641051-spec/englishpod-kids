import type { DailyProgress } from '../types';

interface SessionSignals {
  completionRate: number;
  lookupDensity: number;
  avgSpeed: number;
  replayCount: number;
}

function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function computeDifficultyAdjustment(
  sessions: DailyProgress[],
  currentDifficulty: number,
  episodeDurationSec: number
): number {
  if (sessions.length < 3) return currentDifficulty;

  const recentSessions = sessions.slice(-7);

  const signals: SessionSignals[] = recentSessions.map(s => ({
    completionRate: episodeDurationSec > 0 ? s.listen_seconds / episodeDurationSec : 0,
    lookupDensity: (s.listen_seconds / 60) > 0 ? s.lookups / (s.listen_seconds / 60) : 0,
    avgSpeed: s.avg_speed,
    replayCount: s.replay_count
  }));

  const medianCR = median(signals.map(s => s.completionRate));
  const medianLD = median(signals.map(s => s.lookupDensity));
  const medianSP = median(signals.map(s => s.avgSpeed));
  const medianRC = median(signals.map(s => s.replayCount));

  let adjustment = 0;
  let signalCount = 0;

  if (medianCR > 0.85) { adjustment += 0.4; signalCount++; }
  else if (medianCR < 0.4) { adjustment -= 0.6; signalCount++; }

  if (medianLD > 2.0) { adjustment -= 0.3; signalCount++; }
  else if (medianLD < 0.3 && medianCR > 0.8) { adjustment += 0.2; signalCount++; }

  if (medianSP < 0.7) { adjustment -= 0.3; signalCount++; }
  else if (medianSP >= 1.0 && medianCR > 0.8) { adjustment += 0.15; signalCount++; }

  if (medianRC > 3) { adjustment -= 0.2; signalCount++; }

  if (signalCount === 0) return currentDifficulty;

  const rawNewDifficulty = currentDifficulty + (adjustment / signalCount);
  const smoothed = currentDifficulty * 0.7 + rawNewDifficulty * 0.3;

  return Math.max(1, Math.min(10, Math.round(smoothed)));
}
