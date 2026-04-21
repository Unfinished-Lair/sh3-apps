import type { Component } from 'svelte';
import type { InspectorMeta } from '../types';
import type { InspectorRenderer } from './contributions';

export type Resolution =
  | { kind: 'custom'; component: Component<any> }
  | { kind: 'walker' }
  | { kind: 'leaf' };

let byType = new Map<string, InspectorRenderer>();

/** Replace the reactive map with the given registrations. Called by the shard
 *  from `ctx.contributions.list(POINT)` on activate and on every onChange. */
export function setRenderers(list: InspectorRenderer[]): void {
  const sorted = [...list].sort((a, b) => {
    const pa = a.priority ?? 10;
    const pb = b.priority ?? 10;
    if (pa !== pb) return pb - pa;   // higher priority first
    return 0;                          // stable sort preserves original order
  });
  const map = new Map<string, InspectorRenderer>();
  for (const r of sorted) {
    if (!map.has(r.type)) map.set(r.type, r);   // first wins at equal priority
  }
  byType = map;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== 'object') return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}

function lookup(type: string): Component<any> | null {
  return byType.get(type)?.component ?? null;
}

export function resolveRenderer(value: unknown, meta: InspectorMeta | undefined): Resolution {
  // 1. meta.type
  if (meta?.type) {
    const c = lookup(meta.type);
    if (c) return { kind: 'custom', component: c };
  }
  // 2. value.__type
  if (value !== null && typeof value === 'object' && typeof (value as any).__type === 'string') {
    const c = lookup((value as any).__type);
    if (c) return { kind: 'custom', component: c };
  }
  // 3. fallback
  if (isPlainObject(value) || Array.isArray(value)) return { kind: 'walker' };
  return { kind: 'leaf' };
}

/** Test-only reset. */
export function __reset(): void {
  byType = new Map();
}
