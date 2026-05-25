import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
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

function runtimeVerbValue(): Record<string, unknown> {
  return {
    mode: 'runtime',
    shardId: 'workspace-mgr',
    name: 'workspaces.list',
    summary: 'List workspaces',
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
    expect(getByText('workspaces.list')).toBeTruthy();
  });

  it('renders a "Switch to Prefetch mode" button for any runtime verb', () => {
    const { getByRole } = render(PrefetchInspectorAdapter, {
      props: { value: runtimeVerbValue(), meta: {} },
    });
    const btn = getByRole('button', { name: /switch to prefetch mode/i });
    expect(btn).toBeTruthy();
  });

  it('clicking the Switch button calls toggleSelectedNodeMode', async () => {
    const { getByRole } = render(PrefetchInspectorAdapter, {
      props: { value: runtimeVerbValue(), meta: {} },
    });
    await fireEvent.click(getByRole('button', { name: /switch to prefetch mode/i }));
    expect(toggleMock).toHaveBeenCalledTimes(1);
  });

  it('renders the empty fallback when value has no mode field', () => {
    const { getByText } = render(PrefetchInspectorAdapter, {
      props: { value: { foo: 'bar' }, meta: {} },
    });
    expect(getByText(/no prefetch config/i)).toBeTruthy();
  });
});
