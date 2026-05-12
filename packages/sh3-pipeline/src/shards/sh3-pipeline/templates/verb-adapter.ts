import type { NodeTemplate, GraphAssetPort } from '@unfinished-lair/sh3-editor/graph/types';
import { dataTypeFromJsonSchema, type DataType } from '../domain/data-types';

export interface VerbDescriptor {
  shardId: string;
  name: string;
  summary: string | undefined;
  schema?: { input?: unknown; output?: unknown };
}

function port(
  id: string,
  direction: 'input' | 'output',
  dataType: DataType,
  label?: string,
): GraphAssetPort {
  return { id, direction, dataType, label: label ?? id };
}

export function verbsToTemplates(verbs: ReadonlyArray<VerbDescriptor>): NodeTemplate[] {
  return verbs.map((v) => {
    const inputPorts = buildInputPorts(v);
    const outputPorts = buildOutputPorts(v);
    return {
      type: `verb:${v.shardId}:${v.name}`,
      category: 'Verbs',
      // Use the verb's name as the node label — concise, deterministic, fits
      // on one line. The full summary lives in defaultConfig.summary so a
      // future inspector or tooltip can surface it without breaking layout.
      label: v.name,
      ports: [...inputPorts, ...outputPorts],
      defaultConfig: {
        shardId: v.shardId,
        name: v.name,
        summary: v.summary ?? '',
      },
    };
  });
}

function buildInputPorts(v: VerbDescriptor): GraphAssetPort[] {
  const ports: GraphAssetPort[] = [port('control-in', 'input', 'control', 'control')];
  const input = (v.schema?.input ?? null) as { type?: string; properties?: Record<string, unknown> } | null;
  if (input && input.type === 'object' && input.properties && typeof input.properties === 'object') {
    for (const [key, prop] of Object.entries(input.properties)) {
      ports.push(port(key, 'input', dataTypeFromJsonSchema(prop), key));
    }
    return ports;
  }
  ports.push(port('args', 'input', 'string', 'args'));
  return ports;
}

function buildOutputPorts(v: VerbDescriptor): GraphAssetPort[] {
  const ports: GraphAssetPort[] = [port('control-out', 'output', 'control', 'control')];
  const output = (v.schema?.output ?? null) as { type?: string; properties?: Record<string, unknown> } | null;

  if (output && output.type === 'object' && output.properties && typeof output.properties === 'object') {
    for (const [key, prop] of Object.entries(output.properties)) {
      ports.push(port(key, 'output', dataTypeFromJsonSchema(prop), key));
    }
    return ports;
  }
  if (output) {
    ports.push(port('value', 'output', dataTypeFromJsonSchema(output), 'value'));
    return ports;
  }
  ports.push(port('result', 'output', 'unknown', 'result'));
  ports.push(port('stdout', 'output', 'string', 'stdout'));
  ports.push(port('stderr', 'output', 'string', 'stderr'));
  ports.push(port('scrollback', 'output', 'array', 'scrollback'));
  return ports;
}
