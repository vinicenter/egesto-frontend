import { defineConfig } from 'vite'
import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import UnoCSS from 'unocss/vite'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname),
      '~utils': resolve(__dirname, 'src/core/utils'),
      '~constants': resolve(__dirname, 'src/core/constants'),
    },
  },
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    UnoCSS(),
    Pages({ dirs: [ 'src/modules/**/**/pages' ] }),
    Components({ dts: true, dirs: ['src/core/components/**', 'src/modules/**/**/components/**'], }),
  ],
})
