import type { Shard, ShardContext } from 'sh3-core';
import { mount, unmount } from 'svelte';
import type { ThemeState } from './theme-manager';
import { applyTheme, findTheme } from './theme-manager';
import ThemeEditor from './editor/ThemeEditor.svelte';

export const shard: Shard = {
  manifest: {
    id: 'sh3-style',
    label: 'Style',
    version: '0.2.0',
    views: [{ id: 'sh3-style-editor', label: 'Style Editor' }],
  },

  activate(ctx: ShardContext) {
    const state = ctx.state<{ user: ThemeState }>({
      user: { activeThemeId: 'builtin-dark', userThemes: [] },
    });

    const theme = findTheme(state.user.activeThemeId, state.user);
    if (theme) {
      applyTheme(state.user.activeThemeId, state.user);
    }

    ctx.registerView('sh3-style-editor', {
      mount(container, _context) {
        const component = mount(ThemeEditor, {
          target: container,
          props: { state: state.user },
        });

        return {
          unmount() {
            unmount(component);
          },
        };
      },
    });
  },
};
