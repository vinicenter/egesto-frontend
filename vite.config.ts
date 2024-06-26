import { defineConfig } from 'vite'
import * as path from 'path'

import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import UnoCSS from 'unocss/vite'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
      '~utils': path.resolve(__dirname, 'src/core/utils'),
      '~constants': path.resolve(__dirname, 'src/core/constants'),
    },
  },
  plugins: [
    vue({
      script: {
        defineModel: true,
      },
    }),
    vuetify({ autoImport: true }),
    UnoCSS(),
    Pages({ dirs: [ 'src/modules/**/pages' ] }),
    Components({ dts: true, dirs: ['src/core/components/**', 'src/modules/**/components/**'], }),
    VueDevTools({
      clientHost: 'http://localhost:5173',
    })
  ],
  optimizeDeps: {
    include: [
      'pinia'
    ]
  }
})
