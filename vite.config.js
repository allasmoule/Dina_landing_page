import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures relative paths for cPanel / Shared hosting public_html
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
