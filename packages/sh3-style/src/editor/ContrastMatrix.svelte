<script lang="ts">
  import type { ThemeDefinition, ThemeToken } from '../types';
  import { resolveTokens } from '../theme-manager';
  import ContrastBadge from './ContrastBadge.svelte';

  let {
    theme,
  }: {
    theme: ThemeDefinition;
  } = $props();

  const resolved = $derived(resolveTokens(theme));

  const SURFACES: { token: ThemeToken; label: string }[] = [
    { token: 'sh3-bg',          label: 'bg' },
    { token: 'sh3-bg-elevated', label: 'elevated' },
    { token: 'sh3-bg-sunken',   label: 'sunken' },
    { token: 'sh3-input-bg',    label: 'input' },
  ];

  const FOREGROUNDS: { token: ThemeToken; label: string }[] = [
    { token: 'sh3-fg',        label: 'fg' },
    { token: 'sh3-fg-muted',  label: 'muted' },
    { token: 'sh3-fg-subtle', label: 'subtle' },
  ];
</script>

<div class="matrix-wrap">
<table class="matrix">
  <thead>
    <tr>
      <th></th>
      {#each FOREGROUNDS as { label }}
        <th>{label}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each SURFACES as { token: surfaceTok, label: surfaceLabel }}
      <tr>
        <th>{surfaceLabel}</th>
        {#each FOREGROUNDS as { token: fgTok }}
          <td>
            <ContrastBadge
              fg={resolved[fgTok]}
              bg={resolved[surfaceTok]}
              usage="text"
            />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
</div>

<style>
  .matrix-wrap {
    overflow-x: auto;
    max-width: 100%;
  }
  .matrix {
    border-collapse: collapse;
    font-size: 10px;
    color: var(--sh3-fg-muted);
  }
  .matrix th,
  .matrix td {
    padding: var(--sh3-pad-xs, 2px) var(--sh3-pad-sm, 4px);
    text-align: left;
  }
  .matrix thead th {
    color: var(--sh3-fg-subtle);
    font-weight: 400;
    text-transform: uppercase;
    font-size: 9px;
  }
  .matrix tbody th {
    color: var(--sh3-fg-subtle);
    font-weight: 400;
    text-align: right;
    padding-right: var(--sh3-pad-md, 8px);
  }
</style>
