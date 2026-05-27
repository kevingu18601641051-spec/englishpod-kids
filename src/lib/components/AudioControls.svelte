<script lang="ts">
  import { player } from '$lib/stores/player.svelte';
  import { play, pause, skipForward, skipBack, setSpeed, seekToTime } from '$lib/audio/player';
  import { SPEED_OPTIONS } from '$lib/types';
</script>

<div class="controls-bar">
  <div class="progress-row">
    <span class="time">{formatTime(player.currentTime)}</span>
    <input
      type="range"
      class="progress-slider"
      min="0"
      max={player.duration || 1}
      value={player.currentTime}
      oninput={(e) => {
        const t = parseFloat(e.currentTarget.value);
        player.setCurrentTime(t);
      }}
      onchange={(e) => {
        seekToTime(parseFloat(e.currentTarget.value));
      }}
    />
    <span class="time">{formatTime(player.duration)}</span>
  </div>

  <div class="controls-row">
    <button onclick={() => skipBack()} class="btn-sm" aria-label="上一句">⏪</button>
    <button onclick={() => player.isPlaying ? pause() : play()} class="btn-play" aria-label={player.isPlaying ? '暂停' : '播放'}>
      {player.isPlaying ? '⏸️' : '▶️'}
    </button>
    <button onclick={() => skipForward()} class="btn-sm" aria-label="下一句">⏩</button>
  </div>

  <div class="speed-row">
    {#each SPEED_OPTIONS as opt}
      <button
        class="speed-btn"
        class:active={player.playbackSpeed === opt.speed}
        onclick={() => setSpeed(opt.speed)}
      >
        {opt.icon} {opt.label}
      </button>
    {/each}
  </div>
</div>

<style>
  .controls-bar {
    background: var(--c-surface);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    padding: 16px 20px calc(16px + var(--safe-bottom));
    box-shadow: 0 -2px 12px rgba(0,0,0,0.06);
  }

  .progress-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  .time {
    font-size: var(--font-sm);
    color: var(--c-text-secondary);
    min-width: 40px;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  .progress-slider {
    flex: 1;
    height: 6px;
    -webkit-appearance: none;
    background: #e5e7eb;
    border-radius: 3px;
    outline: none;
  }

  .progress-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--c-primary);
    cursor: pointer;
  }

  .controls-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
    margin-bottom: 12px;
  }

  .btn-play {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: var(--c-primary);
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-sm {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--c-primary-bg);
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .speed-row {
    display: flex;
    justify-content: center;
    gap: 8px;
  }

  .speed-btn {
    padding: 6px 14px;
    border-radius: 20px;
    background: #f3f4f6;
    font-size: var(--font-sm);
    font-weight: 600;
    min-width: 60px;
    min-height: 36px;
    transition: all 0.15s;
  }

  .speed-btn.active {
    background: var(--c-primary);
    color: white;
  }
</style>

<script lang="ts" context="module">
  function formatTime(sec: number): string {
    if (!sec || !isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
</script>
