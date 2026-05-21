import { describe, it, expect, vi } from 'vitest';
import type { FileHandlerDescriptor, ShardContext } from 'sh3-core';

vi.mock('sh3-core', async () => {
  const actual = await vi.importActual<typeof import('sh3-core')>('sh3-core');
  return {
    ...actual,
    sh3: { toast: { notify: vi.fn() }, float: { open: vi.fn(), list: vi.fn(() => []) } },
  };
});

import { shard } from '../../shard';

describe('sh3-ai file-handler registration', () => {
  it('registers a sh3.file-handler descriptor for .html → sketch view', async () => {
    const registered: Array<{ point: string; descriptor: unknown }> = [];
    const ctx = {
      contributions: {
        register: vi.fn((point: string, descriptor: unknown) => {
          registered.push({ point, descriptor });
          return () => {};
        }),
        onChange: vi.fn(() => () => {}),
        list: vi.fn(() => []),
      },
      state: vi.fn(() => ({
        user: {
          activeProviderId: null,
          activeScopeId: '',
          scopes: {},
          activeConversationId: null,
          titleStrategy: 'first-message',
          systemInstruction: '',
          idleTimeoutMs: 60_000,
          temperature: null,
        },
      })),
      registerView: vi.fn(),
      registerVerb: vi.fn(),
      actions: { register: vi.fn(() => () => {}) },
      documents: {} as any,
      documentPicker: { open: vi.fn(), save: vi.fn() } as any,
      fetch: vi.fn(),
      browse: { readFrom: vi.fn() },
      sh3: { listVerbs: vi.fn(() => []), runVerb: vi.fn(), runAction: vi.fn() },
      dispatch: vi.fn(),
    } as unknown as ShardContext;

    await shard.register!(ctx);

    const handlerEntries = registered.filter((e) => e.point === 'sh3.file-handler');
    expect(handlerEntries).toHaveLength(1);
    const descriptor = handlerEntries[0].descriptor as FileHandlerDescriptor;
    expect(descriptor.label).toBe('AI Sketch');
    expect(descriptor.match.extensions).toEqual(['.html']);
    expect(descriptor.open.type).toBe('view');
  });
});
