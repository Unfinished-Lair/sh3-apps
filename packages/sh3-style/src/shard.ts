import type { Shard, ShardContext } from 'sh3-core';
import { setTokenOverrides } from 'sh3-core';
import { mount, unmount } from 'svelte';
import type { ThemeState } from './theme-manager';
import {
  applyTheme,
  resolveTokens,
  buildDefaultPseudoTheme,
} from './theme-manager';
import type { DefaultTheme } from './types';
import ThemeEditor from './editor/ThemeEditor.svelte';

/** Shape of the env state for sh3-style. */
interface StyleEnv {
  defaultTheme: DefaultTheme | null;
}

// Module-level refs so autostart and deactivate can access shard state.
let stateRef: ThemeState | null = null;
let envRef: StyleEnv | null = null;

/**
 * Restore the confirmed theme (undo any in-progress preview).
 * Exported so the app's deactivate hook can call it.
 */
export function restoreConfirmedTheme(): void {
  if (!stateRef) return;
  applyConfirmed(stateRef, envRef);
}

function applyConfirmed(state: ThemeState, env: StyleEnv | null): void {
  if (state.useDefault) {
    const pseudo = buildDefaultPseudoTheme(env?.defaultTheme ?? null);
    if (pseudo) {
      setTokenOverrides(resolveTokens(pseudo));
    } else {
      // No admin default exists (anymore) — fall back to activeThemeId.
      state.useDefault = false;
      applyTheme(state.activeThemeId, state);
    }
  } else {
    applyTheme(state.activeThemeId, state);
  }
}

export const shard: Shard = {
  manifest: {
    id: 'sh3-style',
    label: 'Style',
    version: '0.2.1',
    views: [{ id: 'sh3-style-editor', label: 'Style Editor' }],
  },

  activate(ctx: ShardContext) {
    const state = ctx.state<{
      user: ThemeState;
      ephemeral: { previewThemeId: string | null };
    }>({
      // useDefault: true so pristine clients pick up the admin default.
      user: { activeThemeId: 'builtin-dark', useDefault: true, userThemes: [] },
      ephemeral: { previewThemeId: null },
    });

    const env = ctx.env<StyleEnv>({ defaultTheme: null });

    stateRef = state.user;
    envRef = env;

    // Apply the confirmed theme eagerly. Note: env is not yet hydrated
    // from the server at this point, so env.defaultTheme may still be
    // null. autostart() re-applies once env is ready.
    applyConfirmed(state.user, env);

    ctx.registerView('sh3-style-editor', {
      mount(container, _context) {
        const component = mount(ThemeEditor, {
          target: container,
          props: {
            state: state.user,
            ephemeralState: state.ephemeral,
            env,
            isAdmin: ctx.isAdmin,
            onEnvUpdate: (patch: Partial<StyleEnv>) => ctx.envUpdate(patch),
          },
        });

        return {
          unmount() {
            unmount(component);
          },
        };
      },
    });
  },

  // Self-starting: ensures the theme is applied at shell boot for all
  // clients, even those that never open the Style app. This hook runs
  // after env hydration, so the admin default is available.
  autostart() {
    if (stateRef && envRef) {
      applyConfirmed(stateRef, envRef);
    }
  },

  // Restore the confirmed theme when the user hits Home (undo any preview).
  suspend() {
    restoreConfirmedTheme();
  },

  deactivate() {
    // Restore the confirmed theme on shard teardown (undo any preview).
    restoreConfirmedTheme();
    stateRef = null;
    envRef = null;
  },
};
