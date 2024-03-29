import { createWebHashHistory, createRouter } from 'vue-router'
import routes from '~pages'
// import { isTokenSaved } from '~utils/auth'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export const install = (app) => {
  app.use(router)
}
