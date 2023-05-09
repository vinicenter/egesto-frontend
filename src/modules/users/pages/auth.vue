<script setup lang="ts">
import type { AxiosError } from 'axios';
import AuthForm from '../components/AuthForm.vue'
import { saveTenant } from '~utils/tenant'
import { saveToken } from '~utils/auth'
import { createLogin } from '../datasource/auth';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);

const model = reactive({
  tenant: '',
  username: '',
  password: '',
})

const snackbar = reactive<{
  show: boolean,
  text?: string
}>({
  show: false,
  text: undefined,
})

const submit = async () => {
  saveTenant(model.tenant)

  try {
    loading.value = true
    const data = await createLogin(model.username, model.password)

    saveToken(data.token)

    router.push({ name: 'home' })
  }
  catch (err) {
    const error = err as AxiosError<{ error: string }>

    snackbar.show = true
    snackbar.text = error.response?.data?.error
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex justify-center items-center h-full">
    <div class="w-300px h-300px">
      <AuthForm
        :model="model"
        :loading="loading"
        @submit="submit"
      />
    </div>
    <VSnackbar v-model="snackbar.show">
      {{ snackbar.text }}
    </VSnackbar>
  </div>
</template>

<route lang="yaml">
name: auth-user
path: /usuarios/entrar
meta:
  disable-navbar: true
</route>
