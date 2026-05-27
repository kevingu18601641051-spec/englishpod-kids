<script lang="ts">
  let { message = '加载中...' }: { message?: string } = $props();
</script>

<div class="loading">
  <div class="spinner">
    <div class="dot d1"></div>
    <div class="dot d2"></div>
    <div class="dot d3"></div>
  </div>
  <p class="msg">{message}</p>
</div>

<style>
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    gap: 20px;
  }

  .spinner {
    display: flex;
    gap: 8px;
  }

  .dot {
    width: 16px; height: 16px;
    border-radius: 50%;
    background: var(--c-primary);
    animation: bounce 1.4s ease-in-out infinite;
  }

  .d1 { animation-delay: 0s; }
  .d2 { animation-delay: 0.15s; }
  .d3 { animation-delay: 0.3s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }

  .msg {
    font-size: var(--font-sm);
    color: var(--c-text-secondary);
  }
</style>
