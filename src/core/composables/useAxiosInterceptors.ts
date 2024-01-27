import { useRoute, useRouter } from 'vue-router'
import axios from '@/src/core/utils/axios'
import useNotify from '@/src/core/composables/useNotify'
import useAuth from './useAuth';
import { ref } from 'vue';

const isUnauthorized = ref(false)

export default () => {
  const router = useRouter()
  const route = useRoute()

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

  const handleUnauthorized = () => {
    if(route.name === 'login-user') {
      return
    }

    displayMessage({ message: 'Sessão expirada, faça login novamente', type: 'error' })
    isUnauthorized.value = true
  }

  axios.interceptors.response.use(undefined, function (error) {
    if(error.response.status === 401) handleUnauthorized()
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
    isUnauthorized,
    logout,
  }
}
