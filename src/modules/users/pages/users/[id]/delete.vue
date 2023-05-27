<script lang="ts" setup>
import type { IUser } from '../../../types/auth';
import UserForm from '../../../components/UserForm.vue';

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
    />
  </VCard>
</template>

<route lang="yaml">
name: delete-user
path: deletar
</route>
