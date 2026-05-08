<script lang="ts">
  import { marked } from 'marked';

  export type CardSegment =
    | { kind: 'text'; markdown: string }
    | {
        kind: 'tool-call';
        id: string;
        name: string;
        argsPreview: string;
        resultPreview?: string;
        error?: boolean;
      };

  interface Props {
    /** Preferred — ordered list of text + tool-call segments. */
    segments?: CardSegment[];
    /** Backward-compat: when no segments are passed, this is treated as
     *  a single text segment. The chat-only path still uses this. */
    markdown?: string;
    model: string | null;
    locked: boolean;
    __streamState?: 'streaming' | 'complete' | 'error';
    __aiCard?: boolean;
  }

  let {
    segments,
    markdown,
    model,
    locked,
    __streamState = 'streaming',
  }: Props = $props();

  const renderedSegments = $derived(
    (segments ?? (markdown != null ? [{ kind: 'text' as const, markdown }] : []))
      .map((seg) =>
        seg.kind === 'text'
          ? { kind: 'text' as const, html: marked.parse(seg.markdown ?? '', { async: false }) as string }
          : seg,
      ),
  );
</script>

<div class="ai-card" data-stream-state={__streamState}>
  {#if model}
    <div class="ai-card-header">
      {#if locked}🔒 {/if}model: {model}
    </div>
  {/if}
  <div class="ai-card-body">
    {#each renderedSegments as seg, i (i)}
      {#if seg.kind === 'text'}
        <div class="ai-text">{@html seg.html}</div>
      {:else}
        <div class="ai-tool" class:ai-tool-error={seg.error}>
          <div class="ai-tool-head">
            <span class="ai-tool-arrow">↳</span>
            <span class="ai-tool-name">{seg.name}</span>
            <span class="ai-tool-args">({seg.argsPreview})</span>
            {#if seg.resultPreview === undefined}
              <span class="ai-tool-spin">…</span>
            {:else if seg.error}
              <span class="ai-tool-mark">✕</span>
            {:else}
              <span class="ai-tool-mark">✓</span>
            {/if}
          </div>
          {#if seg.resultPreview !== undefined}
            <div class="ai-tool-result">{seg.resultPreview}</div>
          {/if}
        </div>
      {/if}
    {/each}
  </div>
  {#if __streamState === 'streaming'}
    <div class="ai-card-stream-indicator">…</div>
  {/if}
</div>

<style>
  .ai-card {
    padding: 0.5em 0.75em;
    border-left: 2px solid var(--sh3-fg-dim, #888);
    margin: 0.25em 0;
  }
  .ai-card[data-stream-state='error'] {
    border-left-color: var(--sh3-error, #c66);
  }
  .ai-card-header {
    font-size: 0.85em;
    opacity: 0.6;
    margin-bottom: 0.25em;
  }
  .ai-text {
    /* Bare paragraph spacing inside a streamed card. */
  }
  .ai-card-body :global(pre) {
    background: var(--sh3-code-bg, rgba(0, 0, 0, 0.2));
    padding: 0.5em;
    border-radius: 4px;
    overflow-x: auto;
  }
  .ai-card-body :global(code) {
    font-family: var(--sh3-mono, monospace);
  }
  .ai-tool {
    margin: 0.4em 0;
    padding: 0.25em 0.5em;
    font-size: 0.85em;
    background: var(--sh3-code-bg, rgba(0, 0, 0, 0.15));
    border-left: 2px solid var(--sh3-fg-dim, #888);
    border-radius: 3px;
    opacity: 0.85;
  }
  .ai-tool-error {
    border-left-color: var(--sh3-error, #c66);
  }
  .ai-tool-head {
    display: flex;
    gap: 0.4em;
    align-items: baseline;
    flex-wrap: wrap;
  }
  .ai-tool-arrow {
    opacity: 0.6;
  }
  .ai-tool-name {
    font-family: var(--sh3-mono, monospace);
    font-weight: 600;
  }
  .ai-tool-args {
    font-family: var(--sh3-mono, monospace);
    opacity: 0.7;
    word-break: break-all;
  }
  .ai-tool-spin {
    opacity: 0.5;
  }
  .ai-tool-mark {
    margin-left: auto;
    opacity: 0.6;
  }
  .ai-tool-result {
    margin-top: 0.2em;
    font-family: var(--sh3-mono, monospace);
    opacity: 0.7;
    white-space: pre-wrap;
    word-break: break-all;
  }
  .ai-card-stream-indicator {
    opacity: 0.5;
    font-size: 0.85em;
  }
</style>
