import type { App } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";

export const install = (app: App) => {
  app.use(VueQueryPlugin);
}
