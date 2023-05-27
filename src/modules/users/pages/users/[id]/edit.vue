<script lang="ts" setup>
import type { IUser } from '../../../types/auth';
import UserForm from '../../../components/UserForm.vue';

defineProps<{
  model: IUser
  loading: boolean
}>()
</script>

<template>
  <VCard title="Editar usuário">
    <UserForm
      :disabled="false"
      button-label="Salvar"
      :model="model"
      :loading="loading"
    />
  </VCard>
</template>

<route lang="yaml">
name: edit-user
path: editar
</route>
