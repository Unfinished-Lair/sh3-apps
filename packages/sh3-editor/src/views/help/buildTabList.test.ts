import { describe, it, expect, vi } from 'vitest';
import { buildTabList } from './buildTabList';
import type { HelpTabContribution } from '../../help/contributions';

function tab(id: string, label: string, priority?: number): HelpTabContribution {
  return { id, label, priority, mount: vi.fn(() => ({ unmount: vi.fn() })) };
}

describe('buildTabList', () => {
  it('sorts by priority asc then by registration order', () => {
    const list = buildTabList([
      tab('c', 'C', 100),
      tab('a', 'A', 0),
      tab('b', 'B', 50),
      tab('d', 'D', 50),
    ]);
    expect(list.map((t) => t.id)).toEqual(['a', 'b', 'd', 'c']);
  });

  it('defaults missing priority to 100', () => {
    const list = buildTabList([
      tab('a', 'A', 0),
      tab('b', 'B'),
      tab('c', 'C', 99),
    ]);
    expect(list.map((t) => t.id)).toEqual(['a', 'c', 'b']);
  });

  it('drops later registrations with a duplicate id and logs via the provided warn fn', () => {
    const warn = vi.fn();
    const list = buildTabList([
      tab('a', 'First', 0),
      tab('a', 'Second', 0),
      tab('b', 'Third', 10),
    ], { warn });
    expect(list.map((t) => t.id)).toEqual(['a', 'b']);
    expect(list[0].label).toBe('First');
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toMatch(/duplicate.*"a"/i);
  });

  it('returns empty array for empty input', () => {
    expect(buildTabList([])).toEqual([]);
  });
});
