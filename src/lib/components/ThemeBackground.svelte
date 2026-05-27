<script lang="ts">
  import type { Topic } from '$lib/types';

  let { topic = 'magic' as Topic }: { topic?: Topic } = $props();

  const gradients: Record<Topic, string> = {
    magic: 'linear-gradient(135deg, #ede9fe 0%, #fae8ff 30%, #fdf2f8 60%, #e0e7ff 100%)',
    animals: 'linear-gradient(135deg, #dcfce7 0%, #fef9c3 30%, #fef3c7 60%, #d1fae5 100%)',
    friendship: 'linear-gradient(135deg, #fce7f3 0%, #ede9fe 30%, #fdf2f8 60%, #fce7f3 100%)',
    nature: 'linear-gradient(135deg, #d1fae5 0%, #dbeafe 30%, #e0f2fe 60%, #d1fae5 100%)',
    adventure: 'linear-gradient(135deg, #fed7aa 0%, #fee2e2 30%, #fef3c7 60%, #fed7aa 100%)',
    art: 'linear-gradient(135deg, #fef3c7 0%, #fce7f3 30%, #ede9fe 60%, #fef3c7 100%)',
    songs: 'linear-gradient(135deg, #ede9fe 0%, #dbeafe 30%, #e0e7ff 60%, #ede9fe 100%)',
    mystery: 'linear-gradient(135deg, #e0e7ff 0%, #d1fae5 30%, #dcfce7 60%, #e0e7ff 100%)'
  };

  const accentColors: Record<Topic, string> = {
    magic: '#a855f7', animals: '#22c55e', friendship: '#ec4899', nature: '#06b6d4',
    adventure: '#f97316', art: '#eab308', songs: '#6366f1', mystery: '#10b981'
  };
</script>

<div
  class="theme-bg"
  style="background: {gradients[topic]}; --topic-accent: {accentColors[topic]}"
>
  <div class="floating-shapes">
    <span class="shape s1"></span>
    <span class="shape s2"></span>
    <span class="shape s3"></span>
  </div>
  <slot />
</div>

<style>
  .theme-bg {
    position: relative;
    min-height: 100%;
    transition: background 0.6s ease;
    overflow: hidden;
  }

  .floating-shapes {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
  }

  .shape {
    position: absolute;
    border-radius: 50%;
    opacity: 0.15;
    animation: float 20s ease-in-out infinite;
  }

  .s1 {
    width: 200px; height: 200px;
    background: var(--topic-accent);
    top: -50px; right: -30px;
    animation-delay: 0s;
  }

  .s2 {
    width: 120px; height: 120px;
    background: var(--topic-accent);
    bottom: 20%; left: -30px;
    animation-delay: -7s;
  }

  .s3 {
    width: 80px; height: 80px;
    background: var(--topic-accent);
    top: 40%; right: 10%;
    animation-delay: -14s;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    33% { transform: translateY(-30px) rotate(5deg); }
    66% { transform: translateY(10px) rotate(-3deg); }
  }

  :global(.page-transition) {
    animation: fadeSlideIn 0.3s ease-out;
  }

  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
