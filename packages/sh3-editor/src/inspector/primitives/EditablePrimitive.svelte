<script lang="ts">
  interface Props {
    value: string | number | boolean | null | undefined;
    readonly?: boolean;
    onCommit?: (next: string | number | boolean) => void;
  }
  let { value, readonly = false, onCommit }: Props = $props();

  let local = $state(stringify(value));

  $effect(() => { local = stringify(value); });

  function stringify(v: unknown): string {
    if (v === null) return 'null';
    if (v === undefined) return '';
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    return String(v);
  }

  function parse(raw: string, kind: 'string' | 'number' | 'boolean'): string | number | boolean | null {
    if (kind === 'boolean') return raw === 'true';
    if (kind === 'number') {
      const n = Number(raw);
      return Number.isFinite(n) ? n : (value as number);
    }
    return raw;
  }

  let kind = $derived(typeof value === 'number'
    ? 'number'
    : typeof value === 'boolean'
      ? 'boolean'
      : 'string');

  function commit() {
    if (readonly || !onCommit) return;
    const parsed = parse(local, kind as 'string' | 'number' | 'boolean');
    if (parsed === null) return;
    if (parsed === value) return;
    onCommit(parsed);
  }

  function onBooleanChange(e: Event) {
    if (readonly || !onCommit) return;
    const next = (e.target as HTMLInputElement).checked;
    if (next !== value) onCommit(next);
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      (e.currentTarget as HTMLInputElement).blur();
    } else if (e.key === 'Escape') {
      local = stringify(value);
      (e.currentTarget as HTMLInputElement).blur();
    }
  }
</script>

{#if kind === 'boolean'}
  <input
    type="checkbox"
    checked={Boolean(value)}
    disabled={readonly}
    onchange={onBooleanChange}
  />
{:else}
  <input
    class="primitive"
    type={kind === 'number' ? 'number' : 'text'}
    bind:value={local}
    disabled={readonly}
    onblur={commit}
    onkeydown={onKey}
  />
{/if}

<style>
  .primitive {
    background: var(--shell-bg-sunken);
    color: var(--shell-fg);
    border: 1px solid var(--shell-border);
    border-radius: 2px;
    padding: 0.1em 0.3em;
    font-family: var(--shell-font-mono);
    font-size: 13px;
    width: 100%;
    box-sizing: border-box;
  }
  .primitive:focus {
    outline: 1px solid var(--shell-accent, #61afef);
  }
  .primitive:disabled {
    color: var(--shell-fg-muted);
    cursor: default;
  }
</style>
