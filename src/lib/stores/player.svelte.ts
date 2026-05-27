import type { Episode, EpisodeContent, Segment, PlaybackSpeed } from '$lib/types';

let currentEpisode: Episode | null = $state(null);
let segments: Segment[] = $state([]);
let isPlaying = $state(false);
let currentTime = $state(0);
let duration = $state(0);
let playbackSpeed: PlaybackSpeed = $state(1);
let currentSegmentIndex = $state(-1);

export function getPlayerState() {
  return {
    get episode() { return currentEpisode; },
    get segments() { return segments; },
    get isPlaying() { return isPlaying; },
    get currentTime() { return currentTime; },
    get duration() { return duration; },
    get playbackSpeed() { return playbackSpeed; },
    get currentSegmentIndex() { return currentSegmentIndex; },

    loadContent(content: EpisodeContent) {
      currentEpisode = content.episode;
      segments = content.segments;
      currentTime = 0;
      currentSegmentIndex = -1;
    },

    setPlaying(playing: boolean) {
      isPlaying = playing;
    },

    setCurrentTime(time: number) {
      currentTime = time;
      currentSegmentIndex = segments.findIndex(
        (s) => time >= s.startTime && time < s.endTime
      );
    },

    setSegmentIndex(index: number) {
      currentSegmentIndex = index;
      if (segments[index]) {
        currentTime = segments[index].startTime;
      }
    },

    setDuration(d: number) {
      duration = d;
    },

    setSpeed(speed: PlaybackSpeed) {
      playbackSpeed = speed;
    },

    reset() {
      currentEpisode = null;
      segments = [];
      isPlaying = false;
      currentTime = 0;
      duration = 0;
    }
  };
}

export const player = getPlayerState();
