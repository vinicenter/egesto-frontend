import { createPinia } from "pinia";
import { App } from "vue";

export const install = (app: App) => {
  const pinia = createPinia()
  app.use(pinia)
}
