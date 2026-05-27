<script lang="ts">
  let { show, title, wordsLearned, streakDays, onclose, onreplay }:
    { show: boolean; title: string; wordsLearned: number; streakDays: number; onclose: () => void; onreplay: () => void } = $props();

  function share() {
    // Trigger confetti-like celebration
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const e = document.createElement('span');
        e.textContent = ['⭐','🌟','✨','🎉','💜'][i % 5];
        e.style.cssText = `
          position:fixed; font-size:2rem; pointer-events:none; z-index:200;
          left:${Math.random()*100}%; top:${Math.random()*100}%;
          animation: popFade 0.8s ease-out forwards;
        `;
        document.body.appendChild(e);
        setTimeout(() => e.remove(), 800);
      }, i * 40);
    }
  }
</script>

{#if show}
  <div class="overlay" onclick={onclose} role="dialog">
    <div class="modal" onclick={(e: MouseEvent) => e.stopPropagation()}>
      <div class="confetti" onmount={share}></div>
      <span class="big-emoji">🎉</span>
      <h2 class="modal-title">太棒了！</h2>
      <p class="modal-sub">你完成了 <strong>{title}</strong></p>
      <div class="stats-row">
        <div class="stat">
          <span class="stat-val">{wordsLearned}</span>
          <span class="stat-label">学到的词</span>
        </div>
        <div class="stat">
          <span class="stat-val">🔥 {streakDays}</span>
          <span class="stat-label">连续天数</span>
        </div>
      </div>
      <div class="actions">
        <button class="btn-primary" onclick={onreplay}>🔄 再听一遍</button>
        <button class="btn-secondary" onclick={onclose}>✅ 完成</button>
      </div>
    </div>
  </div>

  <style>
    @keyframes popFade {
      0% { transform: translateY(0) scale(0); opacity: 1; }
      100% { transform: translateY(-80px) scale(1.2); opacity: 0; }
    }
  </style>
{/if}

<style>
  .overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 200;
    backdrop-filter: blur(6px);
  }

  .modal {
    background: var(--c-surface);
    border-radius: var(--radius-lg);
    padding: 40px 28px 28px;
    width: min(320px, 90vw);
    text-align: center;
    animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  @keyframes pop {
    from { transform: scale(0.7); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .big-emoji { font-size: 4rem; display: block; margin-bottom: 8px; }

  .modal-title { font-size: var(--font-xl); font-weight: 800; margin-bottom: 4px; }
  .modal-sub { font-size: var(--font-sm); color: var(--c-text-secondary); margin-bottom: 20px; }

  .stats-row {
    display: flex; justify-content: center; gap: 24px; margin-bottom: 24px;
  }

  .stat { display: flex; flex-direction: column; align-items: center; }
  .stat-val { font-size: var(--font-lg); font-weight: 800; color: var(--c-primary); }
  .stat-label { font-size: 11px; color: var(--c-text-secondary); }

  .actions { display: flex; gap: 10px; justify-content: center; }

  .btn-primary, .btn-secondary {
    padding: 12px 24px; border-radius: 24px;
    font-weight: 600; font-size: var(--font-sm); min-height: 48px;
  }

  .btn-primary { background: var(--c-primary); color: white; }
  .btn-secondary { background: var(--c-primary-bg); color: var(--c-primary); }
</style>
