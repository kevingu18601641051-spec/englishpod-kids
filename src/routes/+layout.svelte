<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { progress } from '$lib/stores/progress.svelte';
  import { initUser } from '$lib/api/client';
  import { precacheAllSeedContent } from '$lib/offline/precache';
  import OfflineBanner from '$lib/components/OfflineBanner.svelte';

  let { children } = $props();

  onMount(async () => {
    let id = localStorage.getItem('epkids_device_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('epkids_device_id', id);
    }
    progress.init(id);

    // Register with backend (fire-and-forget)
    try { await initUser(id); } catch { /* offline, will retry next time */ }

    // Precache seed content
    precacheAllSeedContent().catch(() => {});
  });

  const tabs = [
    { path: '/', icon: '🏠', label: '首页' },
    { path: '/library', icon: '📚', label: '故事库' },
    { path: '/words', icon: '⭐', label: '单词' },
    { path: '/settings', icon: '⚙️', label: '设置' },
  ];
</script>

<div class="app-shell">
  <OfflineBanner />
  <div class="app-content">
    {@render children()}
  </div>

  <nav class="bottom-nav">
    {#each tabs as tab}
      <a href={tab.path} class="nav-item" class:active={$page.url.pathname === tab.path}>
        <span class="nav-icon">{tab.icon}</span>
        <span class="nav-label">{tab.label}</span>
      </a>
    {/each}
  </nav>
</div>
