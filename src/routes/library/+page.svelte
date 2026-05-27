<script lang="ts">
  import { onMount } from 'svelte';
  import { seedEpisodes } from '$lib/data/seed-content';
  import { getLibrary } from '$lib/api/content';
  import { TOPIC_EMOJI, TOPIC_LABEL, type Episode } from '$lib/types';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

  let episodes: Episode[] = $state([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const eps = await getLibrary();
      episodes = eps.length > 0 ? eps : seedEpisodes;
    } catch {
      episodes = seedEpisodes;
    }
    loading = false;
  });
</script>

<div class="page-transition">
  <h1 class="page-title">📚 故事库</h1>

  {#if loading}
    <LoadingSpinner message="加载故事库..." />
  {:else if episodes.length > 0}
    <div class="grid">
      {#each episodes as ep}
        <a href="/player/{ep.id}" class="lib-card">
          <div class="lib-cover topic-{ep.topic}">
            <span>{TOPIC_EMOJI[ep.topic]}</span>
          </div>
          <div class="lib-info">
            <span class="lib-title">{ep.title}</span>
            <span class="lib-topic">{TOPIC_LABEL[ep.topic]}</span>
            <span class="lib-dur">⏱ {Math.floor(ep.durationSec / 60)} 分钟</span>
          </div>
        </a>
      {/each}
    </div>
  {:else}
    <div class="empty-state">
      <span class="icon">🐰</span>
      <p>还没有故事，明天再来看看吧！</p>
    </div>
  {/if}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding-bottom: 20px;
  }

  .lib-card {
    border-radius: var(--radius-md);
    background: var(--c-surface);
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    transition: transform 0.15s;
  }

  .lib-card:active { transform: scale(0.97); }

  .lib-cover {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
  }

  .topic-magic { background: linear-gradient(135deg, #e0e7ff, #fae8ff); }
  .topic-animals { background: linear-gradient(135deg, #dcfce7, #fef9c3); }
  .topic-friendship { background: linear-gradient(135deg, #fce7f3, #ede9fe); }
  .topic-nature { background: linear-gradient(135deg, #d1fae5, #dbeafe); }
  .topic-adventure { background: linear-gradient(135deg, #fed7aa, #fee2e2); }
  .topic-art { background: linear-gradient(135deg, #fef3c7, #fce7f3); }
  .topic-songs { background: linear-gradient(135deg, #ede9fe, #dbeafe); }
  .topic-mystery { background: linear-gradient(135deg, #e0e7ff, #d1fae5); }

  .lib-info {
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .lib-title {
    font-weight: 600;
    font-size: var(--font-sm);
    line-height: 1.3;
  }

  .lib-topic { font-size: 11px; color: var(--c-primary); }
  .lib-dur { font-size: 11px; color: var(--c-text-secondary); }
</style>
