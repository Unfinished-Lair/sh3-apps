import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import PrefetchInspectorAdapter from './PrefetchInspectorAdapter.svelte';
import type { PrefetchConfig } from '../domain/types';

const toggleMock = vi.fn();
const refreshMock = vi.fn(async () => undefined);
const commitMock = vi.fn();

vi.mock('../runtime/prefetch-actions', () => ({
  toggleSelectedNodeMode: () => toggleMock(),
  refreshSelectedPrefetchNode: () => refreshMock(),
  commitSelectedPrefetchConfig: (next: PrefetchConfig) => commitMock(next),
  isSelectedPrefetchRefreshing: () => false,
}));

function prefetchValue(): Record<string, unknown> {
  return {
    mode: 'prefetch',
    shardId: 'workspace-mgr',
    name: 'workspaces.list',
    summary: 'List workspaces',
    prefetch: {
      shardId: 'workspace-mgr',
      name: 'workspaces.list',
      summary: 'List workspaces',
      args: {},
      valueField: 'id',
      list: null,
      selectedRowKey: null,
      lastSelectedRow: null,
      lastError: null,
    } satisfies PrefetchConfig,
  };
}

describe('PrefetchInspectorAdapter', () => {
  beforeEach(() => {
    toggleMock.mockClear();
    refreshMock.mockClear();
    commitMock.mockClear();
  });

  it('renders the PrefetchInspector when value is in prefetch mode', () => {
    const { getByText } = render(PrefetchInspectorAdapter, {
      props: { value: prefetchValue(), meta: {} },
    });
    // PrefetchInspector renders the verb name in its header
    expect(getByText('workspaces.list')).toBeTruthy();
  });

  it('renders the empty fallback when value has no prefetch block', () => {
    const { getByText } = render(PrefetchInspectorAdapter, {
      props: { value: { mode: 'runtime' }, meta: {} },
    });
    expect(getByText(/no prefetch config/i)).toBeTruthy();
  });
});
