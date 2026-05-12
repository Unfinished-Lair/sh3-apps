import type { PortRef } from '@unfinished-lair/sh3-editor/graph/types';

export function hybridConnectRule(src: PortRef, tgt: PortRef): boolean {
  if (src.direction !== 'output' || tgt.direction !== 'input') return false;
  if (src.nodeId === tgt.nodeId) return false;

  const srcIsControl = src.dataType === 'control';
  const tgtIsControl = tgt.dataType === 'control';
  if (srcIsControl || tgtIsControl) return srcIsControl && tgtIsControl;

  if (src.dataType === 'unknown' || tgt.dataType === 'unknown') return true;
  return src.dataType === tgt.dataType;
}
