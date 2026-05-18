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
import ThemeListView from './editor/ThemeListView.svelte';
import StyleEditView from './editor/StyleEditView.svelte';
import StylesTable from './rich/StylesTable.svelte';

/** Shape of the env state for sh3-style. */
interface StyleEnv {
  [key: string]: unknown;
  defaultTheme: DefaultTheme | null;
}

// Module-level refs so the env-reactive effect and deactivate hook can
// access shard state.
let stateRef: ThemeState | null = null;
let envRef: StyleEnv | null = null;
// True once env has finished hydrating from the server. Before this
// point, applyConfirmed must not permanently mutate useDefault. The
// env-reactive effect inside register() flips this on the first
// post-hydration fire.
let envHydrated = false;
// Disposer for the $effect.root that watches env.defaultTheme. Captured
// during register(); torn down in deactivate(). Replaces v2's autostart
// hook which fired once after env hydration.
let stopEnvEffect: (() => void) | null = null;

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
    views: [
      { id: 'sh3-style-list', label: 'Themes' },
      { id: 'sh3-style-edit', label: 'Style Editor' },
    ],
  },

  register(ctx: ShardContext) {
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

    // Seed the shared preview id so both views agree on initial selection.
    if (state.ephemeral.previewThemeId == null) {
      state.ephemeral.previewThemeId = state.user.useDefault
        ? DEFAULT_THEME_ID
        : state.user.activeThemeId;
    }

    // Apply the confirmed theme eagerly. Note: env is not yet hydrated
    // from the server at this point, so env.defaultTheme may still be
    // null. autostart() re-applies once env is ready.
    applyConfirmed(state.user, env);

    ctx.registerView('sh3-style-list', {
      mount(container, _context) {
        const component = mount(ThemeListView, {
          target: container,
          props: {
            state: state.user,
            ephemeralState: state.ephemeral,
            env,
          },
        });
        return {
          unmount() {
            unmount(component);
          },
        };
      },
    });

    ctx.registerView('sh3-style-edit', {
      mount(container, _context) {
        const component = mount(StyleEditView, {
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

    // Re-apply whenever env hydrates with a server-side default theme.
    // Replaces v2's autostart() hook: v3 runs register() before env
    // hydrate, so we observe env.defaultTheme reactively. The env proxy
    // is a Svelte 5 $state, so Object.assign at hydration time triggers
    // this effect even when the value is unchanged.
    //
    // First fire is synchronous during register() and is redundant with
    // the eager applyConfirmed() above — skip it. Subsequent fires
    // happen after the framework's env hydrate completes; that's where
    // envHydrated flips and the confirmed theme is re-applied.
    let firstFire = true;
    stopEnvEffect = $effect.root(() => {
      $effect(() => {
        const _dep = env.defaultTheme;
        void _dep;
        if (firstFire) {
          firstFire = false;
          return;
        }
        envHydrated = true;
        if (stateRef && envRef) applyConfirmed(stateRef, envRef);
      });
    });
  },

  // Restore the confirmed theme when the user hits Home (undo any preview).
  suspend() {
    restoreConfirmedTheme();
  },

  deactivate() {
    stopEnvEffect?.();
    stopEnvEffect = null;
    // Restore the confirmed theme on shard teardown (undo any preview).
    restoreConfirmedTheme();
    stateRef = null;
    envRef = null;
    envHydrated = false;
  },
};
