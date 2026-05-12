import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { sh3CssInline, sh3Artifact } from 'sh3-core/build';

export default defineConfig({
  plugins: [
    svelte(),
    sh3CssInline(),
    // buildSuffix: 'auto' appends a semver build-metadata segment
    // (commits since the latest reachable git tag) to the artifact
    // version in manifest.json. Lets you ship many test iterations
    // of the same release without bumping package.json. Drop the
    // option (or set to '') to disable.
    sh3Artifact({ buildSuffix: 'auto' }),
  ],
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: 'bundle',
    },
    outDir: 'dist/artifact',
    rollupOptions: {
      external: ['sh3-core', /^sh3-core\//, 'svelte', /^svelte\//],
    },
  },
});
