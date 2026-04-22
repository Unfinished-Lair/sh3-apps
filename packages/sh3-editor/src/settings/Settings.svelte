<script lang="ts">
  import type { ShardContext } from 'sh3-core';
  import { SETTINGS_POINT, type SettingsDescriptor } from './contributions';
  import { setError, pruneErrors, type Errors } from './errors';
  import { registry } from './registry';
  import Section from './primitives/Section.svelte';

  interface Props {
    ctx: ShardContext;
  }
  let { ctx }: Props = $props();

  let descriptors = $state<SettingsDescriptor[]>(
    ctx.contributions.list<SettingsDescriptor>(SETTINGS_POINT),
  );
  let values = $state<Record<string, Record<string, unknown>>>({});
  let errors = $state<Errors>({});

  // 1. Track registration changes.
  $effect(() =>
    ctx.contributions.onChange(SETTINGS_POINT, () => {
      descriptors = ctx.contributions.list<SettingsDescriptor>(SETTINGS_POINT);
    }),
  );

  // 2. For each descriptor, snapshot values + subscribe to external changes.
  $effect(() => {
    const unsubs: Array<() => void> = [];
    const nextValues: Record<string, Record<string, unknown>> = {};
    for (const d of descriptors) {
      nextValues[d.shardId] = d.getValues();
      const un = d.subscribe?.(() => {
        values = { ...values, [d.shardId]: d.getValues() };
      });
      if (un) unsubs.push(un);
    }
    values = nextValues;
    errors = pruneErrors(errors, descriptors.map((d) => d.shardId));
    return () => unsubs.forEach((u) => u());
  });

  // 3. Edit handler dispatched to primitives.
  async function edit(d: SettingsDescriptor, key: string, value: unknown) {
    try {
      await d.onEdit(key, value);
      errors = setError(errors, d.shardId, key, undefined);
    } catch (e) {
      errors = setError(errors, d.shardId, key, (e as Error).message || 'Invalid value');
    } finally {
      values = { ...values, [d.shardId]: d.getValues() };
    }
  }
</script>

<div class="settings">
  <h2 class="title">Settings</h2>
  {#if descriptors.length === 0}
    <p class="empty">No settings available.</p>
  {:else}
    {#each descriptors as d (d.shardId)}
      <Section label={d.label} showHeader={descriptors.length > 1}>
        {#each d.schema as f (f.key)}
          <svelte:component
            this={registry[f.type]}
            field={f}
            value={values[d.shardId]?.[f.key]}
            error={errors[d.shardId]?.[f.key]}
            onEdit={(v: unknown) => edit(d, f.key, v)}
          />
        {/each}
      </Section>
    {/each}
  {/if}
</div>

<style>
  .settings {
    padding: var(--shell-pad-lg);
    font-family: var(--shell-font-ui);
    color: var(--shell-fg);
    background: var(--shell-bg);
    min-height: 100%;
    box-sizing: border-box;
  }
  .title {
    margin: 0 0 var(--shell-pad-md);
    font-size: 16px;
    font-weight: 600;
  }
  .empty {
    color: var(--shell-fg-muted);
    font-style: italic;
    padding: var(--shell-pad-md) 0;
  }
</style>
