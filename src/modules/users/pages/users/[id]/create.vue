<script lang="ts" setup>
import type { IUser } from '../../../types/auth';
import UserForm from '../../../components/UserForm.vue';

const emit = defineEmits(['submit']);

defineProps<{
  model: IUser
  loading: boolean
}>()
</script>

<template>
  <UserForm
    :disabled="false"
    button-label="Criar"
    :model="model"
    :loading="loading"
    :password-required="true"
    @submit="emit('submit', 'create')"
  />
</template>

<route lang="yaml">
name: create-user
path: criar
meta:
  title: Criar usuário
</route>
