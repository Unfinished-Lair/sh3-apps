<script lang="ts">
  let {
    activeView,
    ontoggleview,
    onclearall,
  }: {
    activeView: 'zone' | 'shard';
    ontoggleview: (view: 'zone' | 'shard') => void;
    onclearall: () => void;
  } = $props();
</script>

<div class="top-bar">
  <div class="left">
    <div class="view-toggle">
      <button
        class="toggle-opt"
        class:active={activeView === 'zone'}
        onclick={() => ontoggleview('zone')}
      >
        Zone View
      </button>
      <button
        class="toggle-opt"
        class:active={activeView === 'shard'}
        onclick={() => ontoggleview('shard')}
      >
        Shard View
      </button>
    </div>
  </div>
  <div class="right">
    <button class="clear-all-btn" onclick={onclearall}>Clear All Caches</button>
  </div>
</div>

<style>
  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-bottom: 1px solid var(--sh3-border);
    background: var(--sh3-bg);
    gap: 12px;
  }
  .left {
    display: flex;
    align-items: center;
  }
  .right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .view-toggle {
    display: flex;
    border: 1px solid var(--sh3-border);
    border-radius: 4px;
    overflow: hidden;
  }
  .toggle-opt {
    all: unset;
    padding: 4px 10px;
    font-size: 12px;
    cursor: pointer;
    color: var(--sh3-fg-muted);
    background: transparent;
  }
  .toggle-opt.active {
    background: var(--sh3-accent-muted);
    color: var(--sh3-fg);
  }
  .toggle-opt:hover:not(.active) {
    background: var(--sh3-bg-elevated);
  }
  .clear-all-btn {
    all: unset;
    padding: 4px 10px;
    font-size: 11px;
    border-radius: 4px;
    cursor: pointer;
    color: #ff6b6b;
    border: 1px solid #ff6b6b;
  }
  .clear-all-btn:hover {
    background: #ff6b6b;
    color: #fff;
  }
</style>
