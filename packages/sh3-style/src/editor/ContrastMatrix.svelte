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
    { token: 'shell-bg',          label: 'bg' },
    { token: 'shell-bg-elevated', label: 'elevated' },
    { token: 'shell-bg-sunken',   label: 'sunken' },
    { token: 'shell-input-bg',    label: 'input' },
  ];

  const FOREGROUNDS: { token: ThemeToken; label: string }[] = [
    { token: 'shell-fg',        label: 'fg' },
    { token: 'shell-fg-muted',  label: 'muted' },
    { token: 'shell-fg-subtle', label: 'subtle' },
  ];
</script>

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

<style>
  .matrix {
    border-collapse: collapse;
    font-size: 10px;
    color: var(--shell-fg-muted);
  }
  .matrix th,
  .matrix td {
    padding: var(--shell-pad-xs, 2px) var(--shell-pad-sm, 4px);
    text-align: left;
  }
  .matrix thead th {
    color: var(--shell-fg-subtle);
    font-weight: 400;
    text-transform: uppercase;
    font-size: 9px;
  }
  .matrix tbody th {
    color: var(--shell-fg-subtle);
    font-weight: 400;
    text-align: right;
    padding-right: var(--shell-pad-md, 8px);
  }
</style>
