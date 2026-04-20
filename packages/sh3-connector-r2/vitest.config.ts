import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  test: {
    globals: false,
    include: ['src/**/*.test.ts'],
    environment: 'node',
    testTimeout: 15_000,
    server: {
      deps: {
        inline: [/\.svelte$/, /^sh3-file-explorer/],
      },
    },
  },
});
