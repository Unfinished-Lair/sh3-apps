import { describe, it, expect } from 'vitest';
import { assembleCatalog, filterByScope } from './assemble';
import type { Tool } from './types';
import type { ResolvedScope } from '../scope/types';

const t = (name: string, source: Tool['source'] = 'verb'): Tool => ({
  name, description: name, inputSchema: { type: 'object' }, source,
  run: async () => undefined,
});

describe('assembleCatalog', () => {
  it('concatenates verb tools and contribution tools', () => {
    const cat = assembleCatalog({
      verbTools: [t('a.x'), t('b.y')],
      contributionTools: [t('c.z', 'sh3-ai.tool')],
    });
    expect(cat.map((x) => x.name).sort()).toEqual(['a.x', 'b.y', 'c.z']);
  });

  it('dedupes by name; verb wins on collision', () => {
    const verb = t('a.x', 'verb');
    const contrib = t('a.x', 'sh3-ai.tool');
    const cat = assembleCatalog({
      verbTools: [verb],
      contributionTools: [contrib],
    });
    expect(cat).toHaveLength(1);
    expect(cat[0]).toBe(verb);
  });

  it('dedupes within a single source; first wins', () => {
    const a1 = t('a.x', 'verb');
    const a2 = t('a.x', 'verb');
    const cat = assembleCatalog({ verbTools: [a1, a2], contributionTools: [] });
    expect(cat).toHaveLength(1);
    expect(cat[0]).toBe(a1);
  });
});

describe('filterByScope', () => {
  const allow: ResolvedScope = { id: 'r', whitelist: ['*.read'], blacklist: [] };
  const deny: ResolvedScope = { id: 'd', whitelist: ['*.*'], blacklist: ['*.delete'] };

  it('removes tools that fail the evaluator', () => {
    const cat = [t('a.read'), t('a.delete')];
    expect(filterByScope(cat, allow).map((x) => x.name)).toEqual(['a.read']);
  });

  it('respects blacklist authoritatively', () => {
    const cat = [t('a.read'), t('a.delete')];
    expect(filterByScope(cat, deny).map((x) => x.name)).toEqual(['a.read']);
  });
});
