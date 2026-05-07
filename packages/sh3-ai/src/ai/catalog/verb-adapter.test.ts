import { describe, it, expect, vi } from 'vitest';
import { verbsToTools } from './verb-adapter';

const ok = (result: unknown) => Promise.resolve({ result, scrollback: [] });

describe('verbsToTools', () => {
  it('returns an empty array when listVerbs returns []', () => {
    expect(verbsToTools([], vi.fn())).toEqual([]);
  });

  it('produces a Tool per verb with name "<shardId>.<bare>"', () => {
    const tools = verbsToTools(
      [
        { shardId: 'sh3-fe', name: 'sh3-fe:read', summary: 'Read a file' },
        { shardId: 'sh3-r2', name: 'sh3-r2:backup', summary: 'Back up to R2' },
      ],
      vi.fn(),
    );
    expect(tools.map((t) => t.name)).toEqual(['sh3-fe.read', 'sh3-r2.backup']);
  });

  it('uses summary as description, falling back to a placeholder', () => {
    const tools = verbsToTools(
      [
        { shardId: 'a', name: 'a:b', summary: 'Custom' },
        { shardId: 'a', name: 'a:c', summary: undefined },
      ],
      vi.fn(),
    );
    expect(tools[0].description).toBe('Custom');
    expect(tools[1].description).toMatch(/no description/i);
  });

  it('emits the fallback single-string args schema when verb has no schema', () => {
    const tools = verbsToTools(
      [{ shardId: 'a', name: 'a:b', summary: undefined }],
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

  it('passes verb.schema.input through verbatim when present', () => {
    const input = {
      type: 'object',
      properties: { path: { type: 'string' } },
      required: ['path'],
    };
    const [tool] = verbsToTools(
      [{ shardId: 'a', name: 'a:b', summary: 'x', schema: { input } }],
      vi.fn(),
    );
    expect(tool.inputSchema).toBe(input);
  });

  it('run() (no schema) splits args on whitespace and unwraps result', async () => {
    const fakeRunVerb = vi.fn().mockReturnValue(ok('ok'));
    const [tool] = verbsToTools(
      [{ shardId: 'fe', name: 'fe:list', summary: 'List' }],
      fakeRunVerb,
    );
    const ac = new AbortController();
    const result = await tool.run({ args: '/docs --recursive' }, { signal: ac.signal });
    expect(fakeRunVerb).toHaveBeenCalledWith(
      'fe', 'fe:list', ['/docs', '--recursive'], { signal: ac.signal },
    );
    expect(result).toBe('ok');
  });

  it('run() (with schema) dispatches with opts.structured and empty args', async () => {
    const fakeRunVerb = vi.fn().mockReturnValue(ok({ bytes: 12 }));
    const [tool] = verbsToTools(
      [{
        shardId: 'sh3-r2',
        name: 'sh3-r2:backup',
        summary: 'Back up',
        schema: { input: { type: 'object', properties: { path: { type: 'string' } } } },
      }],
      fakeRunVerb,
    );
    const ac = new AbortController();
    const result = await tool.run({ path: '/docs' }, { signal: ac.signal });
    expect(fakeRunVerb).toHaveBeenCalledWith(
      'sh3-r2', 'sh3-r2:backup', [], { signal: ac.signal, structured: { path: '/docs' } },
    );
    expect(result).toEqual({ bytes: 12 });
  });

  it('run() handles empty args string (no schema)', async () => {
    const fakeRunVerb = vi.fn().mockReturnValue(ok(undefined));
    const [tool] = verbsToTools(
      [{ shardId: 'fe', name: 'fe:pwd', summary: '' }],
      fakeRunVerb,
    );
    await tool.run({ args: '' }, { signal: new AbortController().signal });
    expect(fakeRunVerb).toHaveBeenCalledWith('fe', 'fe:pwd', [], expect.anything());
  });
});
