<script lang="ts">
  import type { ThemeState } from '../theme-manager';
  import {
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
    state,
    selectedThemeId,
    activeThemeId,
    defaultTheme,
    onselect,
  }: {
    state: ThemeState;
    selectedThemeId: string;
    activeThemeId: string;
    defaultTheme: DefaultTheme | null;
    onselect: (id: string) => void;
  } = $props();

  function handleNew() {
    const theme = createTheme('New Theme', state);
    onselect(theme.id);
  }

  function handleDuplicate() {
    const theme = duplicateTheme(selectedThemeId, state);
    if (theme) onselect(theme.id);
  }

  function handleDelete() {
    if (deleteTheme(selectedThemeId, state)) {
      onselect(activeThemeId);
    }
  }

  function handleExport() {
    const data = exportTheme(selectedThemeId, state);
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
        const theme = importTheme(parsed, state);
        if (theme) onselect(theme.id);
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

<div class="sidebar">
  {#if defaultTheme}
    <div class="section-label">Default</div>
    <button
      class="theme-item"
      class:selected={selectedThemeId === DEFAULT_THEME_ID}
      class:active={activeThemeId === DEFAULT_THEME_ID}
      onclick={() => onselect(DEFAULT_THEME_ID)}
    >
      <span class="name">{defaultTheme.name}</span>
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
      onclick={() => onselect(theme.id)}
    >
      <span class="lock">🔒</span>
      <span class="name">{theme.name}</span>
      {#if activeThemeId === theme.id}
        <span class="active-dot"></span>
      {/if}
    </button>
  {/each}

  {#if state.userThemes.length > 0}
    <div class="section-label">User</div>
    {#each state.userThemes as theme}
      <button
        class="theme-item"
        class:selected={selectedThemeId === theme.id}
        class:active={activeThemeId === theme.id}
        onclick={() => onselect(theme.id)}
      >
        <span class="name">{theme.name}</span>
        {#if activeThemeId === theme.id}
          <span class="active-dot"></span>
        {/if}
      </button>
    {/each}
  {/if}

  <div class="sidebar-actions">
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
  .sidebar {
    width: 180px;
    min-width: 140px;
    border-right: 1px solid var(--sh3-border);
    padding: var(--sh3-pad-md);
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow-y: auto;
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
  .sidebar-actions {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-top: 8px;
  }
  .action-row {
    display: flex;
    gap: 4px;
  }
  .action-row .action-btn { flex: 1; }
  .action-btn {
    all: unset;
    padding: 4px 8px;
    background: var(--sh3-bg-elevated);
    border-radius: 4px;
    text-align: center;
    font-size: 11px;
    cursor: pointer;
    color: var(--sh3-fg);
  }
  .action-btn:hover {
    background: var(--sh3-border);
  }
  .action-btn.danger {
    color: #ff6b6b;
  }
</style>
