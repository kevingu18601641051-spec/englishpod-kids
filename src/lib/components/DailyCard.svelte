<script lang="ts">
  import { TOPIC_EMOJI, TOPIC_LABEL, type Episode } from '$lib/types';

  let { episode }: { episode: Episode } = $props();
</script>

<a href="/player/{episode.id}" class="card">
  <div class="card-cover topic-{episode.topic}">
    <span class="card-emoji">{TOPIC_EMOJI[episode.topic]}</span>
  </div>
  <div class="card-body">
    <span class="card-topic">{TOPIC_EMOJI[episode.topic]} {TOPIC_LABEL[episode.topic]}</span>
    <h3 class="card-title">{episode.title}</h3>
    <p class="card-desc">{episode.description}</p>
    <div class="card-meta">
      <span>⏱ {Math.floor(episode.durationSec / 60)} 分钟</span>
      <span>📊 {'⭐'.repeat(Math.min(episode.difficulty, 5))}</span>
    </div>
  </div>
</a>

<style>
  .card {
    display: flex;
    gap: 16px;
    padding: 16px;
    border-radius: var(--radius-lg);
    background: var(--c-surface);
    box-shadow: var(--shadow-card);
    min-height: 140px;
  }

  .card-cover {
    width: 100px;
    height: 100px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    flex-shrink: 0;
  }

  .topic-magic { background: linear-gradient(135deg, #e0e7ff, #fae8ff); }
  .topic-animals { background: linear-gradient(135deg, #dcfce7, #fef9c3); }
  .topic-friendship { background: linear-gradient(135deg, #fce7f3, #ede9fe); }
  .topic-nature { background: linear-gradient(135deg, #d1fae5, #dbeafe); }
  .topic-adventure { background: linear-gradient(135deg, #fed7aa, #fee2e2); }
  .topic-art { background: linear-gradient(135deg, #fef3c7, #fce7f3); }
  .topic-songs { background: linear-gradient(135deg, #ede9fe, #dbeafe); }
  .topic-mystery { background: linear-gradient(135deg, #e0e7ff, #d1fae5); }

  .card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .card-topic {
    font-size: var(--font-sm);
    color: var(--c-primary);
    font-weight: 600;
  }

  .card-title {
    font-size: var(--font-md);
    font-weight: 700;
  }

  .card-desc {
    font-size: var(--font-sm);
    color: var(--c-text-secondary);
    line-height: 1.4;
    flex: 1;
  }

  .card-meta {
    display: flex;
    gap: 12px;
    font-size: var(--font-sm);
    color: var(--c-text-secondary);
  }
</style>
