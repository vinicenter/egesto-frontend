import type { App } from 'vue'
import axios from 'axios'

const instance = axios.create({
  baseURL: '/api/v1',
})

export const install = (app: App) => {
  app.provide('axios', instance)
}
