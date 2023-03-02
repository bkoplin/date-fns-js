import { defineConfig } from 'tsup'
export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm', 'iife', 'cjs'],
  clean: true,
  dts: {
    entry: ['./src/index.ts'],
  },
  outDir: 'build',
})
