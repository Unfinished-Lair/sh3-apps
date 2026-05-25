import { describe, it, expect, vi } from 'vitest';
import type { FileHandlerDescriptor, FileRef, ShardContext } from 'sh3-core';

const { PermissionError } = vi.hoisted(() => ({
  PermissionError: class PermissionError extends Error {
    constructor(public kind: string, public path: string) {
      super(`PermissionError(${kind}): ${path}`);
    }
  },
}));

vi.mock('sh3-core', () => ({ launchApp: vi.fn(), PermissionError }));

import { listHandlersFor } from './dispatch';

function toBuf(s: string): ArrayBuffer {
  return new TextEncoder().encode(s).buffer as ArrayBuffer;
}

function ctxWith(handlers: FileHandlerDescriptor[], readResult?: string): ShardContext {
  return {
    contributions: {
      list: vi.fn(() => handlers),
    },
    documents: {
      readBinary: vi.fn(async () => (readResult == null ? null : toBuf(readResult))),
    },
  } as unknown as ShardContext;
}

const noopOpen = { type: 'view' as const, open: () => {} };

describe('listHandlersFor', () => {
  it('filters by case-insensitive extension', async () => {
    const ctx = ctxWith([
      { label: 'A', match: { extensions: ['.md'] }, open: noopOpen },
      { label: 'B', match: { extensions: ['.txt'] }, open: noopOpen },
    ]);
    const file: FileRef = { path: 'notes/x.MD', tenantId: 't', binary: false };
    const out = await listHandlersFor(ctx, file);
    expect(out.map((h) => h.label)).toEqual(['A']);
  });

  it('sorts by priority desc, ties broken by registration order', async () => {
    const ctx = ctxWith([
      { label: 'A', match: { extensions: ['.md'] }, open: noopOpen, priority: 1 },
      { label: 'B', match: { extensions: ['.md'] }, open: noopOpen, priority: 2 },
      { label: 'C', match: { extensions: ['.md'] }, open: noopOpen, priority: 2 },
    ]);
    const file: FileRef = { path: 'notes/x.md', tenantId: 't', binary: false };
    const out = await listHandlersFor(ctx, file);
    expect(out.map((h) => h.label)).toEqual(['B', 'C', 'A']);
  });

  it('treats missing priority as 0', async () => {
    const ctx = ctxWith([
      { label: 'A', match: { extensions: ['.md'] }, open: noopOpen },
      { label: 'B', match: { extensions: ['.md'] }, open: noopOpen, priority: -1 },
    ]);
    const file: FileRef = { path: 'notes/x.md', tenantId: 't', binary: false };
    const out = await listHandlersFor(ctx, file);
    expect(out.map((h) => h.label)).toEqual(['A', 'B']);
  });

  it('returns [] when no extension matches', async () => {
    const ctx = ctxWith([
      { label: 'A', match: { extensions: ['.md'] }, open: noopOpen },
    ]);
    const file: FileRef = { path: 'notes/x.dat', tenantId: 't', binary: false };
    expect(await listHandlersFor(ctx, file)).toEqual([]);
  });

  it('applies header.patterns to disambiguate matches', async () => {
    const ctx = ctxWith([
      { label: 'A', match: { extensions: ['.html'], header: { patterns: [{ type: 'startsWith', value: '<!DOCTYPE' }] } }, open: noopOpen },
      { label: 'B', match: { extensions: ['.html'], header: { patterns: [{ type: 'startsWith', value: '<svg' }] } }, open: noopOpen },
    ], '<!DOCTYPE html>');
    const file: FileRef = { path: 'notes/x.html', tenantId: 't', binary: false };
    const out = await listHandlersFor(ctx, file);
    expect(out.map((h) => h.label)).toEqual(['A']);
  });

  it('drops a header-gated candidate when the read returns null', async () => {
    const ctx = ctxWith([
      { label: 'A', match: { extensions: ['.html'], header: { patterns: [{ type: 'startsWith', value: '<!DOCTYPE' }] } }, open: noopOpen },
      { label: 'B', match: { extensions: ['.html'] }, open: noopOpen },
    ], undefined);
    const file: FileRef = { path: 'notes/x.html', tenantId: 't', binary: false };
    const out = await listHandlersFor(ctx, file);
    expect(out.map((h) => h.label)).toEqual(['B']);
  });
});
