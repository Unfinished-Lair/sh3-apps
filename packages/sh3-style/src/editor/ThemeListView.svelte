<script lang="ts">
  import { setTokenOverrides } from 'sh3-core';
  import type { ThemeState } from '../theme-manager';
  import {
    applyTheme,
    findTheme,
    resolveTokens,
    createTheme,
    duplicateTheme,
    deleteTheme,
    importTheme,
    exportTheme,
    DEFAULT_THEME_ID,
  } from '../theme-manager';
  import { BUILTIN_PRESETS } from '../presets';
  import type { DefaultTheme } from '../types';

  let {
    state: themeState,
    ephemeralState,
    env,
  }: {
    state: ThemeState;
    ephemeralState: { previewThemeId: string | null };
    env: { defaultTheme: DefaultTheme | null };
  } = $props();

  const selectedThemeId = $derived(
    ephemeralState.previewThemeId ??
      (themeState.useDefault ? DEFAULT_THEME_ID : themeState.activeThemeId),
  );
  const activeThemeId = $derived(
    themeState.useDefault ? DEFAULT_THEME_ID : themeState.activeThemeId,
  );

  function selectTheme(id: string) {
    ephemeralState.previewThemeId = id;
    const theme = findTheme(id, themeState, env.defaultTheme);
    if (theme) setTokenOverrides(resolveTokens(theme));
  }

  function handleNew() {
    const theme = createTheme('New Theme', themeState);
    selectTheme(theme.id);
  }

  function handleDuplicate() {
    const theme = duplicateTheme(selectedThemeId, themeState);
    if (theme) selectTheme(theme.id);
  }

  function handleDelete() {
    if (deleteTheme(selectedThemeId, themeState)) {
      selectTheme(activeThemeId);
      applyTheme(themeState.activeThemeId, themeState, env.defaultTheme);
    }
  }

  function handleExport() {
    const data = exportTheme(selectedThemeId, themeState);
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name.replace(/\s+/g, '-').toLowerCase()}.sh3theme.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.sh3theme.json,.json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const theme = importTheme(parsed, themeState);
        if (theme) selectTheme(theme.id);
      } catch {
        // Invalid file — silently ignore
      }
    };
    input.click();
  }

  const isSelectedBuiltin = $derived(
    selectedThemeId === DEFAULT_THEME_ID
    || BUILTIN_PRESETS.some(p => p.id === selectedThemeId),
  );
</script>

<div class="theme-list-view">
  <div class="list">
    {#if env.defaultTheme}
      <div class="section-label">Default</div>
      <button
        class="theme-item"
        class:selected={selectedThemeId === DEFAULT_THEME_ID}
        class:active={activeThemeId === DEFAULT_THEME_ID}
        onclick={() => selectTheme(DEFAULT_THEME_ID)}
      >
        <span class="name">{env.defaultTheme.name}</span>
        {#if activeThemeId === DEFAULT_THEME_ID}
          <span class="active-dot"></span>
        {/if}
      </button>
    {/if}

    <div class="section-label">Built-in</div>
    {#each BUILTIN_PRESETS as theme}
      <button
        class="theme-item"
        class:selected={selectedThemeId === theme.id}
        class:active={activeThemeId === theme.id}
        onclick={() => selectTheme(theme.id)}
      >
        <span class="lock">🔒</span>
        <span class="name">{theme.name}</span>
        {#if activeThemeId === theme.id}
          <span class="active-dot"></span>
        {/if}
      </button>
    {/each}

    {#if themeState.userThemes.length > 0}
      <div class="section-label">User</div>
      {#each themeState.userThemes as theme}
        <button
          class="theme-item"
          class:selected={selectedThemeId === theme.id}
          class:active={activeThemeId === theme.id}
          onclick={() => selectTheme(theme.id)}
        >
          <span class="name">{theme.name}</span>
          {#if activeThemeId === theme.id}
            <span class="active-dot"></span>
          {/if}
        </button>
      {/each}
    {/if}
  </div>

  <div class="list-actions">
    <button class="action-btn" onclick={handleNew}>+ New Theme</button>
    <button class="action-btn" onclick={handleDuplicate}>Duplicate</button>
    <div class="action-row">
      <button class="action-btn" onclick={handleImport}>Import</button>
      <button class="action-btn" onclick={handleExport}>Export</button>
    </div>
    {#if !isSelectedBuiltin}
      <button class="action-btn danger" onclick={handleDelete}>Delete</button>
    {/if}
  </div>
</div>

<style>
  .theme-list-view {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    min-width: 0;
    color: var(--sh3-fg);
    font-family: var(--sh3-font-ui);
    font-size: var(--sh3-font-size);
    padding: var(--sh3-pad-md);
    box-sizing: border-box;
    overflow: hidden;
  }
  .list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow-y: auto;
    min-height: 0;
  }
  .section-label {
    font-size: 10px;
    text-transform: uppercase;
    color: var(--sh3-fg-subtle);
    padding: 4px 8px;
    margin-top: 8px;
  }
  .section-label:first-child { margin-top: 0; }
  .theme-item {
    all: unset;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: var(--sh3-font-size);
    color: var(--sh3-fg);
    /* Larger touch target on coarse pointers */
    min-height: 32px;
  }
  .theme-item:hover {
    background: var(--sh3-bg-elevated);
  }
  .theme-item.selected {
    background: var(--sh3-accent-muted);
    border-left: 2px solid var(--sh3-accent);
  }
  .lock { font-size: 10px; }
  .name { flex: 1; }
  .active-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--sh3-accent);
  }
  .list-actions {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-top: 8px;
    flex-shrink: 0;
  }
  .action-row {
    display: flex;
    gap: 4px;
  }
  .action-row .action-btn { flex: 1; }
  .action-btn {
    all: unset;
    padding: 6px 8px;
    background: var(--sh3-bg-elevated);
    border-radius: 4px;
    text-align: center;
    font-size: 11px;
    cursor: pointer;
    color: var(--sh3-fg);
    min-height: 32px;
    box-sizing: border-box;
  }
  .action-btn:hover {
    background: var(--sh3-border);
  }
  .action-btn.danger {
    color: #ff6b6b;
  }
</style>
