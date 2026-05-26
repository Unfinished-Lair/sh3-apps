import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import type { PickerDocumentSource } from 'sh3-core';
import DocFolderWidget from './DocFolderWidget.svelte';

function api(readonly = false) {
  return {
    push: vi.fn(),
    readonly,
    history: { undo: vi.fn(), redo: vi.fn(), push: vi.fn(), replaceTop: vi.fn(), onChange: vi.fn(), peek: vi.fn() } as any,
  };
}

function stubDocs(overrides: Partial<PickerDocumentSource> = {}): PickerDocumentSource {
  return {
    boundId: 'test',
    grants: { browse: true, write: false },
    list: async () => [],
    listFolders: async () => [],
    mkdir: async () => {},
    rmdir: async () => {},
    rename: async () => {},
    renameFolder: async () => {},
    delete: async () => {},
    ...overrides,
  } as PickerDocumentSource;
}

describe('DocFolderWidget', () => {
  it('renders "(no document source)" placeholder when documents prop is absent', () => {
    const { container } = render(DocFolderWidget, {
      props: { value: null, api: api(), onCommit: vi.fn(), meta: { type: 'doc-folder' } },
    });
    expect(container.textContent).toContain('(no document source)');
    // DocumentOpener should not be mounted; no buttons present.
    expect(container.querySelector('button')).toBeNull();
  });

  it('mounts DocumentOpener when documents is provided', () => {
    const { container } = render(DocFolderWidget, {
      props: {
        value: null,
        api: api(),
        onCommit: vi.fn(),
        meta: { type: 'doc-folder' },
        documents: stubDocs(),
      },
    });
    expect(container.textContent).not.toContain('(no document source)');
    expect(container.querySelector('button')).not.toBeNull();
  });

  it('renders even when api.readonly — DocumentOpener handles its own disabled state', () => {
    const { container } = render(DocFolderWidget, {
      props: {
        value: { shardId: 's', path: 'p' },
        api: api(true),
        onCommit: vi.fn(),
        meta: { type: 'doc-folder' },
        documents: stubDocs(),
      },
    });
    const btn = container.querySelector('button') as HTMLButtonElement;
    expect(btn).not.toBeNull();
    expect(btn.disabled).toBe(true);
  });
});
