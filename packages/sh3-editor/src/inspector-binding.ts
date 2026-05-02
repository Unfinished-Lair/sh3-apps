import type { ContributionsApi } from 'sh3-core';
import type { InspectorEntry } from './model/inspector-registry.svelte';
import type { InstanceRegistry } from './model/instance-registry.svelte';
import type { ApiInternals } from './model/api';
import type { OpenInspectorOptions } from './types';
import {
  INSPECTOR_INSTANCE_POINT,
  type InspectorInstanceContribution,
  type InspectorInstanceSeed,
  type InspectorBindHandle,
} from './inspector/contributions';

export interface BindInspectorOptions {
  slotId: string;
  contributions: ContributionsApi;
  /** The text-document registry (kept for symmetry with bindDocument; not
   *  read by bindInspector but threaded through for the shared mount-handler
   *  shape). Pass the same instance shard.ts already holds. */
  registry: InstanceRegistry;
  internals: ApiInternals;
  /** Override the warn sink in tests. Defaults to console.warn. */
  warn?: (msg: string) => void;
}

export interface BindInspectorResult {
  /** The resolved entry, or undefined when no contribution and no
   *  imperative-API entry exist for this slot. The mount handler treats
   *  `undefined` as "fall back to ad-hoc / empty". */
  entry: InspectorEntry | undefined;
  /** Run on slot unmount. Releases bind disposer + onValueChange forwarder.
   *  Idempotent. */
  cleanup(): void;
}

export function bindInspector(opts: BindInspectorOptions): BindInspectorResult {
  const {
    slotId,
    contributions,
    internals,
    warn = console.warn,
  } = opts;

  const all = contributions.list<InspectorInstanceContribution>(INSPECTOR_INSTANCE_POINT);
  const matches = all.filter((c) => c.slotId === slotId);
  if (matches.length > 1) {
    warn(
      `[sh3-editor] Multiple InspectorInstanceContribution descriptors registered for slotId="${slotId}"; using the first registered.`,
    );
  }
  const bound: InspectorInstanceContribution | undefined = matches[0];

  const entry: InspectorEntry | undefined = bound
    ? internals.inspectors.get(slotId) ?? internals.inspectors.open(slotId, seedToOpenOpts(bound.seed, bound.onCommit))
    : internals.inspectors.get(slotId);

  const offs: Array<() => void> = [];

  if (bound?.bind && entry) {
    const handle: InspectorBindHandle = {
      replace: makeReplace(slotId, entry, internals),
      history: internals.history(slotId),
    };
    const disposer = bound.bind(handle);
    if (typeof disposer === 'function') offs.push(disposer);
  }

  if (bound?.onValueChange) {
    offs.push(internals.inspectorValueChange.on((id, value) => {
      if (id === slotId) bound.onValueChange!(value);
    }));
  }

  return {
    entry,
    cleanup() {
      for (const off of offs) {
        try { off(); } catch (e) { console.warn('[sh3-editor] bindInspector cleanup error', e); }
      }
      offs.length = 0;
    },
  };
}

function makeReplace(
  slotId: string,
  entry: InspectorEntry,
  internals: ApiInternals,
): (next: Partial<InspectorInstanceSeed>) => void {
  return (next) => {
    if ('value' in next && next.value !== entry.value) {
      entry.value = next.value;
      internals.inspectors.bumpVersion();
      internals.history(slotId).clear();
      internals.inspectorValueChange.emit(slotId, next.value);
    }
    if ('meta' in next)            entry.meta = next.meta;
    if ('readonly' in next)        entry.options.readonly = next.readonly ?? false;
    if ('toolbarActions' in next)  entry.options.toolbarActions = next.toolbarActions ?? [];
  };
}

function seedToOpenOpts(
  seed: InspectorInstanceSeed,
  onCommit: InspectorInstanceContribution['onCommit'],
): OpenInspectorOptions {
  const opts: OpenInspectorOptions = { value: seed.value };
  if (seed.meta !== undefined)            opts.meta = seed.meta;
  if (seed.readonly !== undefined)        opts.readonly = seed.readonly;
  if (seed.toolbarActions !== undefined)  opts.toolbarActions = seed.toolbarActions;
  if (onCommit !== undefined)             opts.onCommit = onCommit;
  return opts;
}
