import { useRouter } from 'vue-router'
import axios from '@/src/core/utils/axios'
import { getTenant, removeTenant } from '../utils/tenant';
import { getToken, removeToken } from '../utils/auth';
import useNotify from '@/src/core/composables/useNotify'

export default () => {
  const router = useRouter()

  const { displayMessage } = useNotify()

  const logout = () => {
    removeToken()
    removeTenant()

    router.push({ name: 'login-user' })

    displayMessage({ message: 'Sua sessão expirou, faça login novamente', type: 'error' })
  }

  axios.interceptors.response.use(undefined, function (error) {

    if(error.response.status === 401) logout()
    if(error.response.data.message === 'x-tenant is not supplied') logout()

    return Promise.reject(error);
  });

  axios.interceptors.request.use(async (config) => {
    const token = getToken()
    const tenant = getTenant()
  
    if(token) config.headers.set('Authorization', `Bearer ${token}`)
    if(tenant) config.headers.set('x-tenant', tenant)
  
    return config
  })  
}
