import { useRouter } from 'vue-router'
import axios from '@/src/core/utils/axios'
import useNotify from '@/src/core/composables/useNotify'
import useAuth from './useAuth';

export default () => {
  const router = useRouter()

  const {
    tenantStorage,
    authStorage,
  } = useAuth();

  const { displayMessage } = useNotify()

  const logout = (msg?: string) => {
    tenantStorage.value = undefined
    authStorage.value = undefined

    router.push({ name: 'login-user' })

    if(msg) {
      displayMessage({ message: msg, type: 'error' })
    }
  }

  axios.interceptors.response.use(undefined, function (error) {

    if(error.response.status === 401) logout('Sessão expirada, faça login novamente')
    if(error.response.data.message === 'x-tenant is not supplied') logout('Sessão expirada, faça login novamente')

    return Promise.reject(error);
  });

  axios.interceptors.request.use(async (config) => {
    const auth = authStorage.value
    const tenant = tenantStorage.value
  
    if(auth) config.headers.set('Authorization', `Bearer ${auth.token}`)
    if(tenant) config.headers.set('x-tenant', tenant)
  
    return config
  })

  return {
    logout,
  }
}
