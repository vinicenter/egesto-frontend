<script setup lang="ts">
import type { AxiosError } from 'axios';
import LoginForm from '../../components/LoginForm.vue'
import { saveTenant } from '~utils/tenant'
import { saveToken } from '~utils/auth'
import { createLogin } from '../../datasource/auth';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import useNotify from '@/src/core/composables/useNotify';

const router = useRouter();
const loading = ref(false);

const { displayMessage } = useNotify()

const model = reactive({
  tenant: '',
  username: '',
  password: '',
})

const submit = async () => {
  saveTenant(model.tenant)

  try {
    loading.value = true
    const data = await createLogin(model.username, model.password)

    saveToken(data.token)
    
    router.push({ name: 'home' })

    displayMessage({
      message: 'Login efetuado com sucesso',
      type: 'success'
    })
  }
  catch (err) {
    const error = err as AxiosError<{ error: string }>

    displayMessage({
      message: error.response?.data.error as string || 'Erro ao efetuar login. Verifique suas credências e tente novamente',
      type: 'error'
    })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex justify-center items-center h-full">
    <div class="w-300px h-300px">
      <LoginForm
        :model="model"
        :loading="loading"
        @submit="submit"
      />
    </div>
  </div>
</template>

<route lang="yaml">
name: login-user
path: entrar
meta:
  disable-navbar: true
</route>
