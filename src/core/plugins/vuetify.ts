import '@mdi/font/css/materialdesignicons.css'
import type { App } from 'vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import DayJsAdapter from '@date-io/dayjs'
import { pt, en } from 'vuetify/locale'

const theme = localStorage.getItem('theme') || 'light'

export const install = (app: App) => {
  app.use(createVuetify({
    locale: {
      locale: 'pt',
      fallback: 'en',
      messages: { pt, en }
    },
    theme: {
      defaultTheme: theme
    },
    date: {
      adapter: DayJsAdapter,
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
