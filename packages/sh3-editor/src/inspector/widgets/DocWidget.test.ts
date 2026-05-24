import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import DocWidget from './DocWidget.svelte';
import type { DocPickerContribution } from '../contributions';
import { setDocPickerLister } from './doc-picker-registry';

function api(readonly = false) {
  return {
    push: vi.fn(),
    readonly,
    history: { undo: vi.fn(), redo: vi.fn(), push: vi.fn(), replaceTop: vi.fn(), onChange: vi.fn(), peek: vi.fn() } as any,
  };
}

afterEach(() => { setDocPickerLister(null); });

describe('DocWidget', () => {
  it('renders "(no document)" placeholder and disables Browse when no picker registered', () => {
    setDocPickerLister(() => []);
    const { container } = render(DocWidget, {
      props: { value: null, api: api(), onCommit: vi.fn(), meta: { type: 'doc' } },
    });
    expect(container.textContent).toContain('(no document)');
    const browse = container.querySelector('button[data-role="browse"]') as HTMLButtonElement;
    expect(browse.disabled).toBe(true);
    expect(browse.title).toMatch(/no document picker/i);
  });

  it('Browse calls registered picker and commits {shardId, path}', async () => {
    const picker = {
      open: vi.fn().mockResolvedValue({ shardId: 'docs', path: 'a/b.md', kind: 'file' }),
      save: vi.fn(),
    };
    const provider: DocPickerContribution = { id: 'test:picker', picker, priority: 50 };
    setDocPickerLister(() => [provider]);

    const onCommit = vi.fn();
    const { container } = render(DocWidget, {
      props: { value: null, api: api(), onCommit, meta: { type: 'doc' } },
    });
    const browse = container.querySelector('button[data-role="browse"]') as HTMLButtonElement;
    await fireEvent.click(browse);
    await Promise.resolve();
    expect(picker.open).toHaveBeenCalled();
    expect(onCommit).toHaveBeenCalledWith({ shardId: 'docs', path: 'a/b.md' });
  });

  it('Browse cancel (picker resolves null) does not commit', async () => {
    const picker = { open: vi.fn().mockResolvedValue(null), save: vi.fn() };
    const provider: DocPickerContribution = { id: 'test:picker', picker, priority: 50 };
    setDocPickerLister(() => [provider]);

    const onCommit = vi.fn();
    const { container } = render(DocWidget, {
      props: { value: null, api: api(), onCommit, meta: { type: 'doc' } },
    });
    const browse = container.querySelector('button[data-role="browse"]') as HTMLButtonElement;
    await fireEvent.click(browse);
    await Promise.resolve();
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('Clear commits null', async () => {
    setDocPickerLister(() => []);
    const onCommit = vi.fn();
    const { container } = render(DocWidget, {
      props: { value: { shardId: 'docs', path: 'a/b.md' }, api: api(), onCommit, meta: { type: 'doc' } },
    });
    const clear = container.querySelector('button[data-role="clear"]') as HTMLButtonElement;
    await fireEvent.click(clear);
    expect(onCommit).toHaveBeenCalledWith(null);
  });
});
