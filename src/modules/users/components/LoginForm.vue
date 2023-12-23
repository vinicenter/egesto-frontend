<script lang="ts" setup>
import { required } from '@/src/core/utils/form-validator';
import { useForm } from 'vee-validate';

defineProps<{
  loading: boolean
}>()

export interface LoginFormValues {
  tenant: string
  username: string
  password: string
}

const form = useForm<LoginFormValues>()

const emit = defineEmits<{
  (e: 'submit', values: LoginFormValues): void
}>()

const submit = form.handleSubmit(async(values) => emit('submit', values))
</script>

<template>
  <form @submit.prevent="submit">
    <EInputText
      name="tenant"
      label="Empresa"
      :disabled="loading"
      :rules="[required]"
    />

    <EInputText
      name="username"
      label="Usuário"
      :disabled="loading"
      :rules="[required]"
    />

    <EInputText
      name="password"
      label="Senha"
      type="password"
      :disabled="loading"
      :rules="[required]"
    />

    <VBtn
      :loading="loading"
      type="submit"
      class="mt-2"
      block
    >
      Entrar
    </VBtn>
  </form>
</template>
