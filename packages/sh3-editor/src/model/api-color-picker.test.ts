import { describe, it, expect, vi } from 'vitest';
import { createApi } from './api';
import { InstanceRegistry } from './instance-registry.svelte';
import type { HistoryCommand } from '../types';

function makeApi() {
  const registry = new InstanceRegistry();
  return createApi(registry);
}

describe('EditorApi — color picker', () => {
  it('openColorPicker + getColorPickerValue round-trip', () => {
    const { api } = makeApi();
    api.openColorPicker('a', { value: '#ff0000' });
    expect(api.getColorPickerValue('a')).toBe('#ff0000');
  });

  it('getColorPickerValue returns null for unknown ids', () => {
    const { api } = makeApi();
    expect(api.getColorPickerValue('ghost')).toBeNull();
  });

  it('listColorPickerInstances reflects open/close', () => {
    const { api } = makeApi();
    api.openColorPicker('a', { value: '#ff0000' });
    api.openColorPicker('b', { value: '#00ff00' });
    expect(api.listColorPickerInstances().sort()).toEqual(['a', 'b']);
    api.closeColorPicker('a');
    expect(api.listColorPickerInstances()).toEqual(['b']);
  });

  it('closeColorPicker releases per-instance history', () => {
    const { api } = makeApi();
    api.openColorPicker('a', { value: '#ff0000' });
    const h = api.history('a');
    h.push({ apply: () => {}, revert: () => {} });
    expect(h.canUndo).toBe(true);
    api.closeColorPicker('a');
    // After close, a fresh controller for 'a' should be empty.
    const h2 = api.history('a');
    expect(h2.canUndo).toBe(false);
  });

  it('onColorPickerValueChange fires when internals emit', () => {
    const { api, internals } = makeApi();
    api.openColorPicker('a', { value: '#ff0000' });
    const spy = vi.fn();
    const off = api.onColorPickerValueChange(spy);
    internals.colorPickerValueChange.emit('a', '#00ff00');
    expect(spy).toHaveBeenCalledWith('a', '#00ff00');
    off();
    internals.colorPickerValueChange.emit('a', '#0000ff');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('onColorPickerPrefsChange fires when internals emit', () => {
    const { api, internals } = makeApi();
    api.openColorPicker('a', { value: '#ff0000' });
    const spy = vi.fn();
    api.onColorPickerPrefsChange(spy);
    internals.colorPickerPrefsChange.emit('a', { mode: 'rgb' });
    expect(spy).toHaveBeenCalledWith('a', { mode: 'rgb' });
  });

  it('history controller is stable for a color-picker id', () => {
    const { api } = makeApi();
    api.openColorPicker('a', { value: '#ff0000' });
    const h = api.history('a');
    const before = api.getColorPickerValue('a');
    const cmd: HistoryCommand = { apply: () => {}, revert: () => {} };
    h.push(cmd);
    h.undo();
    h.redo();
    expect(api.getColorPickerValue('a')).toBe(before);
  });
});
