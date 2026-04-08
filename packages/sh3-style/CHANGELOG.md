# Changelog

## 0.2.1

### Bug fixes

- **Preview persists on Home button** -- added `shard.suspend()` hook to restore the confirmed theme when navigating to Home. Also added `app.deactivate()` for the app-switch path.
- **Default theme not applying to pristine clients** -- added `shard.autostart()` so the theme shard runs at boot for all clients. Changed `useDefault` initial state to `true` so new clients pick up the admin default. The `autostart` hook re-applies the theme after env hydration, when the server-stored default is available.

### New tokens

- `shell-input-bg` -- input field background.
- `shell-error`, `shell-warning`, `shell-success` -- semantic status colors.
- `shell-radius-sm`, `shell-radius`, `shell-radius-md`, `shell-radius-lg` -- border radius scale.

### Preset updates

- All presets now include values for input background, semantic colors, and border radius.
- **Light** -- softer, rounder radius scale (4/6/8/10px).
- **Neon Pulse** -- tighter, sharper radius (2/3/4/6px); neon-tinted semantic colors.
- **Jade Garden** -- organic, rounded radius (6/8/10/14px); earthy semantic colors.
- **Matcha Ink** -- understated radius (2/3/5/7px); muted semantic colors.

### New editor section

- **Shape** -- new editor panel for border radius tokens with live preview squares.

## 0.2.0

### Features

- Live theme preview on click (no confirmation required to see changes).
- "Use style" button to confirm and persist a previewed theme.
- Admin default theme: admins can publish a theme as the shell-wide default.
- Default theme pseudo-entry in the sidebar.
- Theme renaming for user themes.

### Architecture

- Added `DefaultTheme` type and `useDefault` flag to `ThemeState`.
- Env zone for admin default storage via `ctx.env()` / `ctx.envUpdate()`.
- Ephemeral state zone for tracking in-progress preview.
- `onDestroy` cleanup to revert preview on view unmount.

## 0.1.0

- Initial release.
- Theme editor with color, typography, and gradient sections.
- Five built-in presets: Dark, Light, Neon Pulse, Jade Garden, Matcha Ink.
- User theme CRUD: create, duplicate, delete, import/export.
