<script lang="ts">
  import ParentDashboard from '$lib/components/ParentDashboard.svelte';

  let unlocked = $state(false);
  let answer = $state('');
  let showError = $state(false);
  let activeTab: 'settings' | 'report' = $state('report');
  const correctAnswer = '7';
</script>

<div class="settings-page">
  <h1 class="page-title">⚙️ 设置</h1>

  {#if !unlocked}
    <div class="gate">
      <p class="gate-title">家长验证</p>
      <p class="gate-question">3 + 4 = ?</p>
      <input
        type="number"
        class="gate-input"
        bind:value={answer}
        placeholder="输入答案"
        onkeydown={(e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            if (answer === correctAnswer) {
              unlocked = true;
              showError = false;
            } else {
              showError = true;
            }
          }
        }}
      />
      {#if showError}
        <p class="gate-error">答案不对哦~</p>
      {/if}
      <button
        class="gate-btn"
        onclick={() => {
          if (answer === correctAnswer) {
            unlocked = true;
            showError = false;
          } else {
            showError = true;
          }
        }}
      >
        确认
      </button>
    </div>
  {:else}
    <div class="parent-tabs">
      <button class="ptab" class:active={activeTab === 'report'} onclick={() => activeTab = 'report'}>📊 学习报告</button>
      <button class="ptab" class:active={activeTab === 'settings'} onclick={() => activeTab = 'settings'}>⚙️ 设置</button>
    </div>

    {#if activeTab === 'report'}
      <ParentDashboard />
    {:else}
    <div class="settings-content">
      <div class="setting-item">
        <div class="setting-label">
          <span class="setting-icon">🚌</span>
          <div>
            <p class="setting-title">通勤时间</p>
            <p class="setting-desc">应用会在通勤前自动下载内容</p>
          </div>
        </div>
        <input type="time" class="time-input" value="08:00" />
      </div>

      <div class="setting-item">
        <div class="setting-label">
          <span class="setting-icon">📊</span>
          <div>
            <p class="setting-title">难度级别</p>
            <p class="setting-desc">当前由系统自动调整</p>
          </div>
        </div>
        <span class="setting-value">自动</span>
      </div>

      <div class="setting-item">
        <div class="setting-label">
          <span class="setting-icon">📅</span>
          <div>
            <p class="setting-title">连续学习</p>
            <p class="setting-desc">保持每天学习！</p>
          </div>
        </div>
        <span class="setting-value">马上开始</span>
      </div>

      <button class="reset-btn" onclick={() => { localStorage.clear(); window.location.href = '/'; }}>
        重置所有数据
      </button>
    </div>
    {/if}
  {/if}
</div>

<style>
  .settings-page { padding-bottom: 20px; }

  .parent-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  .ptab {
    flex: 1;
    padding: 10px;
    border-radius: var(--radius-sm);
    background: var(--c-surface);
    font-weight: 600;
    font-size: var(--font-sm);
    text-align: center;
    min-height: 44px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }

  .ptab.active {
    background: var(--c-primary);
    color: white;
  }
  .gate {
    text-align: center;
    padding: 40px 20px;
  }

  .gate-title {
    font-size: var(--font-lg);
    font-weight: 700;
    margin-bottom: 16px;
  }

  .gate-question {
    font-size: var(--font-xl);
    font-weight: 800;
    color: var(--c-primary);
    margin-bottom: 16px;
  }

  .gate-input {
    width: 120px;
    padding: 10px 16px;
    border: 2px solid var(--c-primary-light);
    border-radius: var(--radius-sm);
    font-size: var(--font-lg);
    text-align: center;
    outline: none;
    margin-bottom: 12px;
  }

  .gate-input:focus { border-color: var(--c-primary); }

  .gate-error { color: var(--c-danger); font-size: var(--font-sm); margin-bottom: 8px; }

  .gate-btn {
    display: block;
    margin: 0 auto;
    padding: 10px 32px;
    border-radius: 20px;
    background: var(--c-primary);
    color: white;
    font-weight: 600;
    font-size: var(--font-md);
    min-height: var(--touch-target);
  }

  .settings-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-radius: var(--radius-md);
    background: var(--c-surface);
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }

  .setting-label {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .setting-icon { font-size: 1.5rem; }
  .setting-title { font-weight: 600; font-size: var(--font-md); }
  .setting-desc { font-size: var(--font-sm); color: var(--c-text-secondary); }
  .setting-value { font-weight: 600; color: var(--c-primary); font-size: var(--font-sm); }

  .time-input {
    padding: 6px 12px;
    border: 2px solid #e5e7eb;
    border-radius: var(--radius-sm);
    font-size: var(--font-md);
    outline: none;
  }

  .reset-btn {
    margin-top: 20px;
    padding: 12px;
    border-radius: var(--radius-md);
    color: var(--c-danger);
    font-weight: 600;
    font-size: var(--font-sm);
    text-align: center;
    background: #fef2f2;
    min-height: var(--touch-target);
  }
</style>
