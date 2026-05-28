import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import PipelineNodesHelpTab from './PipelineNodesHelpTab.svelte';
import type { NodeTemplate } from '@unfinished-lair/sh3-editor/graph/types';

function stubDomain(templates: NodeTemplate[]) {
  return { getTemplates: () => templates };
}

const tplA: NodeTemplate = {
  type: 'verb:ai:ai:ask',
  category: 'Verbs',
  label: 'ai:ask',
  ports: [
    { id: 'run-in', direction: 'input', dataType: 'run', label: '' },
    { id: 'topic', direction: 'input', dataType: 'string', label: 'topic' },
    { id: 'run-out', direction: 'output', dataType: 'run', label: '' },
    { id: 'answer', direction: 'output', dataType: 'string', label: 'answer' },
  ],
  defaultConfig: { summary: 'Ask the AI' },
};

const tplB: NodeTemplate = {
  type: 'structural:branch',
  category: 'Structural',
  label: 'Branch',
  ports: [{ id: 'run-in', direction: 'input', dataType: 'run', label: '' }],
  defaultConfig: { summary: 'Branch the flow' },
};

describe('PipelineNodesHelpTab', () => {
  it('renders a row for each template grouped by category', () => {
    const { container } = render(PipelineNodesHelpTab, {
      props: { domain: stubDomain([tplA, tplB]) },
    });
    expect(container.textContent).toContain('ai:ask');
    expect(container.textContent).toContain('Branch');
    expect(container.textContent).toContain('Verbs');
    expect(container.textContent).toContain('Structural');
  });

  it('search filters template list by label, type, and summary', async () => {
    const { container } = render(PipelineNodesHelpTab, {
      props: { domain: stubDomain([tplA, tplB]) },
    });
    const search = container.querySelector('input[type="search"]') as HTMLInputElement;
    await fireEvent.input(search, { target: { value: 'branch' } });
    expect(container.textContent).not.toContain('ai:ask');
    expect(container.textContent).toContain('Branch');
  });

  it('renders ports table with direction and dataType per port', () => {
    const { container } = render(PipelineNodesHelpTab, {
      props: { domain: stubDomain([tplA]) },
    });
    const portRows = container.querySelectorAll('tr[data-port-row]');
    expect(portRows.length).toBe(4);
    const text = container.textContent ?? '';
    expect(text).toContain('topic');
    expect(text).toContain('string');
    expect(text).toContain('input');
    expect(text).toContain('output');
  });
});
