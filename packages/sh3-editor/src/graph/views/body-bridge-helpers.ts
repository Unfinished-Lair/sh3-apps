export function splitKeyPath(
  key: string | (string | number)[] | undefined,
): (string | number)[] {
  if (key == null) return [];
  if (Array.isArray(key)) return key;
  if (key.length === 0) return [];
  if (key.indexOf('.') === -1) return [key];
  return key.split('.');
}

export function resolveValueAtPath(
  root: unknown,
  path: (string | number)[],
): unknown {
  if (path.length === 0) return undefined;
  let cursor: unknown = root;
  for (const seg of path) {
    if (cursor == null || typeof cursor !== 'object') return undefined;
    cursor = (cursor as Record<string | number, unknown>)[seg];
  }
  return cursor;
}

export function evalShow(
  show: ((config: Record<string, unknown>) => boolean) | undefined,
  config: Record<string, unknown>,
): boolean {
  if (!show) return true;
  try {
    return !!show(config);
  } catch (err) {
    console.warn('BodyBridge: show() threw; hiding entry', err);
    return false;
  }
}
