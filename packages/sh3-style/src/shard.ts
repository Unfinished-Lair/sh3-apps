import type { SourceShard, ShardContext, VerbContext } from 'sh3-core';
import { setTokenOverrides } from 'sh3-core';
import { mount, unmount } from 'svelte';
import type { ThemeState } from './theme-manager';
import {
  applyTheme,
  resolveTokens,
  buildDefaultPseudoTheme,
  resolveStyleArg,
  buildStylesRows,
  DEFAULT_THEME_ID,
} from './theme-manager';
import type { DefaultTheme } from './types';
import ThemeEditor from './editor/ThemeEditor.svelte';
import StylesTable from './rich/StylesTable.svelte';

/** Shape of the env state for sh3-style. */
interface StyleEnv {
  [key: string]: unknown;
  defaultTheme: DefaultTheme | null;
}

// Module-level refs so autostart and deactivate can access shard state.
let stateRef: ThemeState | null = null;
let envRef: StyleEnv | null = null;
// True once autostart() has run (env is hydrated). Before this point,
// applyConfirmed must not permanently mutate useDefault.
let envHydrated = false;

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
      return;
    }
    // No admin default available. If env is hydrated this is permanent
    // (admin never set a default); if not, autostart() will retry.
    if (envHydrated) {
      state.useDefault = false;
    }
  }
  applyTheme(state.activeThemeId, state);
}

export const shard: SourceShard = {
  manifest: {
    id: 'sh3-style',
    label: 'Style',
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

    const pushStylesTable = (vctx: VerbContext) => {
      vctx.scrollback.push({
        kind: 'rich',
        component: StylesTable,
        props: {
          data: {
            rows: buildStylesRows(
              state.user,
              env.defaultTheme,
              state.ephemeral.previewThemeId,
            ),
            onClickStyle: (id: string) => {
              void vctx.dispatch(`sh3-style:preview ${id}`);
            },
          },
        },
        ts: Date.now(),
      });
    };

    ctx.registerVerb({
      name: 'preview',
      summary: 'Preview a theme without saving it. Usage: preview [style]',
      async run(vctx, args) {
        if (args.length === 0) {
          pushStylesTable(vctx);
          return;
        }
        const arg = args.join(' ');
        const result = resolveStyleArg(arg, state.user, env.defaultTheme);
        if (!result.ok) {
          const hint = result.hints.length
            ? ` — did you mean: ${result.hints.map(h => `${h.id} (${h.name})`).join(', ')}?`
            : '';
          vctx.scrollback.push({
            kind: 'text',
            stream: 'stderr',
            chunks: [`sh3-style: unknown style '${arg}'${hint}`],
            ts: Date.now(),
          });
          return;
        }
        state.ephemeral.previewThemeId = result.id;
        applyTheme(result.id, state.user, env.defaultTheme);
      },
    });

    ctx.registerVerb({
      name: 'styles',
      summary: 'List available themes. Click a row to preview.',
      async run(vctx) {
        pushStylesTable(vctx);
      },
    });

    ctx.registerVerb({
      name: 'clear',
      summary: 'Clear any active theme preview.',
      async run(vctx) {
        const confirmedId = state.user.useDefault
          ? DEFAULT_THEME_ID
          : state.user.activeThemeId;
        const previewId = state.ephemeral.previewThemeId;
        if (previewId && previewId !== confirmedId) {
          restoreConfirmedTheme();
          state.ephemeral.previewThemeId = confirmedId;
          return;
        }
        vctx.scrollback.push({
          kind: 'status',
          text: 'no preview active',
          level: 'info',
          ts: Date.now(),
        });
      },
    });
  },

  // Self-starting: ensures the theme is applied at shell boot for all
  // clients, even those that never open the Style app. This hook runs
  // after env hydration, so the admin default is available.
  autostart() {
    envHydrated = true;
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
    envHydrated = false;
  },
};
