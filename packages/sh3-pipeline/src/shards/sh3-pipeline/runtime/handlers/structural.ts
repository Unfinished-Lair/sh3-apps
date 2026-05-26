import type { ParamDef } from '../../domain/types';
import type { HandlerRegistry, NodeHandler } from './index';

const start: NodeHandler = async (ctx, inv) => {
  const params = Array.isArray(inv.config.params) ? (inv.config.params as ParamDef[]) : [];
  const outputs: Record<string, unknown> = {};
  for (const p of params) {
    if (Object.prototype.hasOwnProperty.call(ctx.inputs, p.name)) {
      outputs[p.name] = ctx.inputs[p.name];
    } else if (p.default !== undefined) {
      outputs[p.name] = p.default;
    }
  }
  return { outputs, next: 'run' };
};

const end: NodeHandler = async (_ctx, inv) => {
  return { outputs: { ...inv.inputs }, next: null };
};

const branch: NodeHandler = async (_ctx, inv) => {
  const cond = Boolean(inv.inputs.cond);
  return { outputs: {}, next: cond ? 'then' : 'else' };
};

const sequence: NodeHandler = async (_ctx, inv) => {
  const count =
    typeof inv.config.count === 'number' && inv.config.count > 0
      ? Math.floor(inv.config.count)
      : 2;
  const sequenceOuts: string[] = [];
  for (let i = 1; i <= count; i++) sequenceOuts.push(`out-${i}`);
  return { outputs: {}, next: null, sequenceOuts };
};

const comment: NodeHandler = async () => ({ outputs: {}, next: null });

const setVar: NodeHandler = async (ctx, inv) => {
  const key = typeof inv.config.key === 'string' ? inv.config.key : '';
  if (key.length === 0) {
    ctx.log({ ts: Date.now(), nodeId: inv.nodeId, level: 'warn', message: 'setVar: empty key' });
  } else {
    ctx.vars.set(key, inv.inputs.value);
  }
  return { outputs: {}, next: 'run-out' };
};

const getVar: NodeHandler = async (ctx, inv) => {
  const key = typeof inv.config.key === 'string' ? inv.config.key : '';
  return { outputs: { value: ctx.vars.get(key) }, next: null };
};

function literal(type: 'string' | 'number' | 'boolean'): NodeHandler {
  return async (_ctx, inv) => {
    const v = inv.config.value;
    let coerced: unknown;
    switch (type) {
      case 'string':  coerced = typeof v === 'string'  ? v : String(v ?? '');  break;
      case 'number':  coerced = typeof v === 'number'  ? v : Number(v ?? 0);   break;
      case 'boolean': coerced = typeof v === 'boolean' ? v : Boolean(v);       break;
    }
    return { outputs: { value: coerced }, next: null };
  };
}

const recordBuild: NodeHandler = async (_ctx, inv) => {
  return { outputs: { record: { ...inv.inputs } }, next: null };
};

const recordGet: NodeHandler = async (_ctx, inv) => {
  const key = typeof inv.config.key === 'string' ? inv.config.key : '';
  const rec = inv.inputs.record;
  const value =
    rec && typeof rec === 'object' && rec !== null
      ? (rec as Record<string, unknown>)[key]
      : undefined;
  return { outputs: { value }, next: null };
};

export const structuralHandlers: HandlerRegistry = {
  exact: new Map<string, NodeHandler>([
    ['start',           start],
    ['end',             end],
    ['branch',          branch],
    ['sequence',        sequence],
    ['comment',         comment],
    ['setVar',          setVar],
    ['getVar',          getVar],
    ['literal.string',  literal('string')],
    ['literal.number',  literal('number')],
    ['literal.boolean', literal('boolean')],
    ['record.build',    recordBuild],
    ['record.get',      recordGet],
  ]),
  prefixed: [],
};
