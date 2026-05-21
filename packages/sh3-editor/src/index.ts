export { shard, getApi } from './shard';
export type {
  EditorApi,
  EditorDocument,
  MatchingConfig,
  ToolbarAction,
  OpenDocumentOptions,
  ColorPanelDescriptor,
  ColorPanelController,
  PreviewLinkEvent,
} from './types';
export type {
  EditorEdit,
  EditorEditCommand,
  EditorEditChannel,
  EditorEditContribution,
} from './edit/contributions';
export { EDITOR_EDIT_POINT } from './edit/contributions';
