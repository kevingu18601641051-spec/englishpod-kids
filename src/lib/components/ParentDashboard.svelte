<script lang="ts">
  import { onMount } from 'svelte';
  import { getAllWords, getSRSStats } from '$lib/offline/srs';

  let totalMinutes = $state(0);
  let streakDays = $state(0);
  let wordStats = $state({ total: 0, mastered: 0, due: 0 });
  let browsingHistory: Array<{ date: string; count: number }> = $state([]);

  onMount(() => {
    const stored = localStorage.getItem('epkids_user');
    if (stored) {
      const data = JSON.parse(stored);
      totalMinutes = data.totalMinutes ?? 0;
      streakDays = data.streakDays ?? 0;
    }

    wordStats = getSRSStats();

    // Generate sample weekly data
    const days = ['一', '二', '三', '四', '五', '六', '日'];
    browsingHistory = days.map((d, i) => ({
      date: d,
      count: Math.floor(Math.random() * 3)
    }));
  });

  const maxCount = $derived(Math.max(1, ...browsingHistory.map(h => h.count)));
</script>

<div class="dashboard">
  <div class="summary-cards">
    <div class="metric-card">
      <span class="metric-emoji">⏱</span>
      <span class="metric-val">{totalMinutes}</span>
      <span class="metric-label">累计听阅分钟</span>
    </div>
    <div class="metric-card">
      <span class="metric-emoji">🔥</span>
      <span class="metric-val">{streakDays}</span>
      <span class="metric-label">连续学习天数</span>
    </div>
    <div class="metric-card">
      <span class="metric-emoji">📖</span>
      <span class="metric-val">{wordStats.total}</span>
      <span class="metric-label">收藏单词</span>
    </div>
    <div class="metric-card">
      <span class="metric-emoji">✅</span>
      <span class="metric-val">{wordStats.mastered}</span>
      <span class="metric-label">已掌握单词</span>
    </div>
  </div>

  <div class="chart-section">
    <h3 class="chart-title">📊 本周活跃度</h3>
    <div class="bar-chart">
      {#each browsingHistory as day}
        <div class="bar-col">
          <div class="bar" style="height: {Math.max(8, (day.count / maxCount) * 100)}%">
            <span class="bar-val">{day.count}</span>
          </div>
          <span class="bar-label">{day.date}</span>
        </div>
      {/each}
    </div>
  </div>

  <div class="section">
    <h3 class="chart-title">📈 学习趋势</h3>
    <p class="trend-text">
      {#if wordStats.mastered > 0}
        已掌握 {wordStats.mastered} 个单词，{wordStats.due > 0 ? `还有 ${wordStats.due} 个需要复习` : '无需复习！'}
      {:else}
        刚开始学习，继续加油！
      {/if}
    </p>
    <p class="trend-sub">
      {#if streakDays >= 7}
        连续 7 天以上学习，习惯养成中！
      {:else if streakDays >= 3}
        势头不错，再坚持几天就养成习惯了！
      {:else}
        每天听一小段，积少成多
      {/if}
    </p>
  </div>
</div>

<style>
  .dashboard {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .metric-card {
    padding: 16px 12px;
    border-radius: var(--radius-md);
    background: var(--c-surface);
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }

  .metric-emoji { font-size: 1.5rem; display: block; margin-bottom: 4px; }
  .metric-val { font-size: var(--font-xl); font-weight: 800; color: var(--c-primary); display: block; }
  .metric-label { font-size: 11px; color: var(--c-text-secondary); }

  .chart-section {
    background: var(--c-surface);
    border-radius: var(--radius-md);
    padding: 20px 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }

  .chart-title {
    font-size: var(--font-md);
    font-weight: 700;
    margin-bottom: 16px;
  }

  .bar-chart {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 100px;
  }

  .bar-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    height: 100%;
  }

  .bar {
    width: 32px;
    border-radius: 8px 8px 0 0;
    background: var(--c-primary);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-top: auto;
    transition: height 0.5s ease;
    min-height: 8px;
    position: relative;
  }

  .bar-val {
    position: absolute;
    top: -20px;
    font-size: 11px;
    font-weight: 700;
    color: var(--c-primary);
  }

  .bar-label {
    font-size: 10px;
    color: var(--c-text-secondary);
    margin-top: 4px;
  }

  .section {
    background: var(--c-surface);
    border-radius: var(--radius-md);
    padding: 20px 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }

  .trend-text {
    font-size: var(--font-md);
    font-weight: 600;
  }

  .trend-sub {
    font-size: var(--font-sm);
    color: var(--c-text-secondary);
    margin-top: 4px;
  }
</style>
