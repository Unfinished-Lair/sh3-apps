/**
 * Module-level handle for opening the F1 Help hub from anywhere in the editor.
 *
 * sh3-core's actions API has no public `invoke(actionId)` — actions can only
 * fire from a keypress, palette entry, or context-menu click. Code inside the
 * editor shard that wants to programmatically open the Help hub (e.g. the
 * graph's "⚙ Edit Quick Access" button) calls openHelpHub() instead.
 *
 * The shard wires the actual opener via setHelpHubOpener() during register().
 */

export interface OpenHubOptions {
  /** Tab id (matching `HelpTabContribution.id`) to activate when opened. */
  focusTabId?: string;
}

type Opener = (opts?: OpenHubOptions) => void;

let opener: Opener | null = null;

export function setHelpHubOpener(fn: Opener | null): void {
  opener = fn;
}

export function openHelpHub(opts?: OpenHubOptions): void {
  if (opener) opener(opts);
  // else: silently no-op — the editor shard isn't activated, so there's
  // nothing to open. This matches the action-not-registered case.
}
