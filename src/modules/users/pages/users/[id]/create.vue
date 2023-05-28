<script lang="ts" setup>
import type { IUser } from '../../../types/auth';
import UserForm from '../../../components/UserForm.vue';

\const emit = defineEmits(['submit']);

defineProps<{
  model: IUser
  loading: boolean
}>()
</script>

<template>
  <VCard title="Criar usuário">
    <UserForm
      :disabled="false"
      button-label="Clonar"
      :model="model"
      :loading="loading"
      :password-required="true"
      @submit="emit('submit', 'create')"
    />
  </VCard>
</template>

<route lang="yaml">
name: create-user
path: criar
</route>
