export type Platform = 'mac' | 'other';

const MAC_SYMBOL: Record<string, string> = {
  Meta: '⌘',
  Ctrl: '⌃',
  Alt: '⌥',
  Shift: '⇧',
};

/**
 * Convert a canonical shortcut string (e.g. "Ctrl+Shift+Z") into a
 * platform-appropriate display string. Assumes `Mod` has already been
 * resolved to `Ctrl` or `Meta` by the caller (shell.actions.listActive
 * does this; our shim does too).
 */
export function prettifyShortcut(canonical: string | null, platform: Platform): string {
  if (!canonical) return '—';
  const parts = canonical.split('+');
  if (platform === 'mac') {
    let out = '';
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      out += MAC_SYMBOL[p] ?? p;
    }
    return out;
  }
  return canonical;
}

export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.platform || navigator.userAgent || '';
  return ua.includes('Mac') ? 'mac' : 'other';
}
