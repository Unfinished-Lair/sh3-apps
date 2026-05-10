<script lang="ts">
  import 'sh3-core/tokens.css';
  import { Button } from 'sh3-core';
  import type { ThemeState } from '../theme-manager';
  import {
    applyTheme,
    findTheme,
    snapshotForDefault,
    renameTheme,
    DEFAULT_THEME_ID,
  } from '../theme-manager';
  import type { DefaultTheme } from '../types';
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

  let editingName = $state('');
  $effect(() => {
    if (selectedTheme && isUserTheme) {
      editingName = selectedTheme.name;
    }
  });

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
</script>

<div class="style-edit-view">
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
        <Button disabled={isConfirmed} onclick={onConfirm}>Use style</Button>
        {#if isAdmin && !isDefault}
          <Button variant="ghost" onclick={onSetDefault}>Set as default</Button>
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

<style>
  .style-edit-view {
    height: 100%;
    width: 100%;
    min-width: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 12px;
    box-sizing: border-box;
    color: var(--sh3-fg);
    font-family: var(--sh3-font-ui);
    font-size: var(--sh3-font-size);
  }
  .editor-header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
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
    color: var(--sh3-fg);
    border-bottom: 1px solid var(--sh3-border);
    padding: 0 2px 2px;
    min-width: 100px;
    max-width: 100%;
  }
  .name-input:focus {
    border-bottom-color: var(--sh3-accent);
  }
  .badge {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 3px;
    background: var(--sh3-accent-muted);
    color: var(--sh3-fg);
    white-space: nowrap;
  }
  .badge.builtin {
    background: var(--sh3-accent);
    color: var(--sh3-bg);
  }
  .badge.default {
    background: var(--sh3-accent);
    color: var(--sh3-bg);
  }
  .header-actions {
    margin-left: auto;
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .editor-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .default-message {
    color: var(--sh3-fg-muted);
    padding: 24px 0;
  }
  .default-message p {
    margin: 0;
  }

  /* On narrow widths (handheld drawer body, phone portrait), let header
     actions drop below the title and consume full width. */
  @media (max-width: 480px) {
    .header-actions {
      margin-left: 0;
      width: 100%;
    }
  }
</style>
