<script lang="ts">
  import { shell } from 'sh3-core';
  import type { ColorPalette, ColorPickerPrefs } from '../types';
  import type { ApiInternals } from '../model/api';
  import { normalizeHex } from '../util/color';
  import { isModKey } from '../util/keybindings';
  import Toolbar from './Toolbar.svelte';
  import ColorPickerSurface from './ColorPickerSurface.svelte';
  import type { ColorPanelDescriptor } from '../color-panel/contributions';

  interface Props {
    instanceId: string;
    adHocValue?: string;
    adHocReadonly?: boolean;
    internals: ApiInternals;
    userPalettes?: ColorPalette[];
    prefs?: ColorPickerPrefs;
    /** Compact inline layout (inspector renderer). */
    compact?: boolean;
    onSaveUserPalette?: (palette: ColorPalette) => void;
    onDeleteUserPalette?: (paletteId: string) => void;
    /** When set, pushValue calls this instead of mutating entry.value + pushing history.
     *  Used by the inspector renderer to let the walker own the parent write + history. */
    onExternalCommit?: (hex: string) => void;
    /** Cross-shard live panel binding. Resolved by shard.ts mount factory via
     *  selectBindingSource; absent means no descriptor matched. Mutually exclusive
     *  with the intra-shard entry path: when a descriptor is bound, `instanceId`
     *  refers to a registry slot that has no entry (or is intentionally not opened). */
    descriptorBinding?: ColorPanelDescriptor;
  }

  let {
    instanceId,
    adHocValue,
    adHocReadonly = false,
    internals,
    userPalettes = [],
    prefs = { mode: 'hsv' },
    compact = false,
    onSaveUserPalette,
    onDeleteUserPalette,
    onExternalCommit,
    descriptorBinding,
  }: Props = $props();

  let entry = $derived(internals.colorPickers.get(instanceId));
  let toolbarActions = $derived(entry?.options.toolbarActions ?? []);

  // --- Descriptor-mode internal state ---
  // When `descriptorBinding` is present (and no entry shadows it), the picker
  // owns a transient $state seeded from descriptor.initial. User commits and
  // history moves emit descriptor.onChange; controller.setValue mutates this
  // state without echoing back through onChange.
  let descriptorValue = $state(
    descriptorBinding ? (normalizeHex(descriptorBinding.initial) ?? '#000000') : '#000000',
  );

  // --- Value source-of-truth: entry > descriptor > adHoc. ---
  let value = $derived.by(() => {
    if (entry) return entry.value;
    if (descriptorBinding) return descriptorValue;
    return normalizeHex(adHocValue ?? '') ?? '#000000';
  });
  let readonly = $derived(entry ? Boolean(entry.options.readonly) : adHocReadonly);

  // --- History (standalone mode only; onExternalCommit bypasses) ---
  const history = internals.history(instanceId);

  function pushValue(nextHex: string) {
    if (readonly) return;
    const normalized = normalizeHex(nextHex);
    if (!normalized) return;
    if (onExternalCommit) {
      onExternalCommit(normalized);
      return;
    }
    const prev = value;
    if (prev === normalized) return;
    const applyTarget = (h: string) => {
      if (entry) entry.value = h;
      else if (descriptorBinding) descriptorValue = h;
    };
    history.push({
      apply: () => applyTarget(normalized),
      revert: () => applyTarget(prev),
      meta: { kind: 'color', timestamp: Date.now() },
    });
    applyTarget(normalized);
    internals.colorPickerValueChange.emit(instanceId, normalized);
    if (descriptorBinding && !entry) descriptorBinding.onChange(normalized);
  }

  // Emit on history movements (undo/redo mutates entry.value or descriptorValue;
  // fire both the internal bus and the descriptor's onChange so the host syncs).
  $effect(() => {
    const off = history.onChange(() => {
      internals.colorPickerValueChange.emit(instanceId, value);
      if (descriptorBinding && !entry) descriptorBinding.onChange(value);
    });
    return () => off();
  });

  function handleModeChange(mode: ColorPickerPrefs['mode']) {
    internals.colorPickerPrefsChange.emit(instanceId, { mode });
  }

  // --- Compact: preview + hex input + click-to-open-popup ---
  const compactDisplayHex = $derived(
    /^#[0-9a-f]{6}$/i.test(value) ? value.toUpperCase() : value,
  );
  let compactHexInput = $state(compactDisplayHex);
  $effect(() => { compactHexInput = compactDisplayHex; });

  function applyCompactHex() {
    if (readonly) return;
    const normalized = normalizeHex(compactHexInput.trim());
    if (!normalized) {
      compactHexInput = compactDisplayHex;
      return;
    }
    pushValue(normalized);
  }

  function onCompactHexKey(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.currentTarget as HTMLInputElement).blur();
    }
  }

  let previewEl: HTMLDivElement | undefined = $state();

  function openFullPicker() {
    if (readonly || !previewEl) return;
    shell.popup.show(
      ColorPickerSurface,
      { anchor: previewEl },
      {
        value,
        readonly,
        initialMode: prefs.mode,
        userPalettes,
        onChange: (hex: string) => pushValue(hex),
        onModeChange: handleModeChange,
        onSaveUserPalette,
        onDeleteUserPalette,
      },
    );
  }

  function onPreviewKey(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openFullPicker();
    }
  }

  // --- Standalone view keyboard shortcuts (undo/redo). ---
  let rootEl: HTMLDivElement | undefined = $state();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key.toLowerCase() === 'z' && isModKey(e) && !e.shiftKey) {
      e.preventDefault();
      history.undo();
      return;
    }
    if ((e.key.toLowerCase() === 'y' && isModKey(e)) ||
        (e.key.toLowerCase() === 'z' && isModKey(e) && e.shiftKey)) {
      e.preventDefault();
      history.redo();
      return;
    }
  }
</script>

{#if compact}
  <div
    class="cp-compact"
    class:disabled={readonly}
    role="region"
    aria-label="Color picker"
  >
    <div class="cp-compact-row">
      <div
        class="cp-preview cp-compact-preview"
        bind:this={previewEl}
        style:background-color={value}
        role="button"
        tabindex={readonly ? -1 : 0}
        aria-label="Open full color picker"
        aria-haspopup="true"
        onclick={openFullPicker}
        onkeydown={onPreviewKey}
      ></div>
      <input
        type="text"
        class="cp-hex-input cp-compact-hex"
        bind:value={compactHexInput}
        onblur={applyCompactHex}
        onkeydown={onCompactHexKey}
        disabled={readonly}
        aria-label="Hex value"
      />
    </div>
  </div>
{:else}
  <div
    class="cp"
    class:disabled={readonly}
    tabindex="-1"
    bind:this={rootEl}
    onkeydown={handleKeydown}
    role="region"
    aria-label="Color picker"
  >
    {#if toolbarActions.length > 0}
      <Toolbar actions={toolbarActions} filePath={null} />
    {/if}
    <ColorPickerSurface
      {value}
      {readonly}
      initialMode={prefs.mode}
      {userPalettes}
      onChange={pushValue}
      onModeChange={handleModeChange}
      {onSaveUserPalette}
      {onDeleteUserPalette}
    />
  </div>
{/if}

<style>
  .cp {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--shell-border);
    border-radius: 6px;
    width: fit-content;
  }
  .cp.disabled { opacity: 0.5; pointer-events: none; }

  .cp-compact {
    position: relative;
    display: inline-block;
    font-family: var(--shell-font-ui);
  }
  .cp-compact.disabled { opacity: 0.5; pointer-events: none; }

  .cp-compact-row { display: flex; align-items: center; gap: 6px; }
  .cp-compact-preview {
    width: 20px;
    height: 20px;
    cursor: pointer;
    border: 1px solid var(--shell-border);
    border-radius: 4px;
    flex-shrink: 0;
    outline: none;
  }
  .cp-compact-preview:focus-visible {
    box-shadow: 0 0 0 2px var(--shell-accent, #3a7eff);
  }
  .cp-preview {
    width: 28px; height: 28px; border-radius: 4px;
    border: 1px solid var(--shell-border); flex-shrink: 0;
  }
  .cp-hex-input {
    flex: 1; padding: 4px 8px;
    background: var(--shell-input-bg); color: var(--shell-fg);
    border: 1px solid var(--shell-border); border-radius: 4px;
    font-size: var(--font-size); font-family: inherit; outline: none;
  }
  .cp-hex-input:focus { border-color: var(--shell-accent, #3a7eff); }
  .cp-compact-hex {
    width: 90px; font-size: 12px;
  }
</style>
