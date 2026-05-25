import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import StringListWidget from './StringListWidget.svelte';

function api(readonly = false) {
  return {
    push: vi.fn(),
    readonly,
    history: {
      undo: vi.fn(), redo: vi.fn(), push: vi.fn(),
      replaceTop: vi.fn(), onChange: vi.fn(), peek: vi.fn(),
    } as any,
  };
}

describe('StringListWidget', () => {
  it('renders rows from value', () => {
    const { container } = render(StringListWidget, {
      props: { value: ['a', 'b'], api: api(), onCommit: vi.fn(), meta: { type: 'string-list' } },
    });
    const inputs = container.querySelectorAll('input[type="text"]');
    expect(inputs.length).toBe(2);
    expect((inputs[0] as HTMLInputElement).value).toBe('a');
    expect((inputs[1] as HTMLInputElement).value).toBe('b');
  });

  it('forwards onchange to onCommit', async () => {
    const onCommit = vi.fn();
    const { container } = render(StringListWidget, {
      props: { value: ['a'], api: api(), onCommit, meta: { type: 'string-list' } },
    });
    const input = container.querySelector('input[type="text"]') as HTMLInputElement;
    await fireEvent.input(input, { target: { value: 'aa' } });
    await fireEvent.blur(input);
    expect(onCommit).toHaveBeenCalledWith(['aa']);
  });
});
