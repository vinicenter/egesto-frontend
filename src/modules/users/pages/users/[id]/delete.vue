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
  <VCard title="Deletar usuário">
    <UserForm
      :disabled="true"
      button-label="Excluir"
      :model="model"
      :loading="loading"
      :password-required="false"
      @submit="emit('submit', 'delete')"
    />
  </VCard>
</template>

<route lang="yaml">
name: delete-user
path: deletar
</route>
