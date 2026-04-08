# sh3-style

Theme editor app for [SH3](https://github.com/Unfinished-Lair/sh3/). Lets users preview, customize, and apply shell-wide visual themes. Administrators can publish a default theme that applies to all clients.

## Features

- **Live preview** -- click any theme in the sidebar to preview it instantly without committing.
- **Built-in presets** -- Dark, Light, Neon Pulse, Jade Garden, and Matcha Ink.
- **User themes** -- create, duplicate, rename, import/export custom themes.
- **Admin default** -- admins can set any theme as the shell-wide default for all users.
- **Full token coverage** -- surfaces, inputs, borders, text, accent, semantic colors (error/warning/success), border radius, typography, and gradients.

## Token reference

| Category | Tokens |
|---|---|
| Surfaces | `shell-bg`, `shell-bg-elevated`, `shell-bg-sunken`, `shell-input-bg` |
| Borders | `shell-border`, `shell-border-strong` |
| Text | `shell-fg`, `shell-fg-muted`, `shell-fg-subtle` |
| Accent | `shell-accent`, `shell-accent-muted` |
| Semantic | `shell-error`, `shell-warning`, `shell-success` |
| Shape | `shell-radius-sm`, `shell-radius`, `shell-radius-md`, `shell-radius-lg` |
| Typography | `shell-font-ui`, `shell-font-mono`, `shell-font-size`, `shell-line` |
| Gradients | `shell-grad-bg`, `shell-grad-bg-elevated`, `shell-grad-bg-sunken` |

## Architecture

- **Shard** (`sh3-style`) -- self-starting shard that applies the confirmed theme at boot. Uses `autostart` to ensure themes are applied for all clients, including those that never open the app. Restores the confirmed theme on `suspend` (Home button) and `deactivate`.
- **App** (`sh3-style`) -- single-view app hosting the theme editor. Restores the confirmed theme on `deactivate` (app switch).
- **State zones** -- `user` zone persists the active theme selection and custom themes; `ephemeral` zone tracks the in-progress preview.
- **Env** -- admin default theme is stored in the shard's env zone and synced to all clients.

## Building

```bash
# Library build (for use as a dependency)
npm run build

# Artifact build (for sh3 registry distribution)
npm run build:artifact
```

Requires `sh3-core ^0.5.0` as a peer dependency.
