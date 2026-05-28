import { describe, it, expect, vi } from 'vitest';
import { resolveActiveEntries } from './quick-access-resolution';
import type { GraphDomain } from '../domain/types';
import type { EditorPrefs } from '../../settings/editor-prefs';

const domain = (id: string, types: string[], def: string[] = []): GraphDomain => ({
  id, label: id,
  edgeSemantics: 'oriented',
  useNodePalette: true,
  showMeta: true,
  defaultNodeWidth: 180,
  defaultNodeHeight: 80,
  allowBlocks: true,
  getTemplates: () => types.map((t) => ({ type: t, category: 'x', label: t, ports: [], defaultConfig: {} })),
  getTemplatesByCategory: () => new Map(),
  addTemplate: () => {},
  getNodeVisuals: () => ({ label: 'x', borderColor: '#000' }),
  addVisuals: () => {},
  resolveLabel: () => '',
  hasTemplate: (t) => types.includes(t),
  getDefaultQuickAccess: () => def,
});

const prefs = (qa: EditorPrefs['quickAccess']): EditorPrefs =>
  ({ gridStyle: 'cells', quickAccess: qa });

describe('resolveActiveEntries', () => {
  it('falls back to domain default when no saved variant exists', () => {
    const d = domain('d', ['a', 'b'], ['a', 'b']);
    expect(resolveActiveEntries(d, prefs({ domains: {} }))).toEqual(['a', 'b']);
  });

  it('uses saved active variant when present', () => {
    const d = domain('d', ['a', 'b', 'c']);
    const p = prefs({ domains: { d: { active: 'mine', variants: { mine: ['c', 'a'] } } } });
    expect(resolveActiveEntries(d, p)).toEqual(['c', 'a']);
  });

  it('filters unknown templates and emits one console.warn', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const d = domain('d', ['a']);
    const p = prefs({ domains: { d: { active: 'v', variants: { v: ['a', 'gone'] } } } });
    expect(resolveActiveEntries(d, p)).toEqual(['a']);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('falls back to default when active variant name does not exist in variants', () => {
    const d = domain('d', ['a'], ['a']);
    const p = prefs({ domains: { d: { active: 'phantom', variants: { other: ['a'] } } } });
    expect(resolveActiveEntries(d, p)).toEqual(['a']);
  });
});
