<script lang="ts">
  interface Props {
    value: unknown;
  }
  let { value }: Props = $props();

  function render(v: unknown): string {
    if (v === null) return 'null';
    if (v === undefined) return 'undefined';
    if (typeof v === 'string') return `"${v}"`;
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }
</script>

<span class="leaf">{render(value)}</span>

<style>
  .leaf {
    font-family: var(--shell-font-mono);
    font-size: 13px;
    color: var(--shell-fg-muted);
  }
</style>
