<script lang="ts">
  import 'sh3-core/tokens.css';
  import type { ThemeState } from '../theme-manager';
  import { allThemes, applyTheme, findTheme } from '../theme-manager';
  import ThemeSidebar from './ThemeSidebar.svelte';
  import ColorSection from './ColorSection.svelte';
  import TypographySection from './TypographySection.svelte';
  import GradientSection from './GradientSection.svelte';

  let { state: themeState }: { state: ThemeState } = $props();

  let selectedThemeId = $state(themeState.activeThemeId);

  const selectedTheme = $derived(findTheme(selectedThemeId, themeState));
  const isBuiltin = $derived(selectedTheme?.builtin ?? true);

  function onSelectTheme(id: string) {
    selectedThemeId = id;
  }

  function onActivateTheme(id: string) {
    themeState.activeThemeId = id;
    applyTheme(id, themeState);
  }
</script>

<div class="theme-editor">
  <ThemeSidebar
    state={themeState}
    {selectedThemeId}
    activeThemeId={themeState.activeThemeId}
    onselect={onSelectTheme}
    onactivate={onActivateTheme}
  />
  <div class="editor-panel">
    {#if selectedTheme}
      <div class="editor-header">
        <h2>{selectedTheme.name}</h2>
        <span class="badge" class:builtin={isBuiltin}>
          {isBuiltin ? 'BUILTIN' : 'USER'}
        </span>
      </div>
      <div class="editor-body">
        <ColorSection theme={selectedTheme} state={themeState} disabled={isBuiltin} />
        <TypographySection theme={selectedTheme} state={themeState} disabled={isBuiltin} />
        <GradientSection theme={selectedTheme} state={themeState} disabled={isBuiltin} />
      </div>
    {/if}
  </div>
</div>

<style>
  .theme-editor {
    display: flex;
    height: 100%;
    color: var(--shell-fg);
    font-family: var(--shell-font-ui);
    font-size: var(--shell-font-size);
  }
  .editor-panel {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
  }
  .editor-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }
  .editor-header h2 {
    margin: 0;
    font-size: 16px;
  }
  .badge {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 3px;
    background: var(--shell-accent-muted);
    color: var(--shell-fg);
  }
  .badge.builtin {
    background: var(--shell-accent);
    color: var(--shell-bg);
  }
  .editor-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
