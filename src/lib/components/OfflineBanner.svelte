<script lang="ts">
  import { network } from '$lib/stores/network.svelte';
</script>

{#if !network.online}
  <div class="banner">
    <span>📡</span>
    <span>离线中 — 使用已缓存的内容</span>
  </div>
{/if}

<style>
  .banner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #fef3c7;
    color: #92400e;
    font-size: var(--font-sm);
    font-weight: 600;
    justify-content: center;
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from { transform: translateY(-100%); }
    to { transform: translateY(0); }
  }
</style>
