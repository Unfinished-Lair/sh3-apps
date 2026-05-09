import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  actionsToTools,
  type ActionInvoker,
  type ActiveActionDescriptorLike,
} from './action-adapter';

function active(
  partial: Partial<ActiveActionDescriptorLike> & { id: string; label: string },
): ActiveActionDescriptorLike {
  return {
    ownerShardId: 'sh3-ai',
    scope: 'home',
    scopeBadge: null,
    ...partial,
  };
}

const noopInvoker: ActionInvoker = vi.fn().mockResolvedValue(undefined);

describe('actionsToTools', () => {
  it('converts a basic descriptor to a Tool with empty input schema', () => {
    const tools = actionsToTools(
      [
        active({
          id: 'sh3-ai:open-config.conversations',
          label: 'Conversations',
        }),
      ],
      noopInvoker,
    );
    expect(tools).toHaveLength(1);
    expect(tools[0]).toMatchObject({
      name: 'sh3-ai.open-config.conversations',
      description: 'Conversations',
      source: 'action',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
    });
  });

  it('rewrites only the leading shardId colon (not subsequent colons)', () => {
    // Defensive — action ids are contractually one-colon, but if a label or id
    // ever contained a stray colon further in, replaceAll would corrupt it.
    const tools = actionsToTools(
      [active({ id: 'sh3-ai:weird:nested', label: 'Weird' })],
      noopInvoker,
    );
    expect(tools[0].name).toBe('sh3-ai.weird:nested');
  });

  it('falls back to "(no description)" when label is empty', () => {
    const tools = actionsToTools(
      [active({ id: 'sh3-ai:x', label: '' })],
      noopInvoker,
    );
    expect(tools[0].description).toBe('(no description)');
  });

  it('appends scopeBadge in parens when non-null', () => {
    const tools = actionsToTools(
      [
        active({
          id: 'sh3-editor:save',
          label: 'Save',
          scopeBadge: 'view:editor',
        }),
      ],
      noopInvoker,
    );
    expect(tools[0].description).toBe('Save (view:editor)');
  });

  it('skips submenu container actions', () => {
    const tools = actionsToTools(
      [
        active({
          id: 'sh3-ai:open-config',
          label: 'AI Configuration...',
          submenu: true,
        }),
        active({
          id: 'sh3-ai:open-config.defaults',
          label: 'AI Defaults',
        }),
      ],
      noopInvoker,
    );
    expect(tools.map((t) => t.name)).toEqual(['sh3-ai.open-config.defaults']);
  });

  it('skips actions with aiInvocable: false; passes through undefined and true', () => {
    const tools = actionsToTools(
      [
        active({ id: 'sh3-ai:on', label: 'on' }),
        active({ id: 'sh3-ai:off', label: 'off', aiInvocable: false }),
        active({ id: 'sh3-ai:explicit-on', label: 'explicit on', aiInvocable: true }),
      ],
      noopInvoker,
    );
    expect(tools.map((t) => t.name)).toEqual([
      'sh3-ai.on',
      'sh3-ai.explicit-on',
    ]);
  });

  it('run() invokes upstream with id and signal, resolves to empty string', async () => {
    const invoke = vi.fn().mockResolvedValue(undefined);
    const tools = actionsToTools(
      [active({ id: 'sh3-ai:do-thing', label: 'Do thing' })],
      invoke,
    );
    const ac = new AbortController();
    const result = await tools[0].run(undefined, { signal: ac.signal });
    expect(invoke).toHaveBeenCalledWith('sh3-ai:do-thing', {
      signal: ac.signal,
    });
    expect(result).toBe('');
  });

  it('run() forwards rejection from the invoker', async () => {
    const invoke = vi.fn().mockRejectedValue(new Error('boom'));
    const tools = actionsToTools(
      [active({ id: 'sh3-ai:fail', label: 'Fail' })],
      invoke,
    );
    await expect(
      tools[0].run(undefined, { signal: new AbortController().signal }),
    ).rejects.toThrow('boom');
  });

  describe('name segment guardrail', () => {
    let warnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });
    afterEach(() => {
      warnSpy.mockRestore();
    });

    it('emits a warning but still includes tools whose names exceed 3 segments', () => {
      // 'a:b.c.d' → 'a.b.c.d' = 4 segments; everything-scope's *.*.* won't match.
      const tools = actionsToTools(
        [active({ id: 'a:b.c.d', label: 'Deep' })],
        noopInvoker,
      );
      expect(tools).toHaveLength(1);
      expect(tools[0].name).toBe('a.b.c.d');
      expect(warnSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('returns [] for empty input', () => {
    expect(actionsToTools([], noopInvoker)).toEqual([]);
  });

  it('preserves input order (no implicit re-sort)', () => {
    const tools = actionsToTools(
      [
        active({ id: 'sh3-z:third', label: 'z' }),
        active({ id: 'sh3-a:first', label: 'a' }),
        active({ id: 'sh3-m:second', label: 'm' }),
      ],
      noopInvoker,
    );
    expect(tools.map((t) => t.name)).toEqual([
      'sh3-z.third',
      'sh3-a.first',
      'sh3-m.second',
    ]);
  });
});
