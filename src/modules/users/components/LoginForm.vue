<script lang="ts" setup>
import { required } from '@/src/core/utils/form-validator';
import { useForm } from 'vee-validate';

const props = defineProps<{
  loading: boolean
  disableTenant?: boolean
  initialValues?: Partial<LoginFormValues>
}>()

export interface LoginFormValues {
  tenant: string
  username: string
  password: string
}

const form = useForm<LoginFormValues>({
  initialValues: props.initialValues
})

const emit = defineEmits<{
  (e: 'submit', values: LoginFormValues): void
}>()

const submit = form.handleSubmit(async(values) => emit('submit', values))
</script>

<template>
  <form @submit.prevent="submit">
    <EInputText
      v-if="!disableTenant"
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
