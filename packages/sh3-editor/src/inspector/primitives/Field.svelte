<script lang="ts">
  interface Props {
    label: string;
    readonly?: boolean;
    children: import('svelte').Snippet;
  }
  let { label, readonly = false, children }: Props = $props();
</script>

<div class="field" class:readonly>
  <span class="label">{label}</span>
  <span class="value">{@render children()}</span>
</div>

<style>
  .field {
    display: grid;
    grid-template-columns: minmax(4em, 12em) 1fr;
    column-gap: 0.75em;
    align-items: center;
    padding: 0.15em 0.5em;
    font-family: var(--shell-font-mono);
    font-size: 13px;
    color: var(--shell-fg);
  }
  .label {
    color: var(--shell-fg-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .readonly .value {
    color: var(--shell-fg-muted);
  }
</style>
