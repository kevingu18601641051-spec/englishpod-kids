<script lang="ts">
  import { addWord } from '$lib/offline/srs';

  let { word, definitionCn, pronunciation, partOfSpeech, show = true, onclose }: {
    word: string;
    definitionCn: string;
    pronunciation: string;
    partOfSpeech: string;
    show: boolean;
    onclose: () => void;
  } = $props();

  let saved = $state(false);

  function speak() {
    const u = new SpeechSynthesisUtterance(word);
    u.lang = 'en-US';
    u.rate = 0.8;
    speechSynthesis.speak(u);
  }

  function saveWord() {
    addWord(word, definitionCn, pronunciation);
    saved = true;
    setTimeout(() => onclose(), 600);
  }
</script>

{#if show}
  <div class="overlay" onclick={onclose} role="dialog">
    <div class="popup" onclick={(e: MouseEvent) => e.stopPropagation()}>
      <button class="close-btn" onclick={onclose}>✕</button>
      <h2 class="word-en">{word}</h2>
      <p class="pos">{partOfSpeech}</p>
      <p class="def">{definitionCn}</p>
      <p class="pron">{pronunciation}</p>
      <div class="actions">
        <button class="btn-speak" onclick={speak}>🔊 听发音</button>
        <button class="btn-save" onclick={saveWord}>{saved ? '✅ 已收藏' : '⭐ 收藏'}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    backdrop-filter: blur(4px);
  }

  .popup {
    background: var(--c-surface);
    border-radius: var(--radius-lg);
    padding: 32px 28px;
    width: min(320px, 85vw);
    text-align: center;
    position: relative;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    animation: pop 0.25s ease-out;
  }

  @keyframes pop {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #f3f4f6;
    font-size: 1rem;
  }

  .word-en {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--c-primary);
    margin-bottom: 4px;
  }

  .pos {
    font-size: var(--font-sm);
    color: var(--c-text-secondary);
    margin-bottom: 4px;
  }

  .def {
    font-size: var(--font-lg);
    font-weight: 600;
    margin-bottom: 4px;
  }

  .pron {
    font-size: var(--font-sm);
    color: var(--c-text-secondary);
    margin-bottom: 20px;
  }

  .actions {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .btn-speak, .btn-save {
    padding: 10px 20px;
    border-radius: 20px;
    font-size: var(--font-sm);
    font-weight: 600;
    min-height: 44px;
  }

  .btn-speak {
    background: var(--c-primary-bg);
    color: var(--c-primary);
  }

  .btn-save {
    background: var(--c-accent);
    color: white;
  }
</style>
