import type { SourceShard, ShardContext } from 'sh3-core';
import { mount, unmount } from 'svelte';
import { registerSelectionAction } from 'sh3-file-explorer/contributions';
import { createRuntime, type Runtime } from './runtime.svelte';
import { upload } from './upload';
import { createR2Client } from './r2/client';
import { readForeign } from './foreign-docs';
import TargetsView from './views/TargetsView.svelte';
import BackupView from './views/BackupView.svelte';
import ImportView from './views/ImportView.svelte';

let runtime: Runtime | null = null;
const unregisterFns: Array<() => void> = [];

export const shard: SourceShard = {
  manifest: {
    id: 'sh3-connector-r2',
    label: 'R2 Backup',
    views: [
      { id: 'sh3-connector-r2-targets', label: 'Targets' },
      { id: 'sh3-connector-r2-backup', label: 'Backup' },
      { id: 'sh3-connector-r2-import', label: 'Import' },
    ],
    permissions: ['documents:browse'],
  },

  async activate(ctx: ShardContext) {
    runtime = createRuntime(ctx);
    void runtime.refreshTargets();

    ctx.registerView('sh3-connector-r2-targets', {
      mount(container) {
        const cmp = mount(TargetsView, { target: container, props: { rt: runtime! } });
        return { unmount() { unmount(cmp); } };
      },
    });

    ctx.registerView('sh3-connector-r2-backup', {
      mount(container) {
        const cmp = mount(BackupView, { target: container, props: { rt: runtime! } });
        return { unmount() { unmount(cmp); } };
      },
    });

    ctx.registerView('sh3-connector-r2-import', {
      mount(container) {
        const cmp = mount(ImportView, { target: container, props: { rt: runtime! } });
        return { unmount() { unmount(cmp); } };
      },
    });

    const off = registerSelectionAction({
      id: 'sh3-connector-r2:backup',
      label: 'Back up to R2',
      appliesTo: () => (runtime?.targets.length ?? 0) > 0,
      onInvoke: async (sel) => {
        if (!runtime) return;
        const targets = runtime.targets;
        if (targets.length === 0) {
          alert('No R2 targets configured. Open the R2 Backup app to add one.');
          return;
        }
        const target = targets.length === 1
          ? targets[0]
          : targets.find((t) => t.label === window.prompt(
              `Target label (${targets.map((t) => t.label).join(', ')}):`,
              targets[0].label,
            ));
        if (!target) return;

        const client = createR2Client(target);
        const read = readForeign(ctx);
        const result = await upload({
          target,
          client,
          logHandle: runtime.docs,
          readForeign: read,
          shardId: sel.shardId,
          path: sel.path,
          sourceTenant: ctx.tenantId,
        });
        const word =
          result.status === 'uploaded' ? 'Uploaded' :
          result.status === 'skipped-unchanged' ? 'Already up to date' :
          `Failed: ${result.reason ?? 'unknown'}`;
        alert(`${word}\n${sel.shardId}/${sel.path}`);
      },
      kind: 'secondary',
    });
    unregisterFns.push(off);
  },

  deactivate() {
    for (const fn of unregisterFns) fn();
    unregisterFns.length = 0;
    runtime = null;
  },
};
