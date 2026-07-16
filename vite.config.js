/**
 * FILE: vite.config.js
 * PURPOSE: Vite configuration for building the Three.js project
 * NOTE: Anyone can edit — roger in the group chat before pushing to main.
 */
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist'
  }
});
