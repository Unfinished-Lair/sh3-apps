import { describe, it, expect, vi, beforeEach } from 'vitest';

const close = vi.fn();
const open = vi.fn();

vi.mock('sh3-core', () => ({
  shell: {
    modal: {
      open: (...args: unknown[]) => {
        open(...args);
        return { close };
      },
    },
  },
}));

vi.mock('./DeleteConfirmModal.svelte', () => ({ default: function StubModal() {} }));

import { confirmDelete } from './confirmDelete';

const baseArgs = {
  target: { shardId: 'notes', path: 'a.md', kind: 'file' as const },
  previewText: 'hello',
  previewState: 'text' as const,
};

beforeEach(() => {
  open.mockClear();
  close.mockClear();
});

describe('confirmDelete', () => {
  it('opens the modal with dismissOnBackdrop:false and forwards args', async () => {
    const promise = confirmDelete(baseArgs);
    expect(open).toHaveBeenCalledTimes(1);
    const [, props, options] = open.mock.calls[0];
    expect(options).toEqual({ dismissOnBackdrop: false });
    expect(props.target).toEqual(baseArgs.target);
    expect(props.previewText).toBe('hello');
    expect(props.previewState).toBe('text');
    props.onCancel();
    await promise;
  });

  it('resolves true when onConfirm fires; closes the modal once', async () => {
    const promise = confirmDelete(baseArgs);
    const props = open.mock.calls[0][1];
    props.onConfirm();
    await expect(promise).resolves.toBe(true);
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('resolves false when onCancel fires; closes the modal once', async () => {
    const promise = confirmDelete(baseArgs);
    const props = open.mock.calls[0][1];
    props.onCancel();
    await expect(promise).resolves.toBe(false);
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('settled-once guard: a second callback after the first is a no-op', async () => {
    const promise = confirmDelete(baseArgs);
    const props = open.mock.calls[0][1];
    props.onConfirm();
    props.onCancel();
    await expect(promise).resolves.toBe(true);
    expect(close).toHaveBeenCalledTimes(1);
  });
});
