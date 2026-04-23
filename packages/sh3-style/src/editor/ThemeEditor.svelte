<script lang="ts">
  import 'sh3-core/tokens.css';
  import { setTokenOverrides } from 'sh3-core';
  import { onDestroy } from 'svelte';
  import type { ThemeState } from '../theme-manager';
  import {
    applyTheme,
    findTheme,
    resolveTokens,
    snapshotForDefault,
    renameTheme,
    buildDefaultPseudoTheme,
    DEFAULT_THEME_ID,
  } from '../theme-manager';
  import type { DefaultTheme } from '../types';
  import ThemeSidebar from './ThemeSidebar.svelte';
  import ColorSection from './ColorSection.svelte';
  import TypographySection from './TypographySection.svelte';
  import ShapeSection from './ShapeSection.svelte';
  import GradientSection from './GradientSection.svelte';

  let {
    state: themeState,
    ephemeralState,
    env,
    isAdmin,
    onEnvUpdate,
  }: {
    state: ThemeState;
    ephemeralState: { previewThemeId: string | null };
    env: { defaultTheme: DefaultTheme | null };
    isAdmin: boolean;
    onEnvUpdate: (patch: { defaultTheme: DefaultTheme | null }) => Promise<void>;
  } = $props();

  // Seed ephemeral preview to the confirmed theme on first mount, if unset.
  if (ephemeralState.previewThemeId == null) {
    ephemeralState.previewThemeId = themeState.useDefault
      ? DEFAULT_THEME_ID
      : themeState.activeThemeId;
  }

  // The editor's selection IS the ephemeral preview id. Reading through
  // ephemeralState means any outside writer (e.g. the `sh3-style:preview`
  // verb) updates the sidebar reactively.
  const previewThemeId = $derived(
    ephemeralState.previewThemeId ??
      (themeState.useDefault ? DEFAULT_THEME_ID : themeState.activeThemeId),
  );

  const selectedTheme = $derived(
    findTheme(previewThemeId, themeState, env.defaultTheme),
  );
  const isDefault = $derived(previewThemeId === DEFAULT_THEME_ID);
  const isBuiltin = $derived(selectedTheme?.builtin ?? true);
  const isUserTheme = $derived(!isBuiltin && !isDefault);
  const isConfirmed = $derived(
    isDefault
      ? themeState.useDefault
      : !themeState.useDefault && themeState.activeThemeId === previewThemeId,
  );

  // Editable name state for user themes.
  let editingName = $state('');
  $effect(() => {
    if (selectedTheme && isUserTheme) {
      editingName = selectedTheme.name;
    }
  });

  function onSelectTheme(id: string) {
    ephemeralState.previewThemeId = id;
    // Apply preview immediately.
    const theme = findTheme(id, themeState, env.defaultTheme);
    if (theme) {
      setTokenOverrides(resolveTokens(theme));
    }
  }

  function onConfirm() {
    if (isDefault) {
      themeState.useDefault = true;
    } else {
      themeState.useDefault = false;
      themeState.activeThemeId = previewThemeId;
    }
    applyTheme(
      isDefault ? DEFAULT_THEME_ID : previewThemeId,
      themeState,
      env.defaultTheme,
    );
  }

  async function onSetDefault() {
    if (!selectedTheme || isDefault) return;
    const snapshot = snapshotForDefault(selectedTheme);
    await onEnvUpdate({ defaultTheme: snapshot });
  }

  function onCommitName() {
    const trimmed = editingName.trim();
    if (trimmed && selectedTheme && isUserTheme) {
      renameTheme(previewThemeId, trimmed, themeState);
    } else if (selectedTheme) {
      editingName = selectedTheme.name;
    }
  }

  function onNameKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  }

  // On destroy, revert to confirmed theme if preview differs.
  onDestroy(() => {
    if (themeState.useDefault) {
      const pseudo = buildDefaultPseudoTheme(env.defaultTheme);
      if (pseudo) setTokenOverrides(resolveTokens(pseudo));
    } else {
      applyTheme(themeState.activeThemeId, themeState);
    }
  });
</script>

<div class="theme-editor">
  <ThemeSidebar
    state={themeState}
    selectedThemeId={previewThemeId}
    activeThemeId={themeState.useDefault ? DEFAULT_THEME_ID : themeState.activeThemeId}
    defaultTheme={env.defaultTheme}
    onselect={onSelectTheme}
  />
  <div class="editor-panel">
    {#if selectedTheme}
      <div class="editor-header">
        {#if isUserTheme}
          <input
            class="name-input"
            type="text"
            bind:value={editingName}
            onblur={onCommitName}
            onkeydown={onNameKeydown}
          />
        {:else}
          <h2>{selectedTheme.name}</h2>
        {/if}
        <span class="badge" class:builtin={isBuiltin} class:default={isDefault}>
          {isDefault ? 'DEFAULT' : isBuiltin ? 'BUILTIN' : 'USER'}
        </span>
        <div class="header-actions">
          <button
            class="action-btn primary"
            disabled={isConfirmed}
            onclick={onConfirm}
          >
            Use style
          </button>
          {#if isAdmin && !isDefault}
            <button class="action-btn" onclick={onSetDefault}>
              Set as default
            </button>
          {/if}
        </div>
      </div>

      {#if isDefault}
        <div class="default-message">
          <p>Default style set by an administrator.</p>
        </div>
      {:else}
        <div class="editor-body">
          <ColorSection theme={selectedTheme} state={themeState} disabled={isBuiltin} />
          <ShapeSection theme={selectedTheme} state={themeState} disabled={isBuiltin} />
          <TypographySection theme={selectedTheme} state={themeState} disabled={isBuiltin} />
          <GradientSection theme={selectedTheme} state={themeState} disabled={isBuiltin} />
        </div>
      {/if}
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
  .name-input {
    all: unset;
    font-size: 16px;
    font-weight: bold;
    color: var(--shell-fg);
    border-bottom: 1px solid var(--shell-border);
    padding: 0 2px 2px;
    min-width: 100px;
  }
  .name-input:focus {
    border-bottom-color: var(--shell-accent);
  }
  .badge {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 3px;
    background: var(--shell-accent-muted);
    color: var(--shell-fg);
    white-space: nowrap;
  }
  .badge.builtin {
    background: var(--shell-accent);
    color: var(--shell-bg);
  }
  .badge.default {
    background: var(--shell-accent);
    color: var(--shell-bg);
  }
  .header-actions {
    margin-left: auto;
    display: flex;
    gap: 6px;
  }
  .editor-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .default-message {
    color: var(--shell-fg-muted);
    padding: 24px 0;
  }
  .default-message p {
    margin: 0;
  }
  .action-btn {
    all: unset;
    padding: 4px 8px;
    background: var(--shell-bg-elevated);
    border-radius: 4px;
    text-align: center;
    font-size: 11px;
    cursor: pointer;
    color: var(--shell-fg);
    white-space: nowrap;
  }
  .action-btn:hover {
    background: var(--shell-border);
  }
  .action-btn:disabled {
    opacity: 0.4;
    cursor: default;
  }
  .action-btn:disabled:hover {
    background: var(--shell-bg-elevated);
  }
  .action-btn.primary {
    background: var(--shell-accent);
    color: var(--shell-bg);
  }
  .action-btn.primary:hover {
    opacity: 0.9;
  }
  .action-btn.primary:disabled {
    opacity: 0.4;
  }
  .action-btn.primary:disabled:hover {
    opacity: 0.4;
  }
</style>
