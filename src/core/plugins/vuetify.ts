import '@mdi/font/css/materialdesignicons.css'
import type { App } from 'vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { VInfiniteScroll } from 'vuetify/lib/labs/VInfiniteScroll/index'

export const install = (app: App) => {
  app.use(createVuetify({
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    components: [
      VInfiniteScroll,
    ]
  }))
}
