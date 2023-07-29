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
    :disabled="true"
    button-label="Excluir"
    :model="model"
    :loading="loading"
    :password-required="false"
    @submit="emit('submit', 'delete')"
  />
</template>

<route lang="yaml">
name: delete-user
path: deletar
meta:
  title: Excluir usuário
</route>
