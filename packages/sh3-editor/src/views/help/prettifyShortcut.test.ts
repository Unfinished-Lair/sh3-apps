import { describe, it, expect } from 'vitest';
import { prettifyShortcut } from './prettifyShortcut';

describe('prettifyShortcut (non-mac)', () => {
  it('passes canonical form through on non-mac', () => {
    expect(prettifyShortcut('Ctrl+S', 'other')).toBe('Ctrl+S');
    expect(prettifyShortcut('Ctrl+Shift+Z', 'other')).toBe('Ctrl+Shift+Z');
    expect(prettifyShortcut('F1', 'other')).toBe('F1');
    expect(prettifyShortcut('A', 'other')).toBe('A');
  });

  it('returns em-dash for null/empty shortcut', () => {
    expect(prettifyShortcut(null, 'other')).toBe('—');
    expect(prettifyShortcut('', 'other')).toBe('—');
  });
});

describe('prettifyShortcut (mac)', () => {
  it('replaces modifier names with symbols, no plus separators between symbols', () => {
    expect(prettifyShortcut('Ctrl+S', 'mac')).toBe('⌃S');
    expect(prettifyShortcut('Meta+S', 'mac')).toBe('⌘S');
    expect(prettifyShortcut('Ctrl+Shift+Z', 'mac')).toBe('⌃⇧Z');
    expect(prettifyShortcut('Meta+Alt+Shift+K', 'mac')).toBe('⌘⌥⇧K');
  });

  it('passes function keys through', () => {
    expect(prettifyShortcut('F1', 'mac')).toBe('F1');
  });

  it('returns em-dash for null/empty', () => {
    expect(prettifyShortcut(null, 'mac')).toBe('—');
  });
});
