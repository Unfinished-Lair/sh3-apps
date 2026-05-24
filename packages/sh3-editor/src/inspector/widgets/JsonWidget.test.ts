import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import JsonWidget from './JsonWidget.svelte';

function api(readonly = false) {
  return {
    push: vi.fn(),
    readonly,
    history: { undo: vi.fn(), redo: vi.fn(), push: vi.fn(), replaceTop: vi.fn(), onChange: vi.fn(), peek: vi.fn() } as any,
  };
}

describe('JsonWidget', () => {
  it('renders pretty-printed initial value', () => {
    const { container } = render(JsonWidget, {
      props: { value: { a: 1 }, api: api(), onCommit: vi.fn(), meta: { type: 'json' } },
    });
    const ta = container.querySelector('textarea')!;
    expect(ta.value).toBe('{\n  "a": 1\n}');
  });

  it('commits parsed JSON on change (blur)', async () => {
    const onCommit = vi.fn();
    const { container } = render(JsonWidget, {
      props: { value: { a: 1 }, api: api(), onCommit, meta: { type: 'json' } },
    });
    const ta = container.querySelector('textarea')!;
    await fireEvent.input(ta, { target: { value: '{"b": 2}' } });
    await fireEvent.blur(ta);
    expect(onCommit).toHaveBeenCalledWith({ b: 2 });
  });

  it('does not commit on invalid JSON', async () => {
    const onCommit = vi.fn();
    const { container } = render(JsonWidget, {
      props: { value: { a: 1 }, api: api(), onCommit, meta: { type: 'json' } },
    });
    const ta = container.querySelector('textarea')!;
    await fireEvent.input(ta, { target: { value: '{ not json' } });
    await fireEvent.blur(ta);
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('readonly suppresses commits', async () => {
    const onCommit = vi.fn();
    const { container } = render(JsonWidget, {
      props: { value: { a: 1 }, api: api(true), onCommit, meta: { type: 'json' } },
    });
    const ta = container.querySelector('textarea')!;
    await fireEvent.input(ta, { target: { value: '{"b": 2}' } });
    await fireEvent.blur(ta);
    expect(onCommit).not.toHaveBeenCalled();
  });
});
