import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [vue(), vueJsx({
    babelPlugins: [
      ['@babel/plugin-transform-typescript', {allowDeclareFields: true}, 'plugin-transform-typescript'],
      ['@babel/plugin-proposal-decorators', {legacy: true}],
      ['@babel/plugin-proposal-class-properties', {loose: true}]
    ]
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
