<script lang="ts">
  import { onMount } from 'svelte';
  import { getAllWords, getSRSStats, removeWord } from '$lib/offline/srs';
  import SRSReview from '$lib/components/SRSReview.svelte';

  interface WordItem {
    word: string;
    definitionCn: string;
    pronunciation: string;
    reps: number;
    interval: number;
  }

  let words: WordItem[] = $state([]);
  let stats = $state({ total: 0, due: 0, mastered: 0, learning: 0, new: 0 });
  let showReview = $state(false);
  let loaded = $state(false);

  onMount(() => {
    refresh();
    loaded = true;
  });

  function refresh() {
    words = getAllWords().map(i => ({
      word: i.word,
      definitionCn: i.definitionCn,
      pronunciation: i.pronunciation,
      reps: i.repetitions,
      interval: i.interval
    }));
    stats = getSRSStats();
  }

  function handleRemove(word: string) {
    removeWord(word);
    refresh();
  }

  function familiarityStars(reps: number): string {
    if (reps >= 5) return '⭐⭐⭐⭐⭐';
    if (reps >= 3) return '⭐⭐⭐';
    if (reps >= 1) return '⭐';
    return '🆕';
  }
</script>

<div class="page-transition">
  <h1 class="page-title">⭐ 我的单词</h1>

  {#if stats.total > 0}
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-num">{stats.total}</span>
        <span class="stat-label">总计</span>
      </div>
      <div class="stat-item highlight">
        <span class="stat-num">{stats.due}</span>
        <span class="stat-label">待复习</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">{stats.mastered}</span>
        <span class="stat-label">已掌握</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">{stats.new}</span>
        <span class="stat-label">新学</span>
      </div>
    </div>

    {#if stats.due > 0}
      <button class="btn-review" onclick={() => showReview = !showReview}>
        {showReview ? '📋 关闭复习' : `📝 开始复习（${stats.due} 个待复习）`}
      </button>
    {/if}

    {#if showReview}
      <SRSReview />
    {/if}

    <div class="word-list">
      {#each words as item}
        <div class="word-item">
          <div class="word-main">
            <span class="word-en">{item.word}</span>
            <span class="word-def">{item.definitionCn}</span>
          </div>
          <div class="word-side">
            <span class="word-fam">{familiarityStars(item.reps)}</span>
            <span class="word-pron">{item.pronunciation}</span>
            <button class="word-remove" onclick={() => handleRemove(item.word)}>✕</button>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="empty-state">
      <span class="icon">🎯</span>
      <p>还没有收藏单词</p>
      <p class="hint">在播放器中点击不认识的单词即可收藏！</p>
    </div>
  {/if}
</div>

<style>
  .stats-bar {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  .stat-item {
    flex: 1;
    text-align: center;
    padding: 12px 4px;
    border-radius: var(--radius-md);
    background: var(--c-surface);
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }

  .stat-item.highlight {
    background: var(--c-primary-bg);
    border: 2px solid var(--c-primary-light);
  }

  .stat-num {
    display: block;
    font-size: var(--font-xl);
    font-weight: 800;
    color: var(--c-primary);
  }

  .stat-label {
    font-size: 11px;
    color: var(--c-text-secondary);
  }

  .btn-review {
    display: block;
    width: 100%;
    padding: 14px;
    border-radius: var(--radius-md);
    background: var(--c-primary);
    color: white;
    font-weight: 700;
    font-size: var(--font-md);
    min-height: 52px;
    margin-bottom: 16px;
  }

  .word-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 20px;
  }

  .word-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    border-radius: var(--radius-md);
    background: var(--c-surface);
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    min-height: var(--touch-target);
  }

  .word-main {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .word-en {
    font-size: var(--font-md);
    font-weight: 700;
    color: var(--c-primary);
  }

  .word-def {
    font-size: var(--font-sm);
    color: var(--c-text-secondary);
  }

  .word-side {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }

  .word-fam { font-size: var(--font-sm); }
  .word-pron { font-size: 10px; color: var(--c-text-secondary); }

  .word-remove {
    font-size: 11px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #fee2e2;
    color: var(--c-danger);
    margin-top: 4px;
  }

  .hint {
    font-size: var(--font-sm);
    color: var(--c-text-secondary);
    margin-top: 4px;
  }
</style>
