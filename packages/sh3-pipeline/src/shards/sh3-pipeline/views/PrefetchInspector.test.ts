import { describe, expect, it } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import PrefetchInspector from './PrefetchInspector.svelte';
import type { PrefetchConfig } from '../domain/types';

function baseCfg(): PrefetchConfig {
  return {
    shardId: 'workspace-mgr',
    name: 'workspaces.list',
    summary: 'List workspaces',
    args: {},
    valueField: 'id',
    list: {
      rows: [{ id: 'a', name: 'Acme' }, { id: 'b', name: 'Bravo' }],
      fetchedAt: Date.now(),
      schemaSnapshot: {
        properties: { id: { type: 'string' }, name: { type: 'string' } },
      },
    },
    selectedRowKey: 'a',
    lastSelectedRow: { id: 'a', name: 'Acme' },
    lastError: null,
  };
}

describe('PrefetchInspector', () => {
  it('renders the verb name and summary', () => {
    const { getByText } = render(PrefetchInspector, {
      props: { cfg: baseCfg(), onCommit: () => {}, onRefresh: async () => {}, onToggleMode: () => {}, refreshing: false },
    });
    expect(getByText('workspaces.list')).toBeTruthy();
    expect(getByText('List workspaces')).toBeTruthy();
  });

  it('renders one selection option per row', () => {
    const { container } = render(PrefetchInspector, {
      props: { cfg: baseCfg(), onCommit: () => {}, onRefresh: async () => {}, onToggleMode: () => {}, refreshing: false },
    });
    const select = container.querySelector('select[data-role="selection"]') as HTMLSelectElement;
    expect(select.options.length).toBe(2);
  });

  it('selecting a row calls onCommit with new selectedRowKey + lastSelectedRow', async () => {
    let committed: PrefetchConfig | null = null as PrefetchConfig | null;
    const { container } = render(PrefetchInspector, {
      props: {
        cfg: baseCfg(),
        onCommit: (next: PrefetchConfig) => { committed = next; },
        onRefresh: async () => {},
        onToggleMode: () => {},
        refreshing: false,
      },
    });
    const select = container.querySelector('select[data-role="selection"]') as HTMLSelectElement;
    await fireEvent.change(select, { target: { value: 'b' } });
    expect(committed?.selectedRowKey).toBe('b');
    expect(committed?.lastSelectedRow).toEqual({ id: 'b', name: 'Bravo' });
  });

  it('shows orphan badge when selectedRowKey is absent from list.rows', () => {
    const cfg = baseCfg();
    cfg.selectedRowKey = 'gone';
    const { getByText } = render(PrefetchInspector, {
      props: { cfg, onCommit: () => {}, onRefresh: async () => {}, onToggleMode: () => {}, refreshing: false },
    });
    expect(getByText(/no longer in list/i)).toBeTruthy();
  });

  it('shows error badge when lastError is present', () => {
    const cfg = baseCfg();
    cfg.lastError = { message: 'ECONNREFUSED', ts: Date.now() };
    const { getByText } = render(PrefetchInspector, {
      props: { cfg, onCommit: () => {}, onRefresh: async () => {}, onToggleMode: () => {}, refreshing: false },
    });
    expect(getByText(/ECONNREFUSED/)).toBeTruthy();
  });

  it('changing valueField recomputes selectedRowKey for the current row', async () => {
    let committed: PrefetchConfig | null = null as PrefetchConfig | null;
    const { container } = render(PrefetchInspector, {
      props: {
        cfg: baseCfg(),
        onCommit: (next: PrefetchConfig) => { committed = next; },
        onRefresh: async () => {},
        onToggleMode: () => {},
        refreshing: false,
      },
    });
    const valueFieldSelect = container.querySelector('select[data-role="value-field"]') as HTMLSelectElement;
    await fireEvent.change(valueFieldSelect, { target: { value: 'name' } });
    expect(committed?.valueField).toBe('name');
    expect(committed?.selectedRowKey).toBe('Acme');
  });

  it('refresh button is disabled while refreshing prop is true', () => {
    const { getByRole } = render(PrefetchInspector, {
      props: { cfg: baseCfg(), onCommit: () => {}, onRefresh: async () => {}, onToggleMode: () => {}, refreshing: true },
    });
    const btn = getByRole('button', { name: /refresh/i }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('clicking refresh calls onRefresh', async () => {
    let called = false;
    const { getByRole } = render(PrefetchInspector, {
      props: { cfg: baseCfg(), onCommit: () => {}, onRefresh: async () => { called = true; }, onToggleMode: () => {}, refreshing: false },
    });
    await fireEvent.click(getByRole('button', { name: /refresh/i }));
    expect(called).toBe(true);
  });

  it('clicking the toggle button calls onToggleMode', async () => {
    let called = false;
    const { getByRole } = render(PrefetchInspector, {
      props: { cfg: baseCfg(), onCommit: () => {}, onRefresh: async () => {}, onToggleMode: () => { called = true; }, refreshing: false },
    });
    await fireEvent.click(getByRole('button', { name: /runtime mode/i }));
    expect(called).toBe(true);
  });
});
