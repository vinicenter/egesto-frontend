import '@mdi/font/css/materialdesignicons.css'
import type { App } from 'vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const theme = localStorage.getItem('theme') || 'light'

export const install = (app: App) => {
  app.use(createVuetify({
    theme: {
      defaultTheme: theme
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
  }))
}
