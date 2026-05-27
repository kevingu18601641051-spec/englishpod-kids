<script lang="ts">
  import { player } from '$lib/stores/player.svelte';

  let { onWordClick = () => {} }: { onWordClick?: (word: string) => void } = $props();
</script>

<div class="subtitle-panel">
  <div class="subtitles-inner">
    {#each player.segments as seg, i}
      <p
        class="subtitle-line"
        class:past={i < player.currentSegmentIndex}
        class:current={i === player.currentSegmentIndex}
        class:future={i > player.currentSegmentIndex}
        class:is-song={seg.isSong === 1}
      >
        <span class="cn-hint">{seg.textCn}</span>
        <span class="en-text">
          {#each seg.text.split(' ') as word}
            <button
              class="word"
              onclick={(e) => {
                e.stopPropagation();
                const clean = word.replace(/[^a-zA-Z']/g, '');
                if (clean) onWordClick(clean.toLowerCase());
              }}
            >
              {word}
            </button>
          {/each}
        </span>
      </p>
    {/each}
  </div>
</div>

<style>
  .subtitle-panel {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 20px 16px;
  }

  .subtitles-inner {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .subtitle-line {
    text-align: center;
    transition: all 0.3s;
    padding: 8px 0;
  }

  .subtitle-line.past {
    opacity: 0.35;
    font-size: var(--font-sm);
  }

  .subtitle-line.current {
    opacity: 1;
  }

  .subtitle-line.current .en-text {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--c-primary);
    line-height: 2.2rem;
  }

  .subtitle-line.future {
    opacity: 0.55;
    font-size: var(--font-sm);
  }

  .subtitle-line.is-song .en-text {
    font-style: italic;
  }

  .cn-hint {
    display: block;
    font-size: 0.8rem;
    color: var(--c-text-secondary);
    margin-bottom: 4px;
  }

  .current .cn-hint {
    font-size: var(--font-sm);
  }

  .en-text {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
    font-size: var(--font-md);
    line-height: 1.8rem;
  }

  .word {
    padding: 2px 6px;
    border-radius: 6px;
    min-height: 36px;
    transition: background 0.15s;
  }

  .current .word:active {
    background: var(--c-accent);
    color: white;
  }
</style>
