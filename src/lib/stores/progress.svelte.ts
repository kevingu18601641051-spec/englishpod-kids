import type { DailyProgress } from '$lib/types';

let userId = $state('');
let streakDays = $state(0);
let totalMinutes = $state(0);
let todayProgress: DailyProgress | null = $state(null);

export function getProgressState() {
  return {
    get userId() { return userId; },
    get streakDays() { return streakDays; },
    get totalMinutes() { return totalMinutes; },
    get todayProgress() { return todayProgress; },

    init(id: string) {
      userId = id;
      const stored = localStorage.getItem('epkids_user');
      if (stored) {
        const data = JSON.parse(stored);
        streakDays = data.streakDays ?? 0;
        totalMinutes = data.totalMinutes ?? 0;
      }
    },

    setTodayProgress(p: DailyProgress) {
      todayProgress = p;
    },

    completeEpisode(seconds: number) {
      totalMinutes += Math.round(seconds / 60);
      streakDays += 1;
      localStorage.setItem(
        'epkids_user',
        JSON.stringify({ streakDays, totalMinutes, lastActive: new Date().toISOString() })
      );
    }
  };
}

export const progress = getProgressState();
