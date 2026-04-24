import { describe, it, expect } from 'vitest';
import { listActiveShim, type ShimInputs } from './listActiveShim';

interface Action {
  id: string;
  label: string;
  scope: any;
  defaultShortcut?: string;
  paletteItem?: boolean;
  contextItem?: boolean;
  group?: string;
  icon?: string;
}
interface ActionEntry { action: Action; ownerShardId: string; }

function inputs(overrides: Partial<ShimInputs> = {}): ShimInputs {
  return {
    listActionEntries: () => [],
    getActiveAppId: () => null,
    getMountedViewIds: () => new Set<string>(),
    getFocusedViewId: () => null,
    getSelection: () => null,
    getBindings: () => ({}),
    platform: 'other',
    ...overrides,
  };
}

const home = (shortcut = 'F1'): Action => ({
  id: 'x.help', label: 'Help', scope: 'home', defaultShortcut: shortcut,
});
const viewScoped = (vid: string): Action => ({
  id: 'x.save', label: 'Save', scope: `view:${vid}`, defaultShortcut: 'Ctrl+S',
});

describe('listActiveShim', () => {
  it('emits home-scoped action when no app is active', () => {
    const r = listActiveShim(inputs({
      listActionEntries: () => [{ action: home(), ownerShardId: 's' }],
      getActiveAppId: () => null,
    }));
    expect(r.map((d) => d.id)).toEqual(['x.help']);
    expect(r[0].scope).toBe('home');
    expect(r[0].effectiveShortcut).toBe('F1');
  });

  it('omits home-scoped action when an app is active', () => {
    const r = listActiveShim(inputs({
      listActionEntries: () => [{ action: home(), ownerShardId: 's' }],
      getActiveAppId: () => 'app.demo',
    }));
    expect(r).toEqual([]);
  });

  it('emits view-scoped action when its view is mounted', () => {
    const r = listActiveShim(inputs({
      listActionEntries: () => [{ action: viewScoped('sh3-editor:editor'), ownerShardId: 's' }],
      getMountedViewIds: () => new Set(['sh3-editor:editor']),
    }));
    expect(r).toEqual([{
      id: 'x.save',
      label: 'Save',
      effectiveShortcut: 'Ctrl+S',
      scope: 'view:sh3-editor:editor',
      scopeBadge: 'view:sh3-editor:editor',
      ownerShardId: 's',
      group: undefined,
      icon: undefined,
      paletteItem: true,
      contextItem: true,
    }]);
  });

  it('omits view-scoped action when its view is not mounted', () => {
    const r = listActiveShim(inputs({
      listActionEntries: () => [{ action: viewScoped('missing'), ownerShardId: 's' }],
      getMountedViewIds: () => new Set(['sh3-editor:editor']),
    }));
    expect(r).toEqual([]);
  });

  it('applies user binding over default shortcut', () => {
    const r = listActiveShim(inputs({
      listActionEntries: () => [{ action: home('F1'), ownerShardId: 's' }],
      getBindings: () => ({ 'x.help': 'Ctrl+H' }),
    }));
    expect(r[0].effectiveShortcut).toBe('Ctrl+H');
  });

  it('null user binding disables the shortcut', () => {
    const r = listActiveShim(inputs({
      listActionEntries: () => [{ action: home('F1'), ownerShardId: 's' }],
      getBindings: () => ({ 'x.help': null }),
    }));
    expect(r[0].effectiveShortcut).toBeNull();
  });

  it('resolves Mod to Ctrl on non-mac', () => {
    const r = listActiveShim(inputs({
      listActionEntries: () => [{ action: { ...home(), defaultShortcut: 'Mod+K' }, ownerShardId: 's' }],
      platform: 'other',
    }));
    expect(r[0].effectiveShortcut).toBe('Ctrl+K');
  });

  it('resolves Mod to Meta on mac', () => {
    const r = listActiveShim(inputs({
      listActionEntries: () => [{ action: { ...home(), defaultShortcut: 'Mod+K' }, ownerShardId: 's' }],
      platform: 'mac',
    }));
    expect(r[0].effectiveShortcut).toBe('Meta+K');
  });

  it('picks innermost scope when action has array scope and multiple are active', () => {
    const action: Action = {
      id: 'x.multi', label: 'Multi',
      scope: ['app', 'view:sh3-editor:editor'],
      defaultShortcut: 'Ctrl+M',
    };
    const r = listActiveShim(inputs({
      listActionEntries: () => [{ action, ownerShardId: 's' }],
      getActiveAppId: () => 'app.demo',
      getMountedViewIds: () => new Set(['sh3-editor:editor']),
    }));
    expect(r).toHaveLength(1);
    expect(r[0].scope).toBe('view:sh3-editor:editor');
  });

  it('matches element scope against selection type', () => {
    const action: Action = {
      id: 'x.copy', label: 'Copy',
      scope: { element: 'color' },
      defaultShortcut: 'Ctrl+C',
    };
    const r = listActiveShim(inputs({
      listActionEntries: () => [{ action, ownerShardId: 's' }],
      getSelection: () => ({ type: 'color', ref: { hex: '#fff' } }),
    }));
    expect(r).toHaveLength(1);
    expect(r[0].scopeBadge).toBe('color');
  });

  it('focus scope active when focused view matches', () => {
    const action: Action = {
      id: 'x.f', label: 'F',
      scope: 'focus:sh3-editor:editor',
      defaultShortcut: 'Esc',
    };
    const r = listActiveShim(inputs({
      listActionEntries: () => [{ action, ownerShardId: 's' }],
      getFocusedViewId: () => 'sh3-editor:editor',
    }));
    expect(r).toHaveLength(1);
  });
});
