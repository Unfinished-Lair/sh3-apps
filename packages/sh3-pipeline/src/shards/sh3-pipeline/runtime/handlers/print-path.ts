type Segment =
  | { kind: 'key'; value: string }
  | { kind: 'index'; value: number };

function parsePath(expr: string): Segment[] {
  const segs: Segment[] = [];
  let i = 0;
  let expectDot = false;
  while (i < expr.length) {
    const c = expr[i];
    if (c === '.') {
      if (i === 0 || !expectDot) throw new Error(`unexpected "." at ${i}`);
      expectDot = false;
      i++;
      continue;
    }
    if (c === '[') {
      const close = expr.indexOf(']', i);
      if (close < 0) throw new Error(`missing "]" after ${i}`);
      const inner = expr.slice(i + 1, close);
      if (/^-?\d+$/.test(inner)) {
        segs.push({ kind: 'index', value: parseInt(inner, 10) });
      } else if (
        (inner.startsWith('"') && inner.endsWith('"')) ||
        (inner.startsWith("'") && inner.endsWith("'"))
      ) {
        segs.push({ kind: 'key', value: inner.slice(1, -1) });
      } else {
        throw new Error(`malformed bracket expression "[${inner}]" at ${i}`);
      }
      i = close + 1;
      expectDot = true;
      continue;
    }
    // bare identifier (until next . or [)
    const next = expr.slice(i).search(/[.\[]/);
    const end = next < 0 ? expr.length : i + next;
    const ident = expr.slice(i, end);
    if (!ident) throw new Error(`empty segment at ${i}`);
    segs.push({ kind: 'key', value: ident });
    i = end;
    expectDot = true;
  }
  return segs;
}

export function resolvePath(value: unknown, expr: string): unknown {
  if (!expr) return value;
  const segs = parsePath(expr);
  let cur: unknown = value;
  for (const s of segs) {
    if (cur == null || (typeof cur !== 'object' && typeof cur !== 'string')) return undefined;
    if (s.kind === 'index') {
      if (!Array.isArray(cur)) return undefined;
      cur = cur[s.value];
    } else {
      cur = (cur as Record<string, unknown>)[s.value];
    }
  }
  return cur;
}
