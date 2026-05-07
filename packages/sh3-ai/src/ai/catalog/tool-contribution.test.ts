import { describe, it, expect, vi } from 'vitest';
import { toolContributionsToTools } from './tool-contribution';
import type { ToolContribution } from '../../contributions';

describe('toolContributionsToTools', () => {
  it('returns empty when input is empty', () => {
    expect(toolContributionsToTools([])).toEqual([]);
  });

  it('preserves name, description, schema, and run; tags source', () => {
    const run = vi.fn().mockResolvedValue('result');
    const c: ToolContribution = {
      name: 'sh3-ext.do-thing',
      description: 'Does a thing',
      inputSchema: { type: 'object', properties: { x: { type: 'string' } } },
      run,
    };
    const [t] = toolContributionsToTools([c]);
    expect(t.name).toBe('sh3-ext.do-thing');
    expect(t.description).toBe('Does a thing');
    expect(t.inputSchema).toEqual(c.inputSchema);
    expect(t.source).toBe('sh3-ai.tool');
    expect(t.run).toBe(run);
  });
});
