import type { NodeHandler } from './index';

export const arraySizeHandler: NodeHandler = async (ctx, inv) => {
  const v = inv.inputs.array;
  if (!Array.isArray(v)) {
    ctx.log({
      ts: Date.now(), nodeId: inv.nodeId, level: 'warn',
      message: `array.size: input is not an array (got ${v === null ? 'null' : typeof v})`,
    });
    return { outputs: { size: 0 }, next: null };
  }
  return { outputs: { size: v.length }, next: null };
};

export const arrayGetHandler: NodeHandler = async (ctx, inv) => {
  const arr = inv.inputs.array;
  const idxRaw = inv.inputs.index;

  if (!Array.isArray(arr)) {
    ctx.log({
      ts: Date.now(), nodeId: inv.nodeId, level: 'warn',
      message: `array.get: input is not an array (got ${arr === null ? 'null' : typeof arr})`,
    });
    return { outputs: { value: undefined, error: true }, next: null };
  }

  const idx = typeof idxRaw === 'number' ? idxRaw : Number(idxRaw);
  if (!Number.isInteger(idx)) {
    ctx.log({
      ts: Date.now(), nodeId: inv.nodeId, level: 'warn',
      message: `array.get: index is not an integer (got ${JSON.stringify(idxRaw)})`,
    });
    return { outputs: { value: undefined, error: true }, next: null };
  }

  if (idx < 0 || idx >= arr.length) {
    return { outputs: { value: undefined, error: true }, next: null };
  }

  return { outputs: { value: arr[idx], error: false }, next: null };
};
