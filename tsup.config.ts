import { defineConfig } from 'tsup'
export default defineConfig({
  entry: ['./src/index.ts', './src/index.all.ts'],
  format: ['esm', 'iife', 'cjs'],
  globalName: 'dateFns',
  clean: true,
  dts: {
    entry: ['./src/index.ts', './src/index.all.ts'],
  },
  outDir: 'build',
})
