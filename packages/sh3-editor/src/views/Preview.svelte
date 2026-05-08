<script lang="ts">
  import { sh3 } from 'sh3-core';
  import { findClickedAnchor } from '../preview/link-delegation';
  import { classifyLink } from '../preview/link-classify';
  import type { PreviewLinkEvent } from '../contributions';

  interface Props {
    html: string;
    slotId: string;
    onLinkClick?: (e: PreviewLinkEvent) => 'handled' | 'default' | void;
  }

  let { html, slotId, onLinkClick }: Props = $props();

  let rootEl: HTMLDivElement | undefined = $state();

  function handleClick(e: MouseEvent) {
    const found = findClickedAnchor(e.target);
    if (!found) return;

    e.preventDefault();
    const kind = classifyLink(found.href);
    const linkEvent: PreviewLinkEvent = {
      href: found.href,
      kind,
      event: e,
      slotId,
    };

    const result = onLinkClick?.(linkEvent);
    if (result === 'handled') return;

    if (kind === 'anchor') {
      const id = found.href.slice(1);
      if (!id) return;
      const target = rootEl?.querySelector(`#${CSS.escape(id)}`);
      if (target) {
        (target as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    if (kind === 'external') {
      const openExternal = (sh3 as any)?.openExternal as ((url: string) => void) | undefined;
      if (typeof openExternal === 'function') {
        openExternal(found.href);
      } else {
        window.open(found.href, '_blank', 'noopener,noreferrer');
      }
      return;
    }
  }
</script>

<div
  bind:this={rootEl}
  class="preview-root"
  onclick={handleClick}
  role="document"
>
  {@html html}
</div>

<style>
  .preview-root {
    flex: 1;
    overflow: auto;
    padding: 12px 16px;
    background: var(--sh3-bg);
    color: var(--sh3-fg);
    font-family: var(--sh3-font-ui);
    font-size: 13px;
    line-height: 1.55;
  }

  .preview-root :global(h1),
  .preview-root :global(h2),
  .preview-root :global(h3),
  .preview-root :global(h4),
  .preview-root :global(h5),
  .preview-root :global(h6) {
    margin: 1em 0 0.4em;
    line-height: 1.25;
  }

  .preview-root :global(h1) { font-size: 1.6em; border-bottom: 1px solid var(--sh3-border); padding-bottom: 0.2em; }
  .preview-root :global(h2) { font-size: 1.35em; border-bottom: 1px solid var(--sh3-border); padding-bottom: 0.15em; }
  .preview-root :global(h3) { font-size: 1.15em; }

  .preview-root :global(p) { margin: 0.6em 0; }

  .preview-root :global(a) {
    color: var(--sh3-accent);
    text-decoration: none;
  }
  .preview-root :global(a:hover) { text-decoration: underline; }

  .preview-root :global(code) {
    font-family: var(--sh3-font-mono);
    font-size: 0.92em;
    background: var(--sh3-bg-sunken);
    padding: 0.1em 0.35em;
    border-radius: 3px;
  }

  .preview-root :global(pre) {
    background: var(--sh3-bg-sunken);
    padding: 8px 12px;
    border-radius: 4px;
    overflow-x: auto;
  }
  .preview-root :global(pre code) {
    background: transparent;
    padding: 0;
  }

  .preview-root :global(blockquote) {
    border-left: 3px solid var(--sh3-border);
    margin: 0.6em 0;
    padding: 0.2em 1em;
    color: var(--sh3-fg-muted);
  }

  .preview-root :global(ul),
  .preview-root :global(ol) {
    padding-left: 1.5em;
    margin: 0.4em 0;
  }
</style>
