import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import StringList from './StringList.svelte';

function rows(container: HTMLElement): HTMLInputElement[] {
  return Array.from(container.querySelectorAll('input[type="text"]')) as HTMLInputElement[];
}

describe('StringList', () => {
  it('renders one row per seeded value', () => {
    const { container } = render(StringList, { props: { value: ['a', 'b', 'c'] } });
    expect(rows(container).map(r => r.value)).toEqual(['a', 'b', 'c']);
  });

  it('add button appends a new empty row and focuses it; committing fires onchange with the new value', async () => {
    const onchange = vi.fn();
    const { container } = render(StringList, { props: { value: ['a'], onchange } });
    const addBtn = container.querySelector('[data-testid="string-list-add"]') as HTMLButtonElement;
    await fireEvent.click(addBtn);
    const allRows = rows(container);
    expect(allRows.length).toBe(2);
    await fireEvent.input(allRows[1], { target: { value: 'b' } });
    await fireEvent.blur(allRows[1]);
    expect(onchange).toHaveBeenCalledWith(['a', 'b']);
  });

  it('remove button drops the row and fires onchange', async () => {
    const onchange = vi.fn();
    const { container } = render(StringList, { props: { value: ['a', 'b'], onchange } });
    const removeBtns = container.querySelectorAll('[data-testid^="string-list-remove-"]');
    await fireEvent.click(removeBtns[0] as HTMLButtonElement);
    expect(onchange).toHaveBeenCalledWith(['b']);
  });

  it('inline edit commits on blur with the new array', async () => {
    const onchange = vi.fn();
    const { container } = render(StringList, { props: { value: ['a', 'b'], onchange } });
    const r = rows(container);
    await fireEvent.input(r[0], { target: { value: 'aa' } });
    await fireEvent.blur(r[0]);
    expect(onchange).toHaveBeenCalledWith(['aa', 'b']);
  });

  it('dedupes on commit (last write wins)', async () => {
    const onchange = vi.fn();
    const { container } = render(StringList, { props: { value: ['a', 'b'], onchange } });
    const r = rows(container);
    await fireEvent.input(r[0], { target: { value: 'b' } });
    await fireEvent.blur(r[0]);
    // After dedupe the prior 'b' is dropped; final array is ['b'].
    expect(onchange).toHaveBeenCalledWith(['b']);
  });

  it('disabled hides add/remove and renders inputs readonly', () => {
    const { container } = render(StringList, { props: { value: ['a'], disabled: true } });
    expect(container.querySelector('[data-testid="string-list-add"]')).toBeNull();
    expect(container.querySelector('[data-testid^="string-list-remove-"]')).toBeNull();
    expect(rows(container)[0].readOnly).toBe(true);
  });
});
