import { describe, it, expect } from 'vitest';
import { selectionToActionPayload, SELECTION_TYPE } from './explorerSelection.svelte';

describe('selectionToActionPayload', () => {
  it('returns null when the store has no selection', () => {
    expect(selectionToActionPayload(null)).toBeNull();
  });

  it('returns the typed payload for a file selection', () => {
    const sel = { shardId: 'notes', path: 'a.md', kind: 'file' as const };
    expect(selectionToActionPayload(sel)).toEqual({
      type: SELECTION_TYPE,
      ref: { shardId: 'notes', path: 'a.md', kind: 'file' },
    });
  });

  it('returns the typed payload for a folder selection', () => {
    const sel = { shardId: 'notes', path: 'docs', kind: 'folder' as const };
    expect(selectionToActionPayload(sel)).toEqual({
      type: SELECTION_TYPE,
      ref: { shardId: 'notes', path: 'docs', kind: 'folder' },
    });
  });

  it('returns the typed payload when path is empty (shard root folder)', () => {
    const sel = { shardId: 'notes', path: '', kind: 'folder' as const };
    expect(selectionToActionPayload(sel)).toEqual({
      type: SELECTION_TYPE,
      ref: { shardId: 'notes', path: '', kind: 'folder' },
    });
  });
});
