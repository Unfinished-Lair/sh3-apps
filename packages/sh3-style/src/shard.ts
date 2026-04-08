import type { Shard, ShardContext } from 'sh3-core';
import { setTokenOverrides } from 'sh3-core';
import { mount, unmount } from 'svelte';
import type { ThemeState } from './theme-manager';
import {
  applyTheme,
  findTheme,
  resolveTokens,
  buildDefaultPseudoTheme,
  DEFAULT_THEME_ID,
} from './theme-manager';
import type { DefaultTheme } from './types';
import ThemeEditor from './editor/ThemeEditor.svelte';

/** Shape of the env state for sh3-style. */
interface StyleEnv {
  defaultTheme: DefaultTheme | null;
}

export const shard: Shard = {
  manifest: {
    id: 'sh3-style',
    label: 'Style',
    version: '0.2.0',
    views: [{ id: 'sh3-style-editor', label: 'Style Editor' }],
  },

  activate(ctx: ShardContext) {
    const state = ctx.state<{
      user: ThemeState;
      ephemeral: { previewThemeId: string | null };
    }>({
      user: { activeThemeId: 'builtin-dark', useDefault: false, userThemes: [] },
      ephemeral: { previewThemeId: null },
    });

    const env = ctx.env<StyleEnv>({ defaultTheme: null });

    // Apply the confirmed theme on activation.
    if (state.user.useDefault) {
      const pseudo = buildDefaultPseudoTheme(env.defaultTheme);
      if (pseudo) {
        setTokenOverrides(resolveTokens(pseudo));
      } else {
        // No admin default exists (anymore) — fall back to activeThemeId.
        state.user.useDefault = false;
        applyTheme(state.user.activeThemeId, state.user);
      }
    } else {
      applyTheme(state.user.activeThemeId, state.user);
    }

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

  deactivate() {
    // Revert is handled per-view in ThemeEditor's onDestroy.
    // The shard-level deactivate is a safety net — if for any reason
    // the view unmount didn't run, the next shard activation will
    // re-apply the confirmed theme anyway.
  },
};
