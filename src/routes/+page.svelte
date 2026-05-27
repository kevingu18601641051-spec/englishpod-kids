<script lang="ts">
  import { onMount } from 'svelte';
  import { player } from '$lib/stores/player.svelte';
  import { progress } from '$lib/stores/progress.svelte';
  import { network } from '$lib/stores/network.svelte';
  import { seedEpisodes } from '$lib/data/seed-content';
  import { getLibrary } from '$lib/api/content';
  import { TOPIC_EMOJI, TOPIC_LABEL, type Topic, type Episode } from '$lib/types';
  import DailyCard from '$lib/components/DailyCard.svelte';
  import StreakBadge from '$lib/components/StreakBadge.svelte';

  let today: Episode = $state(seedEpisodes[0]);
  let recent: Episode[] = $state(seedEpisodes);

  onMount(async () => {
    try {
      const episodes = await getLibrary();
      if (episodes.length > 0) {
        recent = episodes;
        today = episodes[0];
      }
    } catch {
      // fall back to seed data
    }
  });

  const allTopics: Topic[] = ['magic', 'animals', 'friendship', 'nature', 'adventure', 'art', 'songs', 'mystery'];
</script>

<div class="home">
  <div class="home-header">
    <div>
      <h1 class="greeting">Hello! 👋</h1>
      <p class="date">{new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
    </div>
    <StreakBadge days={progress.streakDays} />
  </div>

  <section class="today-section">
    <h2 class="section-title">📅 今天的故事</h2>
    <DailyCard episode={today} />
  </section>

  <section class="topics-section">
    <h2 class="section-title">🎯 选择话题</h2>
    <div class="topic-chips">
      {#each allTopics as topic}
        <button class="topic-chip" data-topic={topic}>
          {TOPIC_EMOJI[topic]} {TOPIC_LABEL[topic]}
        </button>
      {/each}
    </div>
  </section>

  <section class="recent-section">
    <h2 class="section-title">📚 最近的故事</h2>
    <div class="recent-list">
      {#each recent as ep}
        <a href="/player/{ep.id}" class="recent-item">
          <span class="recent-emoji">{TOPIC_EMOJI[ep.topic]}</span>
          <div class="recent-info">
            <span class="recent-title">{ep.title}</span>
            <span class="recent-meta">{Math.floor(ep.durationSec / 60)} 分钟 · {TOPIC_LABEL[ep.topic]}</span>
          </div>
          <span class="recent-arrow">→</span>
        </a>
      {/each}
    </div>
  </section>
</div>

<style>
  .home {
    padding-bottom: 20px;
  }

  .home-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .greeting {
    font-size: var(--font-xl);
    font-weight: 700;
  }

  .date {
    font-size: var(--font-sm);
    color: var(--c-text-secondary);
    margin-top: 2px;
  }

  .section-title {
    font-size: var(--font-lg);
    font-weight: 700;
    margin-bottom: 12px;
  }

  .today-section {
    margin-bottom: 24px;
  }

  .topics-section {
    margin-bottom: 24px;
  }

  .topic-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .topic-chip {
    padding: 8px 16px;
    border-radius: 20px;
    background: var(--c-surface);
    font-size: var(--font-sm);
    font-weight: 600;
    min-height: var(--touch-target);
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }

  .recent-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .recent-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: var(--radius-md);
    background: var(--c-surface);
    min-height: var(--touch-target);
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }

  .recent-emoji { font-size: 1.5rem; }

  .recent-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .recent-title {
    font-weight: 600;
    font-size: var(--font-md);
  }

  .recent-meta {
    font-size: var(--font-sm);
    color: var(--c-text-secondary);
  }

  .recent-arrow {
    color: var(--c-text-secondary);
    font-size: var(--font-lg);
  }
</style>
