<script lang="ts" setup>
import type { IUser } from '../../../types/auth';
import UserForm from '../../../components/UserForm.vue';

defineProps<{
  model: IUser
  loading: boolean
}>()
</script>

<template>
  <VCard title="Clonar usuário">
    <UserForm
      :disabled="false"
      button-label="Clonar"
      :model="model"
      :loading="loading"
    />
  </VCard>
</template>

<route lang="yaml">
name: clone-user
path: clonar
</route>
