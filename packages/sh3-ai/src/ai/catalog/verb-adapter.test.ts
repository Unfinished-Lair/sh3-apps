import { describe, it, expect, vi } from 'vitest';
import { verbsToTools } from './verb-adapter';

describe('verbsToTools', () => {
  it('returns an empty array when listVerbs returns []', () => {
    const fakeRunVerb = vi.fn();
    const tools = verbsToTools([], fakeRunVerb);
    expect(tools).toEqual([]);
  });

  it('produces a Tool per verb with name "<shardId>.<name>"', () => {
    const tools = verbsToTools(
      [
        { shardId: 'sh3-fe', name: 'read', summary: 'Read a file' },
        { shardId: 'sh3-r2', name: 'backup', summary: 'Back up to R2' },
      ],
      vi.fn(),
    );
    expect(tools.map((t) => t.name)).toEqual(['sh3-fe.read', 'sh3-r2.backup']);
  });

  it('uses summary as description, falling back to a placeholder', () => {
    const tools = verbsToTools(
      [
        { shardId: 'a', name: 'b', summary: 'Custom' },
        { shardId: 'a', name: 'c', summary: undefined },
      ],
      vi.fn(),
    );
    expect(tools[0].description).toBe('Custom');
    expect(tools[1].description).toMatch(/no description/i);
  });

  it('emits the pre-R1-full input schema (single string args field)', () => {
    const tools = verbsToTools(
      [{ shardId: 'a', name: 'b', summary: undefined }],
      vi.fn(),
    );
    expect(tools[0].inputSchema).toEqual({
      type: 'object',
      properties: {
        args: {
          type: 'string',
          description: 'Whitespace-separated positional arguments.',
        },
      },
      required: ['args'],
    });
    expect(tools[0].source).toBe('verb');
  });

  it('run() splits args on whitespace and forwards to runVerb', async () => {
    const fakeRunVerb = vi.fn().mockResolvedValue('ok');
    const [tool] = verbsToTools(
      [{ shardId: 'fe', name: 'list', summary: 'List' }],
      fakeRunVerb,
    );
    const ac = new AbortController();
    const result = await tool.run({ args: '/docs --recursive' }, { signal: ac.signal });
    expect(fakeRunVerb).toHaveBeenCalledWith(
      'fe', 'list', ['/docs', '--recursive'], { signal: ac.signal },
    );
    expect(result).toBe('ok');
  });

  it('run() handles empty args string', async () => {
    const fakeRunVerb = vi.fn().mockResolvedValue(undefined);
    const [tool] = verbsToTools(
      [{ shardId: 'fe', name: 'pwd', summary: '' }],
      fakeRunVerb,
    );
    await tool.run({ args: '' }, { signal: new AbortController().signal });
    expect(fakeRunVerb).toHaveBeenCalledWith('fe', 'pwd', [], expect.anything());
  });
});
