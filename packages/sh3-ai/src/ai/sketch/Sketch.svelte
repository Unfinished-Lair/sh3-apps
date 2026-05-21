<script lang="ts">
  import { Button } from 'sh3-core';
  import type { SketchState, SketchSnapshot } from './state';

  // Rename `state` → `sketch` on destructure: a local binding named `state`
  // collides with Svelte 5's `$state` rune detection, same as Defaults.svelte.
  let {
    state: sketch,
    onSave,
    onOpen,
  }: { state: SketchState; onSave: () => void; onOpen: () => void } = $props();

  // `subscribe` immediately invokes the listener with the current snapshot,
  // so initializing to null is safe — the callback fires synchronously
  // inside the effect.
  let snapshot = $state<SketchSnapshot | null>(null);

  let styleLabel = $derived.by(() => {
    if (!snapshot) return 'Style: —';
    return snapshot.mode === 'inline' ? 'Style: SH3' : 'Style: None';
  });

  $effect(() => {
    const off = sketch.subscribe((s) => {
      snapshot = s;
    });
    return () => off();
  });

  // Strip <style> blocks from inline-mode HTML. <style> attaches globally
  // to the document regardless of nesting — leaving it in would let the
  // sketch's CSS hijack the host layout (and the host would visibly snap
  // back when the view unmounts and the <style> element disappears).
  // Inline mode is for sketches that use SH3 host CSS; if the AI wants
  // its own styles it should use isolated mode.
  function stripStyleTags(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('style').forEach((el) => el.remove());
    return doc.body.innerHTML;
  }

  let inlineHtml = $derived(
    snapshot && snapshot.mode === 'inline' ? stripStyleTags(snapshot.html) : '',
  );
</script>

<div class="sketch-root">
  <div class="sketch-toolbar">
    <span class="mode-badge" class:dim={!snapshot}>
      {styleLabel}
    </span>
    <span class="spacer"></span>
    <Button
      variant="icon"
      icon="folder-open"
      title="Open saved sketch…"
      onclick={() => onOpen()}
    />
    <Button
      variant="icon"
      icon="save"
      title="Save sketch…"
      disabled={!snapshot}
      onclick={() => onSave()}
    />
  </div>

  <div class="sketch-body">
    {#if !snapshot}
      <p class="placeholder">
        Waiting for the AI to call <code>ai.sketch.show</code>…
      </p>
    {:else if snapshot.mode === 'inline'}
      <div class="sketch-canvas">{@html inlineHtml}</div>
    {:else}
      <iframe
        title="AI Sketch (isolated)"
        srcdoc={snapshot.html}
        sandbox="allow-same-origin"
      ></iframe>
    {/if}
  </div>
</div>

<style>
  .sketch-root {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .sketch-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    border-bottom: 1px solid var(--sh3-border);
    font-size: 12px;
  }
  .mode-badge {
    padding: 2px 6px;
    border-radius: var(--sh3-radius, 4px);
    background: var(--sh3-bg-elevated);
    font-family: var(--sh3-mono, monospace);
  }
  .mode-badge.dim {
    opacity: 0.45;
  }
  .spacer {
    flex: 1;
  }
  .sketch-body {
    flex: 1;
    overflow: auto;
  }
  .sketch-canvas {
    padding: 12px;
  }
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
  .placeholder {
    padding: 16px;
    color: var(--sh3-fg-muted);
  }
</style>
