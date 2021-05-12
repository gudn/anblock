import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'

const production = !process.env.ROLLUP_WATCH

const buildConfig = (inputFilename, outputFilename, sourceMap = true) => ({
  input: inputFilename,
  output: {
    sourcemap: sourceMap,
    format: 'iife',
    name: 'anblock',
    file: outputFilename,
  },
  plugins: [
    typescript({
      sourceMap: sourceMap && !production,
      inlineSources: sourceMap && !production,
    }),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
})

export default [
  buildConfig('src/popup.ts', 'public/dist.popup.js'),
  buildConfig('src/background.ts', 'dist.background.js', false),
]
