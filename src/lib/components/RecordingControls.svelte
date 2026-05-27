<script lang="ts">
  import { onMount } from 'svelte';

  let { targetText = '' }: { targetText?: string } = $props();

  let recording = $state(false);
  let recorded = $state(false);
  let playing = $state(false);
  let mediaRecorder: MediaRecorder | null = null;
  let audioChunks: Blob[] = [];
  let audioUrl = $state('');
  let audioEl: HTMLAudioElement | null = null;
  let errorMsg = $state('');

  onMount(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  });

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/webm' });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        audioUrl = URL.createObjectURL(blob);
        recorded = true;
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      recording = true;
      errorMsg = '';
    } catch (e: any) {
      errorMsg = '无法访问麦克风：' + (e.message || '请检查权限设置');
    }
  }

  function stopRecording() {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      recording = false;
    }
  }

  function playRecording() {
    if (!audioUrl || !audioEl) return;
    audioEl.currentTime = 0;
    audioEl.play();
    playing = true;
  }

  function stopPlayback() {
    if (audioEl) {
      audioEl.pause();
      playing = false;
    }
  }

  function reset() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    audioUrl = '';
    recorded = false;
    playing = false;
  }
</script>

<div class="recording-panel">
  <div class="target-text">{targetText || '请先选择一段文字来跟读'}</div>

  {#if errorMsg}
    <p class="error">{errorMsg}</p>
  {/if}

  <div class="controls">
    {#if !recording && !recorded}
      <button class="btn-record" onclick={startRecording}>🎤 开始跟读</button>
    {:else if recording}
      <button class="btn-stop" onclick={stopRecording}>⏹️ 停止录音</button>
    {:else if recorded}
      {#if playing}
        <button class="btn-stop" onclick={stopPlayback}>⏸️ 停止播放</button>
      {:else}
        <button class="btn-play" onclick={playRecording}>▶️ 听我的录音</button>
      {/if}
      <button class="btn-retry" onclick={reset}>🔄 重录</button>
    {/if}
  </div>

  {#if recorded}
    <div class="waveform">
      <div class="wave-bar" style="width: {Math.random() * 60 + 20}%"></div>
      <div class="wave-bar" style="width: {Math.random() * 60 + 40}%"></div>
      <div class="wave-bar" style="width: {Math.random() * 60 + 30}%"></div>
      <div class="wave-bar" style="width: {Math.random() * 60 + 50}%"></div>
      <div class="wave-bar" style="width: {Math.random() * 60 + 35}%"></div>
      <div class="wave-bar" style="width: {Math.random() * 60 + 45}%"></div>
    </div>
  {/if}

  {#if recorded}
    <!-- svelte-ignore a11y-media-has-caption -->
    <audio bind:this={audioEl} src={audioUrl} onended={() => playing = false} class="hidden-audio" />
  {/if}
</div>

<style>
  .recording-panel {
    padding: 16px;
    text-align: center;
  }

  .target-text {
    font-size: var(--font-lg);
    font-weight: 600;
    color: var(--c-primary);
    margin-bottom: 16px;
    padding: 12px;
    background: var(--c-primary-bg);
    border-radius: var(--radius-md);
    line-height: 1.6;
  }

  .error {
    color: var(--c-danger);
    font-size: var(--font-sm);
    margin-bottom: 8px;
  }

  .controls {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .btn-record, .btn-stop, .btn-play, .btn-retry {
    padding: 14px 28px;
    border-radius: 28px;
    font-weight: 700;
    font-size: var(--font-md);
    min-height: 56px;
    transition: all 0.15s;
  }

  .btn-record { background: #ef4444; color: white; animation: pulse-btn 1.5s ease-in-out infinite; }
  .btn-stop { background: var(--c-text); color: white; }
  .btn-play { background: var(--c-success); color: white; }
  .btn-retry { background: var(--c-primary-bg); color: var(--c-primary); }

  @keyframes pulse-btn {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
    50% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
  }

  .waveform {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    height: 48px;
  }

  .wave-bar {
    width: 6px;
    border-radius: 3px;
    background: var(--c-primary);
    animation: wave 1s ease-in-out infinite;
  }

  .wave-bar:nth-child(2) { animation-delay: 0.1s; }
  .wave-bar:nth-child(3) { animation-delay: 0.2s; }
  .wave-bar:nth-child(4) { animation-delay: 0.3s; }
  .wave-bar:nth-child(5) { animation-delay: 0.4s; }
  .wave-bar:nth-child(6) { animation-delay: 0.5s; }

  @keyframes wave {
    0%, 100% { height: 12px; }
    50% { height: 36px; }
  }

  .hidden-audio { display: none; }
</style>
