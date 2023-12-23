<script setup lang="ts">
import { saveTenant } from '~utils/tenant'
import { saveToken } from '~utils/auth'
import { createLogin } from '../../datasource/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import useNotify from '@/src/core/composables/useNotify';
import { useForm } from 'vee-validate';

interface FormValues {
  tenant: string
  username: string
  password: string
}

const form = useForm<FormValues>()

const loading = ref(false);
const router = useRouter();
const { displayMessage } = useNotify();

const submit = form.handleSubmit(async(values) => {
  saveTenant(values.tenant)

  try {
    loading.value = true
    const data = await createLogin(values.username, values.password)

    saveToken(data.token)

    router.push({ name: 'home' })

    displayMessage({
      message: 'Login efetuado com sucesso',
      type: 'success'
    })
  }
  catch {
    displayMessage({
      message: 'Erro ao efetuar login. Verifique suas credências e tente novamente',
      type: 'error'
    })
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex justify-center items-center h-full">
    <div class="w-300px h-300px space-y-sm">
      <div class="flex flex-col items-center">
        <div class="text-3xl">eGesto</div>
        <div class="text-1xl">um gesto digital</div>
      </div>

      <form @submit.prevent="submit">
        <LoginFields />

        <VBtn
          :loading="loading"
          type="submit"
          class="mt-2"
          block
        >
          Entrar
        </VBtn>
      </form>
    </div>
  </div>
</template>

<route lang="yaml">
name: login-user
path: entrar
meta:
  disable-navbar: true
</route>
