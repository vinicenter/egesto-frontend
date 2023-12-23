<script setup lang="ts">
import { saveTenant } from '~utils/tenant'
import { saveToken } from '~utils/auth'
import { createLogin } from '../../datasource/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import useNotify from '@/src/core/composables/useNotify';
import { LoginFormValues } from '../../components/LoginForm.vue';

const loading = ref(false);
const router = useRouter();
const { displayMessage } = useNotify();

const submit = async (values: LoginFormValues) => {
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
}
</script>

<template>
  <div class="flex justify-center items-center h-full">
    <div class="w-300px h-300px space-y-sm">
      <div class="flex flex-col items-center">
        <div class="text-3xl">eGesto</div>
        <div class="text-1xl">um gesto digital</div>
      </div>

      <LoginForm
        @submit="submit"
        :loading="loading"
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
