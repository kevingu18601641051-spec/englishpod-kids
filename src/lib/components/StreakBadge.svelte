<script lang="ts">
  let { days }: { days: number } = $props();
</script>

<div class="streak" class:active={days > 0}>
  <span class="streak-icon">🔥</span>
  <span class="streak-count">{days}</span>
  <span class="streak-label">天</span>
</div>

<style>
  .streak {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 14px;
    border-radius: 20px;
    background: #f3f4f6;
    font-weight: 700;
    font-size: var(--font-sm);
  }

  .streak.active {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
  }

  .streak-icon { font-size: 1.25rem; }
  .streak-count { font-size: var(--font-md); }
  .streak-label { color: var(--c-text-secondary); }
</style>
