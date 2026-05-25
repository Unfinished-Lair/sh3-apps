import { describe, it, expect, vi } from 'vitest';
import type { FileHandlerDescriptor, ShardContext } from 'sh3-core';

vi.mock('sh3-core', async () => {
  const actual = await vi.importActual<typeof import('sh3-core')>('sh3-core');
  return {
    ...actual,
    sh3: { float: { open: vi.fn(), list: vi.fn(() => []) }, toast: { notify: vi.fn() } },
  };
});

import { shard } from '../shard';

describe('sh3-editor file-handler registration', () => {
  it('registers a single sh3.file-handler descriptor with the supported extensions', async () => {
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
      state: vi.fn(() => ({ user: { colorPickerPalettes: [] } })),
      registerView: vi.fn(),
      actions: { register: vi.fn(() => () => {}) },
      documents: {
        boundId: 'sh3-editor',
        grants: { browse: true, write: false },
        readJson: vi.fn(async () => null),
        writeJson: vi.fn(async () => {}),
      },
    } as unknown as ShardContext;

    await shard.register!(ctx);

    const handlerEntries = registered.filter((e) => e.point === 'sh3.file-handler');
    expect(handlerEntries).toHaveLength(1);
    const descriptor = handlerEntries[0].descriptor as FileHandlerDescriptor;
    expect(descriptor.label).toBe('Text Editor');
    expect(descriptor.match.extensions).toEqual(
      expect.arrayContaining(['.md', '.txt', '.json', '.jsonl']),
    );
    expect(descriptor.open.type).toBe('view');
  });
});
