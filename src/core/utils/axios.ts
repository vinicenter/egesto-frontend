import { getTenant } from '~utils/tenant'
import { getToken } from '~utils/auth'
import { useRouter } from 'vue-router'
const router = useRouter()

import axios from 'axios'

const instance = axios.create({
  baseURL: '/api/v1',
})

instance.interceptors.request.use(async (config) => {
  const token = getToken()
  const tenant = getTenant()

  if(token) config.headers.set('Authorization', `Bearer ${token}`)
  if(tenant) config.headers.set('x-tenant', tenant)

  return config
}, (error) => {
  if (error.response.status === 401) {
    router.push({ name: 'auth-user' })
  }

  return Promise.reject(error)
})

export default instance
