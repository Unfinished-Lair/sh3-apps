import type { ConnectResolution, PortRef } from '@unfinished-lair/sh3-editor/graph/types';
import { CONVERSIONS } from './data-types';

export function resolveConnect(src: PortRef, tgt: PortRef): ConnectResolution {
  if (src.direction !== 'output' || tgt.direction !== 'input') return false;
  if (src.nodeId === tgt.nodeId) return false;

  const srcIsRun = src.dataType === 'run';
  const tgtIsRun = tgt.dataType === 'run';
  if (srcIsRun || tgtIsRun) return srcIsRun && tgtIsRun;

  if (src.dataType === 'unknown' || tgt.dataType === 'unknown') return true;
  if (src.dataType === tgt.dataType) return true;

  const conv = CONVERSIONS.find(
    (c) => c.from === src.dataType && c.to === tgt.dataType,
  );
  return conv ? { via: conv.id } : false;
}
