<script lang="ts">
  import { onMount } from 'svelte';
  import type { ColorPalette, ColorPickerPrefs } from '../types';
  import {
    hsvToRgb,
    hsvToHex,
    hexToHsv,
    rgbToHex,
    normalizeHex,
    type HSV,
  } from '../util/color';
  import { DEFAULT_PALETTES } from '../model/default-palettes';

  interface Props {
    /** Controlled hex value. Surface syncs its internal HSV from this whenever
     *  the prop changes AND the incoming hex differs from the last one it
     *  emitted, so external undo/redo updates don't fight user drags. */
    value: string;
    readonly?: boolean;
    /** Optional initial mode. Not reactive — change the key on the mount call
     *  to pick a new mode. */
    initialMode?: ColorPickerPrefs['mode'];
    userPalettes?: ColorPalette[];
    /** Called on every user-driven commit: drag end, slider change, hex Enter/blur,
     *  swatch click, palette save. NOT called when `value` changes from outside. */
    onChange: (hex: string) => void;
    /** Called when the user toggles HSV↔RGB; consumer persists if desired. */
    onModeChange?: (mode: ColorPickerPrefs['mode']) => void;
    onSaveUserPalette?: (palette: ColorPalette) => void;
    onDeleteUserPalette?: (paletteId: string) => void;
    /** Supplied by shell.popup.show when mounted as a popup. Ignored when the
     *  surface is embedded in the standalone ColorPicker view. */
    close?: () => void;
  }

  let {
    value,
    readonly = false,
    initialMode = 'hsv',
    userPalettes = [],
    onChange,
    onModeChange,
    onSaveUserPalette,
    onDeleteUserPalette,
    close: _close,
  }: Props = $props();

  const SQUARE_SIZE = 180;
  const STRIP_WIDTH = 20;

  // --- HSV state, driven by controlled `value` ---
  const initialHex = normalizeHex(value) ?? '#000000';
  let hsv = $state<HSV>(hexToHsv(initialHex));
  let lastSyncedHex = $state(initialHex);
  let mode = $state<'hsv' | 'rgb'>(initialMode);

  // Sync external `value` → internal hsv. Only trigger when the incoming hex
  // differs from the last hex we either synced in or emitted — this avoids
  // echoing the user's own drag back through as an "external" update.
  $effect(() => {
    const current = normalizeHex(value) ?? '#000000';
    if (current !== lastSyncedHex) {
      hsv = hexToHsv(current);
      lastSyncedHex = current;
      hexInput = current.toUpperCase();
    }
  });

  function emit(hex: string) {
    const normalized = normalizeHex(hex);
    if (!normalized) return;
    if (normalized === lastSyncedHex) return;
    lastSyncedHex = normalized;
    onChange(normalized);
  }

  function commitSlider() {
    emit(hsvToHex(hsv));
  }

  // --- Canvas refs + rendering ---
  let squareEl: HTMLCanvasElement | undefined = $state();
  let stripEl: HTMLCanvasElement | undefined = $state();
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  function renderSquare() {
    if (!squareEl) return;
    const w = SQUARE_SIZE, h = SQUARE_SIZE;
    squareEl.width = w * dpr;
    squareEl.height = h * dpr;
    squareEl.style.width = w + 'px';
    squareEl.style.height = h + 'px';
    const ctx = squareEl.getContext('2d')!;
    const img = ctx.createImageData(w * dpr, h * dpr);
    const data = img.data;
    for (let py = 0; py < h * dpr; py++) {
      for (let px = 0; px < w * dpr; px++) {
        const s = (px / dpr / w) * 100;
        const v = (1 - py / dpr / h) * 100;
        const rgbPx = hsvToRgb({ h: hsv.h, s, v });
        const idx = (py * w * dpr + px) * 4;
        data[idx] = rgbPx.r;
        data[idx + 1] = rgbPx.g;
        data[idx + 2] = rgbPx.b;
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    drawSquareIndicator();
  }

  function drawSquareIndicator() {
    if (!squareEl) return;
    const ctx = squareEl.getContext('2d')!;
    const x = (hsv.s / 100) * SQUARE_SIZE;
    const y = (1 - hsv.v / 100) * SQUARE_SIZE;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  function renderStrip() {
    if (!stripEl) return;
    const w = STRIP_WIDTH, h = SQUARE_SIZE;
    stripEl.width = w * dpr;
    stripEl.height = h * dpr;
    stripEl.style.width = w + 'px';
    stripEl.style.height = h + 'px';
    const ctx = stripEl.getContext('2d')!;
    const img = ctx.createImageData(w * dpr, h * dpr);
    const data = img.data;
    for (let py = 0; py < h * dpr; py++) {
      const hue = (py / (h * dpr)) * 360;
      const rgbPx = hsvToRgb({ h: hue, s: 100, v: 100 });
      for (let px = 0; px < w * dpr; px++) {
        const idx = (py * w * dpr + px) * 4;
        data[idx] = rgbPx.r;
        data[idx + 1] = rgbPx.g;
        data[idx + 2] = rgbPx.b;
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    drawStripIndicator();
  }

  function drawStripIndicator() {
    if (!stripEl) return;
    const ctx = stripEl.getContext('2d')!;
    const y = (hsv.h / 360) * SQUARE_SIZE;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(STRIP_WIDTH, y);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(STRIP_WIDTH, y);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  onMount(() => {
    renderSquare();
    renderStrip();
  });

  let lastH = $state(hsv.h);
  $effect(() => {
    if (hsv.h !== lastH) {
      lastH = hsv.h;
      renderSquare();
      drawStripIndicator();
    } else {
      renderSquare();
    }
  });

  // --- Drag interaction ---
  let squareDragging = $state(false);
  let stripDragging = $state(false);

  function pickFromSquare(e: MouseEvent) {
    if (readonly || !squareEl) return;
    const rect = squareEl.getBoundingClientRect();
    const x = Math.max(0, Math.min(SQUARE_SIZE, e.clientX - rect.left));
    const y = Math.max(0, Math.min(SQUARE_SIZE, e.clientY - rect.top));
    const s = (x / SQUARE_SIZE) * 100;
    const v = (1 - y / SQUARE_SIZE) * 100;
    hsv = { h: hsv.h, s: Math.round(s), v: Math.round(v) };
  }

  function pickFromStrip(e: MouseEvent) {
    if (readonly || !stripEl) return;
    const rect = stripEl.getBoundingClientRect();
    const y = Math.max(0, Math.min(SQUARE_SIZE, e.clientY - rect.top));
    const h = (y / SQUARE_SIZE) * 360;
    hsv = { h: Math.round(h), s: hsv.s, v: hsv.v };
  }

  function onSquareDown(e: MouseEvent) {
    if (readonly) return;
    squareDragging = true;
    pickFromSquare(e);
    window.addEventListener('mousemove', onWinMove);
    window.addEventListener('mouseup', onWinUp);
  }
  function onStripDown(e: MouseEvent) {
    if (readonly) return;
    stripDragging = true;
    pickFromStrip(e);
    window.addEventListener('mousemove', onWinMove);
    window.addEventListener('mouseup', onWinUp);
  }
  function onWinMove(e: MouseEvent) {
    if (squareDragging) pickFromSquare(e);
    else if (stripDragging) pickFromStrip(e);
  }
  function onWinUp() {
    if (squareDragging || stripDragging) {
      emit(hsvToHex(hsv));
    }
    squareDragging = false;
    stripDragging = false;
    window.removeEventListener('mousemove', onWinMove);
    window.removeEventListener('mouseup', onWinUp);
  }

  // --- Sliders + mode ---
  const hueGradient =
    'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)';
  const satGradient = $derived.by(() => {
    const full = rgbToHex(hsvToRgb({ h: hsv.h, s: 100, v: hsv.v }));
    return `linear-gradient(to right, #ffffff, ${full})`;
  });
  const valGradient = $derived.by(() => {
    const full = rgbToHex(hsvToRgb({ h: hsv.h, s: hsv.s, v: 100 }));
    return `linear-gradient(to right, #000000, ${full})`;
  });

  const rgb = $derived(hsvToRgb(hsv));

  function setH(e: Event) { hsv = { ...hsv, h: +(e.target as HTMLInputElement).value }; }
  function setS(e: Event) { hsv = { ...hsv, s: +(e.target as HTMLInputElement).value }; }
  function setV(e: Event) { hsv = { ...hsv, v: +(e.target as HTMLInputElement).value }; }
  function setR(e: Event) {
    const r = +(e.target as HTMLInputElement).value;
    hsv = hexToHsv(rgbToHex({ r, g: rgb.g, b: rgb.b }));
  }
  function setG(e: Event) {
    const g = +(e.target as HTMLInputElement).value;
    hsv = hexToHsv(rgbToHex({ r: rgb.r, g, b: rgb.b }));
  }
  function setB(e: Event) {
    const b = +(e.target as HTMLInputElement).value;
    hsv = hexToHsv(rgbToHex({ r: rgb.r, g: rgb.g, b }));
  }

  function toggleMode(next: 'hsv' | 'rgb') {
    if (mode === next) return;
    mode = next;
    onModeChange?.(next);
  }

  // --- Hex input ---
  let hexInput = $state(initialHex.toUpperCase());
  $effect(() => { hexInput = hsvToHex(hsv).toUpperCase(); });

  function applyHexInput() {
    if (readonly) return;
    const cleaned = hexInput.trim();
    const normalized = normalizeHex(cleaned);
    if (!normalized) {
      hexInput = hsvToHex(hsv).toUpperCase();
      return;
    }
    hsv = hexToHsv(normalized);
    emit(normalized);
  }

  function onHexKey(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.currentTarget as HTMLInputElement).blur();
    }
  }

  const currentHex = $derived(hsvToHex(hsv));

  // --- Palette ---
  const allPalettes = $derived<ColorPalette[]>([...DEFAULT_PALETTES, ...userPalettes]);
  let selectedPaletteId = $state<string>(DEFAULT_PALETTES[0].id);
  const selectedPalette = $derived(
    allPalettes.find((p) => p.id === selectedPaletteId) ?? allPalettes[0],
  );

  function pickSwatch(hex: string) {
    if (readonly) return;
    const normalized = normalizeHex(hex);
    if (!normalized) return;
    hsv = hexToHsv(normalized);
    emit(normalized);
  }

  // --- User-palette CRUD ---
  let savePromptOpen = $state(false);
  let savePromptName = $state('');

  function uuid(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'u-' + Math.random().toString(36).slice(2, 10);
  }

  function startSave() {
    if (readonly) return;
    if (selectedPalette?.builtin) {
      savePromptName = '';
      savePromptOpen = true;
      return;
    }
    if (!selectedPalette) return;
    const updated: ColorPalette = {
      ...selectedPalette,
      colors: [...selectedPalette.colors, currentHex],
    };
    onSaveUserPalette?.(updated);
  }

  function confirmSavePrompt() {
    if (readonly) return;
    const label = savePromptName.trim();
    if (!label) return;
    const palette: ColorPalette = {
      id: 'user-' + uuid(),
      label,
      colors: [currentHex],
    };
    onSaveUserPalette?.(palette);
    selectedPaletteId = palette.id;
    savePromptOpen = false;
    savePromptName = '';
  }

  function cancelSavePrompt() {
    savePromptOpen = false;
    savePromptName = '';
  }

  function deleteSelected() {
    if (readonly || !selectedPalette || selectedPalette.builtin) return;
    const id = selectedPalette.id;
    onDeleteUserPalette?.(id);
    selectedPaletteId = DEFAULT_PALETTES[0].id;
  }

  // --- Keyboard arrow keys on canvases ---
  function handleKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement | null;
    const step = e.shiftKey ? 10 : 1;
    if (target === squareEl) {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); hsv = { ...hsv, s: Math.max(0, hsv.s - step) };   commitSlider(); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); hsv = { ...hsv, s: Math.min(100, hsv.s + step) }; commitSlider(); return; }
      if (e.key === 'ArrowUp')    { e.preventDefault(); hsv = { ...hsv, v: Math.min(100, hsv.v + step) }; commitSlider(); return; }
      if (e.key === 'ArrowDown')  { e.preventDefault(); hsv = { ...hsv, v: Math.max(0, hsv.v - step) };   commitSlider(); return; }
    } else if (target === stripEl) {
      if (e.key === 'ArrowUp')   { e.preventDefault(); hsv = { ...hsv, h: Math.max(0, hsv.h - step) };   commitSlider(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); hsv = { ...hsv, h: Math.min(360, hsv.h + step) }; commitSlider(); return; }
    }
  }
</script>

<div class="cp-surface" class:disabled={readonly} onkeydown={handleKeydown} role="group" aria-label="Color picker">
  <div class="cp-main">
    <div class="cp-left">
      <div class="cp-body">
        <canvas
          bind:this={squareEl}
          class="cp-square"
          onmousedown={onSquareDown}
          role="slider"
          aria-label="Saturation and value"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={hsv.v}
          tabindex={readonly ? -1 : 0}
        ></canvas>
        <canvas
          bind:this={stripEl}
          class="cp-strip"
          onmousedown={onStripDown}
          role="slider"
          aria-label="Hue"
          aria-valuemin={0}
          aria-valuemax={360}
          aria-valuenow={hsv.h}
          tabindex={readonly ? -1 : 0}
        ></canvas>
      </div>

      <div class="cp-mode">
        <button type="button" class:active={mode === 'hsv'} onclick={() => toggleMode('hsv')} disabled={readonly}>HSV</button>
        <button type="button" class:active={mode === 'rgb'} onclick={() => toggleMode('rgb')} disabled={readonly}>RGB</button>
      </div>

      {#if mode === 'hsv'}
        <div class="cp-sliders">
          <label class="cp-row">
            <span class="cp-label">H</span>
            <input type="range" min="0" max="360" value={hsv.h}
                   oninput={setH} onchange={commitSlider}
                   class="cp-range" style:--track-bg={hueGradient} disabled={readonly}/>
            <span class="cp-value">{hsv.h}°</span>
          </label>
          <label class="cp-row">
            <span class="cp-label">S</span>
            <input type="range" min="0" max="100" value={hsv.s}
                   oninput={setS} onchange={commitSlider}
                   class="cp-range" style:--track-bg={satGradient} disabled={readonly}/>
            <span class="cp-value">{hsv.s}%</span>
          </label>
          <label class="cp-row">
            <span class="cp-label">V</span>
            <input type="range" min="0" max="100" value={hsv.v}
                   oninput={setV} onchange={commitSlider}
                   class="cp-range" style:--track-bg={valGradient} disabled={readonly}/>
            <span class="cp-value">{hsv.v}%</span>
          </label>
        </div>
      {:else}
        <div class="cp-sliders">
          <label class="cp-row">
            <span class="cp-label">R</span>
            <input type="range" min="0" max="255" value={rgb.r}
                   oninput={setR} onchange={commitSlider}
                   class="cp-range" disabled={readonly}/>
            <span class="cp-value">{rgb.r}</span>
          </label>
          <label class="cp-row">
            <span class="cp-label">G</span>
            <input type="range" min="0" max="255" value={rgb.g}
                   oninput={setG} onchange={commitSlider}
                   class="cp-range" disabled={readonly}/>
            <span class="cp-value">{rgb.g}</span>
          </label>
          <label class="cp-row">
            <span class="cp-label">B</span>
            <input type="range" min="0" max="255" value={rgb.b}
                   oninput={setB} onchange={commitSlider}
                   class="cp-range" disabled={readonly}/>
            <span class="cp-value">{rgb.b}</span>
          </label>
        </div>
      {/if}

      <div class="cp-hex-row">
        <div class="cp-preview" style:background-color={currentHex}></div>
        <input
          type="text"
          class="cp-hex-input"
          bind:value={hexInput}
          onblur={applyHexInput}
          onkeydown={onHexKey}
          disabled={readonly}
          aria-label="Hex value"
        />
      </div>
    </div>

    <div class="cp-right">
      <div class="cp-palette">
        <select
          class="cp-palette-select"
          bind:value={selectedPaletteId}
          disabled={readonly}
          aria-label="Palette"
        >
          {#each allPalettes as p (p.id)}
            <option value={p.id}>{p.label}{p.builtin ? '' : ' (user)'}</option>
          {/each}
        </select>
        <div class="cp-swatches">
          {#each selectedPalette?.colors ?? [] as color}
            <button
              type="button"
              class="cp-swatch"
              class:active={color.toLowerCase() === currentHex.toLowerCase()}
              style:background-color={color}
              onclick={() => pickSwatch(color)}
              title={color.toUpperCase()}
              aria-label={color.toUpperCase()}
              disabled={readonly}
            ></button>
          {/each}
        </div>
        <div class="cp-palette-actions">
          <button
            type="button"
            class="cp-palette-btn"
            onclick={startSave}
            disabled={readonly}
            title="Save current color to a palette"
          >+ Save</button>
          <button
            type="button"
            class="cp-palette-btn cp-delete"
            onclick={deleteSelected}
            disabled={readonly || (selectedPalette?.builtin ?? true)}
            title={selectedPalette?.builtin ? 'Built-in palettes cannot be deleted' : 'Delete palette'}
          >Delete</button>
        </div>
        {#if savePromptOpen}
          <div class="cp-save-prompt">
            <input
              type="text"
              class="cp-save-input"
              bind:value={savePromptName}
              placeholder="Palette name"
              onkeydown={(e) => { if (e.key === 'Enter') confirmSavePrompt(); if (e.key === 'Escape') cancelSavePrompt(); }}
            />
            <button type="button" class="cp-palette-btn" onclick={confirmSavePrompt} disabled={!savePromptName.trim()}>OK</button>
            <button type="button" class="cp-palette-btn" onclick={cancelSavePrompt}>Cancel</button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .cp-surface {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    background: var(--shell-bg-light);
    border-radius: 6px;
    font-family: var(--shell-font-ui);
    width: fit-content;
  }
  .cp-surface.disabled { opacity: 0.5; pointer-events: none; }

  .cp-main { display: flex; gap: 16px; }
  .cp-left { display: flex; flex-direction: column; gap: 10px; }
  .cp-right { display: flex; flex-direction: column; min-width: 180px; }

  .cp-body { display: flex; gap: 8px; }
  .cp-square { border: 1px solid var(--shell-border-light); border-radius: 4px; cursor: crosshair; }
  .cp-strip { border: 1px solid var(--shell-border-light); border-radius: 4px; cursor: pointer; }

  .cp-mode { display: inline-flex; gap: 0; }
  .cp-mode button {
    appearance: none; font: inherit; font-size: 11px; padding: 3px 10px;
    background: var(--shell-bg-lighter); color: var(--shell-text);
    border: 1px solid var(--shell-border-light); cursor: pointer;
  }
  .cp-mode button:first-child { border-radius: 4px 0 0 4px; border-right: none; }
  .cp-mode button:last-child  { border-radius: 0 4px 4px 0; }
  .cp-mode button.active { background: var(--shell-accent, #3a7eff); color: var(--shell-bg); }

  .cp-sliders { display: flex; flex-direction: column; gap: 6px; }
  .cp-row { display: flex; align-items: center; gap: 8px; }
  .cp-label { width: 14px; font-size: 11px; color: var(--shell-text-dim); text-align: right; }
  .cp-value { width: 40px; font-size: 11px; color: var(--shell-text-dim); text-align: right; }

  .cp-range {
    flex: 1; appearance: none; height: 8px; border-radius: 4px;
    background: var(--track-bg, var(--shell-bg-lighter)); outline: none; cursor: pointer;
  }
  .cp-range::-webkit-slider-thumb {
    appearance: none; width: 14px; height: 14px; border-radius: 50%;
    background: var(--shell-text-bright); border: 2px solid var(--shell-border-light); cursor: pointer;
  }
  .cp-range::-moz-range-thumb {
    width: 14px; height: 14px; border-radius: 50%;
    background: var(--shell-text-bright); border: 2px solid var(--shell-border-light); cursor: pointer;
  }

  .cp-hex-row { display: flex; align-items: center; gap: 8px; }
  .cp-preview {
    width: 28px; height: 28px; border-radius: 4px;
    border: 1px solid var(--shell-border-light); flex-shrink: 0;
  }
  .cp-hex-input {
    flex: 1; padding: 4px 8px;
    background: var(--shell-bg-lighter); color: var(--shell-text);
    border: 1px solid var(--shell-border-light); border-radius: 4px;
    font-size: var(--font-size); font-family: inherit; outline: none;
  }
  .cp-hex-input:focus { border-color: var(--shell-accent, #3a7eff); }

  .cp-palette { display: flex; flex-direction: column; gap: 6px; }
  .cp-palette-select {
    appearance: none; font: inherit; font-size: 12px; padding: 4px 8px;
    background: var(--shell-bg-lighter); color: var(--shell-text);
    border: 1px solid var(--shell-border-light); border-radius: 4px; outline: none;
  }
  .cp-palette-select:focus { border-color: var(--shell-accent, #3a7eff); }

  .cp-swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(24px, 1fr)); gap: 4px; }
  .cp-swatch {
    width: 24px; height: 24px; border-radius: 4px;
    border: 1px solid var(--shell-border-light); cursor: pointer; padding: 0; outline: none;
  }
  .cp-swatch.active { box-shadow: 0 0 0 2px var(--shell-accent, #3a7eff); }

  .cp-palette-actions { display: flex; gap: 4px; }
  .cp-palette-btn {
    appearance: none; font: inherit; font-size: 11px; padding: 4px 8px;
    background: var(--shell-bg-lighter); color: var(--shell-text);
    border: 1px solid var(--shell-border-light); border-radius: 4px; cursor: pointer;
  }
  .cp-palette-btn:hover:not([disabled]) { background: var(--shell-bg-toolbar); }
  .cp-palette-btn[disabled] { opacity: 0.5; cursor: not-allowed; }

  .cp-save-prompt { display: flex; gap: 4px; align-items: center; }
  .cp-save-input {
    flex: 1; min-width: 0; padding: 3px 6px;
    background: var(--shell-bg-lighter); color: var(--shell-text);
    border: 1px solid var(--shell-border-light); border-radius: 4px;
    font-size: 12px; font-family: inherit; outline: none;
  }
</style>
