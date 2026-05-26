import type { NodeHandler } from './index';

export function makeJsonifyHandler(): NodeHandler {
  return async (ctx, inv) => {
    const cfg = inv.config as { pretty?: boolean };
    const inputPort = inv.type === 'array.toJson' ? 'array' : 'record';
    const v = inv.inputs[inputPort];
    try {
      const json = JSON.stringify(v, null, cfg.pretty ? 2 : 0);
      return { outputs: { json }, next: null };
    } catch (e) {
      ctx.log({
        ts: Date.now(), nodeId: inv.nodeId, level: 'error',
        message: `${inv.type} failed: ${String((e as Error).message ?? e)}`,
      });
      return { outputs: { json: undefined }, next: null };
    }
  };
}
