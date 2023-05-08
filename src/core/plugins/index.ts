import type { App } from 'vue'
export type UserModule = (app: App) => void

const PLUGINS = import.meta.glob<{ install: UserModule }>([ './*.{js,ts}', '!**/index.{js,ts}' ], { eager: true })

export const applyPlugins = (app: App) => {
  return Object.values(PLUGINS).map(i => i.install?.(app))
}
