<script lang="ts">
  import { player } from '$lib/stores/player.svelte';
  import type { Episode, EpisodeContent, VocabItem } from '$lib/types';
  import { TOPIC_EMOJI, TOPIC_LABEL } from '$lib/types';
  import ThemeBackground from './ThemeBackground.svelte';
  import SubtitlePanel from './SubtitlePanel.svelte';
  import AudioControls from './AudioControls.svelte';
  import WordPopup from './WordPopup.svelte';
  import RecordingControls from './RecordingControls.svelte';

  let { episode, content }: { episode: Episode; content: EpisodeContent } = $props();
  let showWordPopup = $state(false);
  let selectedWord = $state<VocabItem | null>(null);
  let mode: 'listen' | 'speak' = $state('listen');

  function handleWordClick(word: string) {
    const found = content.vocabulary.find(
      (v) => v.word.toLowerCase() === word.toLowerCase()
    );
    if (found) {
      selectedWord = found;
      showWordPopup = true;
    }
  }

  function closeWordPopup() {
    showWordPopup = false;
    selectedWord = null;
  }
</script>

<ThemeBackground topic={episode.topic}>
  <div class="player-page page-transition">
    <a href="/" class="back-btn">← 返回</a>

    <div class="header">
      <span class="topic-badge">{TOPIC_EMOJI[episode.topic]} {TOPIC_LABEL[episode.topic]}</span>
      <h1 class="title">{episode.title}</h1>
      <p class="subtitle">{episode.titleCn}</p>
    </div>

    <div class="mode-toggle">
      <button class="mode-btn" class:active={mode === 'listen'} onclick={() => mode = 'listen'}>🎧 听故事</button>
      <button class="mode-btn" class:active={mode === 'speak'} onclick={() => mode = 'speak'}>🎤 跟读</button>
    </div>

    {#if mode === 'listen'}
      <div class="cover-area">
        {#if episode.coverUrl}
          <img class="cover-img" src={episode.coverUrl} alt={episode.title} />
        {:else}
          <div class="cover-placeholder">
            <span class="cover-emoji">{TOPIC_EMOJI[episode.topic]}</span>
          </div>
        {/if}
      </div>

      <SubtitlePanel onWordClick={handleWordClick} />

      <AudioControls />
    {:else}
      <div class="speak-area">
        <RecordingControls targetText={player.segments[player.currentSegmentIndex]?.text || content.segments[0]?.text || ''} />
        <div class="next-sentence">
          <p class="next-label">下一句：</p>
          <p class="next-text">{content.segments[player.currentSegmentIndex + 1]?.text || '已完成！'}</p>
        </div>
      </div>
    {/if}
  </div>
</ThemeBackground>

<WordPopup
  word={selectedWord?.word ?? ''}
  definitionCn={selectedWord?.definitionCn ?? ''}
  pronunciation={selectedWord?.pronunciation ?? ''}
  partOfSpeech={selectedWord?.partOfSpeech ?? ''}
  show={showWordPopup}
  onclose={closeWordPopup}
/>

<style>
  .player-page {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    position: relative;
    z-index: 1;
  }

  .back-btn {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 10;
    padding: 8px 16px;
    border-radius: 20px;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(8px);
    font-size: var(--font-sm);
    font-weight: 700;
    color: var(--c-text-secondary);
  }

  .header {
    text-align: center;
    padding: 40px 40px 4px 40px;
  }

  .topic-badge {
    display: inline-block;
    padding: 4px 14px;
    border-radius: 20px;
    background: rgba(255,255,255,0.8);
    backdrop-filter: blur(4px);
    font-size: var(--font-sm);
    font-weight: 600;
    color: var(--c-primary);
    margin-bottom: 8px;
  }

  .title {
    font-size: var(--font-lg);
    font-weight: 800;
  }

  .subtitle {
    font-size: var(--font-sm);
    color: var(--c-text-secondary);
    margin-top: 2px;
  }

  .cover-area {
    padding: 16px 0;
    display: flex;
    justify-content: center;
  }

  .cover-placeholder {
    width: 140px;
    height: 140px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.5rem;
    background: rgba(255,255,255,0.7);
    backdrop-filter: blur(12px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.06);
    animation: pulse 3s ease-in-out infinite;
  }

  .cover-img {
    width: 140px;
    height: 140px;
    border-radius: var(--radius-lg);
    object-fit: cover;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.03); }
  }

  .mode-toggle {
    display: flex;
    gap: 8px;
    padding: 8px 16px;
    justify-content: center;
  }

  .mode-btn {
    padding: 8px 20px;
    border-radius: 20px;
    font-weight: 600;
    font-size: var(--font-sm);
    background: rgba(255,255,255,0.6);
    color: var(--c-text-secondary);
    transition: all 0.2s;
  }

  .mode-btn.active {
    background: var(--c-primary);
    color: white;
  }

  .speak-area {
    flex: 1;
    overflow-y: auto;
  }

  .next-sentence {
    text-align: center;
    padding: 16px 20px;
  }

  .next-label {
    font-size: var(--font-sm);
    color: var(--c-text-secondary);
    margin-bottom: 4px;
  }

  .next-text {
    font-size: var(--font-md);
    font-weight: 600;
    color: var(--c-text);
  }
</style>
