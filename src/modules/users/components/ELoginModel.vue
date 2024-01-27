<script setup lang="ts">
import { createLogin } from '@/src/modules/users/datasource/auth';
import { ref } from 'vue';
import useNotify from '@/src/core/composables/useNotify';
import { LoginFormValues } from '@/src/modules/users/components/LoginForm.vue';
import useAuth from '@/src/core/composables/useAuth';

const modelValue = defineModel<boolean>()
const emit = defineEmits<{
  (e: 'logout'): void
}>()

const logout = () => {
  modelValue.value = false
  emit('logout')
}

const loading = ref(false);
const { displayMessage } = useNotify();

const { authStorage } = useAuth();

const initialValues = {
  username: authStorage.value?.username,
}

const submit = async (values: LoginFormValues) => {
  try {
    loading.value = true
    const data = await createLogin(values.username, values.password)

    authStorage.value = data

    displayMessage({
      message: 'Login efetuado com sucesso',
      type: 'success'
    })

    modelValue.value = false
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
  <VDialog v-model="modelValue" :width="350" persistent>
    <VCard>
      <VCardTitle>
        <h1 class="text-2xl font-bold">Login</h1>
      </VCardTitle>

      <VCardText class="space-y-4">
        <LoginForm
          disable-tenant
          @submit="submit"
          :loading="loading"
          :initial-values="initialValues"
        />

        <VBtn
          class="w-full"
          prepend-icon="mdi-logout"
          @click="logout"
        >
          Sair
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
