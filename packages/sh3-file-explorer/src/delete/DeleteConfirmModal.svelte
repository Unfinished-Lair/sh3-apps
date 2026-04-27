<script lang="ts">
  import type { PreviewState } from './readPreview';

  let {
    target,
    previewText,
    previewState,
    onConfirm,
    onCancel,
  }: {
    target: { shardId: string; path: string; kind: 'file' | 'folder'; descendantCount?: number };
    previewText: string | null;
    previewState: PreviewState;
    onConfirm: () => void;
    onCancel: () => void;
  } = $props();
</script>

<!-- Phase 6 fills this in. Placeholder body so confirmDelete builds. -->
<div>{target.path}</div>
