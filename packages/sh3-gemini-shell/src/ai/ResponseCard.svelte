<script lang="ts">
  import { marked } from 'marked';

  interface Props {
    markdown: string;
    model: string | null;
    locked: boolean;
    __streamState?: 'streaming' | 'complete' | 'error';
    __aiCard?: boolean;
  }

  let { markdown, model, locked, __streamState = 'streaming' }: Props = $props();

  const html = $derived(marked.parse(markdown ?? '', { async: false }) as string);
</script>

<div class="ai-card" data-stream-state={__streamState}>
  {#if model}
    <div class="ai-card-header">
      {#if locked}🔒 {/if}model: {model}
    </div>
  {/if}
  <div class="ai-card-body">
    {@html html}
  </div>
  {#if __streamState === 'streaming'}
    <div class="ai-card-stream-indicator">…</div>
  {/if}
</div>

<style>
  .ai-card {
    padding: 0.5em 0.75em;
    border-left: 2px solid var(--shell-fg-dim, #888);
    margin: 0.25em 0;
  }
  .ai-card[data-stream-state='error'] {
    border-left-color: var(--shell-error, #c66);
  }
  .ai-card-header {
    font-size: 0.85em;
    opacity: 0.6;
    margin-bottom: 0.25em;
  }
  .ai-card-body :global(pre) {
    background: var(--shell-code-bg, rgba(0,0,0,0.2));
    padding: 0.5em;
    border-radius: 4px;
    overflow-x: auto;
  }
  .ai-card-body :global(code) {
    font-family: var(--shell-mono, monospace);
  }
  .ai-card-stream-indicator {
    opacity: 0.5;
    font-size: 0.85em;
  }
</style>
