import { createApp } from 'vue'

import 'virtual:uno.css'
import App from './App.vue'

import { applyPlugins } from '@/src/core/plugins'

const app = createApp(App)
const plugins = applyPlugins(app)

Promise.all(plugins).then(() => {
  app.mount('#app')
})
