import { launchApp } from 'sh3-core';

/**
 * Launch the sh3-pipeline app. v0.1.0 ignores the docId: the app re-attaches
 * to its last state. v0.2.0 will route the docId through LaunchAppOptions.args
 * once the app reads ctx.args to bind a graph at startup.
 */
export async function openPipelineApp(docId: string): Promise<void> {
  if (!docId) throw new Error('pipeline:open requires a docId');
  await launchApp('sh3-pipeline');
}
