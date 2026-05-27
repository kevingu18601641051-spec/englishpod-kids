<script lang="ts">
  import { onMount } from 'svelte';
  import { getReviewQueue, gradeWord, type SRSItem } from '$lib/offline/srs';

  let queue: SRSItem[] = $state([]);
  let currentIndex = $state(0);
  let showAnswer = $state(false);
  let completed = $state(false);
  let stats = $state({ reviewed: 0, easy: 0, hard: 0 });

  onMount(() => {
    queue = getReviewQueue(10);
  });

  const current = $derived(queue[currentIndex] ?? null);

  function rate(quality: 0 | 1 | 2 | 3 | 4 | 5) {
    if (!current) return;
    gradeWord(current.word, quality);
    stats = { ...stats, reviewed: stats.reviewed + 1, easy: stats.easy + (quality >= 4 ? 1 : 0), hard: stats.hard + (quality <= 2 ? 1 : 0) };

    if (currentIndex + 1 >= queue.length) {
      completed = true;
    } else {
      currentIndex++;
      showAnswer = false;
    }
  }

  function restart() {
    queue = getReviewQueue(10);
    currentIndex = 0;
    showAnswer = false;
    completed = false;
    stats = { reviewed: 0, easy: 0, hard: 0 };
  }
</script>

<div class="srs-container">
  {#if completed}
    <div class="srs-complete">
      <span class="big-emoji">🎉</span>
      <h2>复习完成！</h2>
      <p>复习了 {stats.reviewed} 个单词</p>
      <div class="srs-stats">
        <span>✅ {stats.easy} 熟练</span>
        <span>🔄 {stats.hard} 还需练习</span>
      </div>
      <button class="btn-restart" onclick={restart}>再来一轮</button>
    </div>
  {:else if current}
    <div class="srs-card">
      <div class="srs-progress">{currentIndex + 1} / {queue.length}</div>

      <h2 class="srs-word">{current.word}</h2>

      {#if showAnswer}
        <p class="srs-def">{current.definitionCn}</p>
        <p class="srs-pron">{current.pronunciation}</p>

        <div class="srs-buttons">
          <button class="rate rate-0" onclick={() => rate(0)}>完全忘了<br/><small>0</small></button>
          <button class="rate rate-2" onclick={() => rate(2)}>有点印象<br/><small>2</small></button>
          <button class="rate rate-4" onclick={() => rate(4)}>记得！<br/><small>4</small></button>
          <button class="rate rate-5" onclick={() => rate(5)}>太简单<br/><small>5</small></button>
        </div>
      {:else}
        <button class="btn-reveal" onclick={() => showAnswer = true}>
          显示释义
        </button>
      {/if}
    </div>
  {:else}
    <div class="srs-empty">
      <span class="icon">✅</span>
      <p>暂无需要复习的单词</p>
      <p class="sub">收藏单词后会自动加入复习队列</p>
    </div>
  {/if}
</div>

<style>
  .srs-container {
    padding: 16px 0;
  }

  .srs-card {
    text-align: center;
    padding: 40px 20px;
    background: var(--c-surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .srs-progress {
    font-size: var(--font-sm);
    color: var(--c-text-secondary);
    margin-bottom: 24px;
  }

  .srs-word {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--c-primary);
    margin-bottom: 12px;
  }

  .srs-def {
    font-size: var(--font-lg);
    font-weight: 700;
    margin-bottom: 4px;
  }

  .srs-pron {
    font-size: var(--font-sm);
    color: var(--c-text-secondary);
    margin-bottom: 24px;
  }

  .btn-reveal {
    margin-top: 20px;
    padding: 14px 40px;
    border-radius: 24px;
    background: var(--c-primary);
    color: white;
    font-weight: 700;
    font-size: var(--font-lg);
    min-height: 56px;
  }

  .srs-buttons {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .rate {
    padding: 10px 14px;
    border-radius: 16px;
    font-weight: 700;
    font-size: var(--font-sm);
    min-width: 64px;
    min-height: 56px;
    transition: all 0.15s;
  }

  .rate-0 { background: #fee2e2; color: #dc2626; }
  .rate-2 { background: #fed7aa; color: #ea580c; }
  .rate-4 { background: #d1fae5; color: #059669; }
  .rate-5 { background: #dbeafe; color: #2563eb; }

  .srs-complete, .srs-empty {
    text-align: center;
    padding: 40px 20px;
  }

  .big-emoji { font-size: 4rem; display: block; margin-bottom: 8px; }

  .srs-stats {
    display: flex; justify-content: center; gap: 16px;
    margin: 12px 0 20px;
    font-weight: 600;
  }

  .btn-restart {
    padding: 12px 32px;
    border-radius: 24px;
    background: var(--c-primary);
    color: white;
    font-weight: 700;
    min-height: 48px;
  }

  .srs-empty .icon { font-size: 3rem; display: block; margin-bottom: 8px; }
  .srs-empty .sub { font-size: var(--font-sm); color: var(--c-text-secondary); margin-top: 4px; }
</style>
