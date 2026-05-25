<script lang="ts">
  import StringList from '../../primitives/widgets/StringList.svelte';
  import type { InspectorRendererProps } from '../contributions';

  let { value, meta, api, onCommit }: InspectorRendererProps = $props();

  function toArray(v: unknown): string[] {
    if (!Array.isArray(v)) return [];
    return v.filter((x): x is string => typeof x === 'string');
  }
</script>

<StringList
  value={toArray(value)}
  label={meta?.label}
  disabled={api.readonly || meta?.readonly}
  onchange={(next) => onCommit?.(next)}
/>
