<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { player } from '$lib/stores/player.svelte';
  import { progress } from '$lib/stores/progress.svelte';
  import { loadContent, play, stop } from '$lib/audio/player';
  import { getContent } from '$lib/api/content';
  import { reportSession } from '$lib/api/client';
  import FullPlayer from '$lib/components/FullPlayer.svelte';
  import CompletionModal from '$lib/components/CompletionModal.svelte';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import type { EpisodeContent } from '$lib/types';

  let content: EpisodeContent | null = $state(null);
  let showCompletion = $state(false);
  let loading = $state(true);

  onMount(async () => {
    const id = $page.params.id;
    const c = await getContent(id);
    if (c) {
      content = c;
      player.loadContent(c);
      loading = false;
      startPlayback(c);
    } else {
      loading = false;
    }
    return () => stop();
  });

  function onEpisodeComplete() {
    showCompletion = true;
    progress.completeEpisode(content!.episode.durationSec);

    const uid = localStorage.getItem('epkids_device_id') || '';
    reportSession({
      user: uid,
      episode: content!.episode.id,
      listenSeconds: Math.round(content!.episode.durationSec),
      completed: true,
      avgSpeed: player.playbackSpeed,
      lookups: 0,
      replayCount: 0
    }).catch(() => {});
  }

  function startPlayback(c: EpisodeContent) {
    loadContent(c.segments, onEpisodeComplete);
    play();
  }

  function replay() {
    showCompletion = false;
    if (content) startPlayback(content);
  }

  function closeCompletion() {
    showCompletion = false;
    window.location.href = '/';
  }
</script>

{#if loading}
  <LoadingSpinner message="加载故事中..." />
{:else if content}
  <FullPlayer episode={content.episode} content={content} />

  <CompletionModal
    show={showCompletion}
    title={content.episode.titleCn}
    wordsLearned={content.vocabulary.length}
    streakDays={progress.streakDays + 1}
    onclose={closeCompletion}
    onreplay={replay}
  />
{:else}
  <div class="empty-state">
    <p class="icon">🐰</p>
    <p>找不到这个故事...</p>
    <a href="/" class="back-link">回到首页</a>
  </div>
{/if}

<style>
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100dvh;
    gap: 12px;
    color: var(--c-text-secondary);
  }

  .empty-state .icon { font-size: 4rem; }

  .back-link {
    color: var(--c-primary);
    font-weight: 600;
    text-decoration: underline;
  }
</style>
