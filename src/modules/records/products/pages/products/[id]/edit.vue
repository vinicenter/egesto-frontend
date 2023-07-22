<script lang="ts" setup>
import type { IPeople } from '../../../types/people';
import PersonForm from '../../../components/PersonForm.vue';

const emit = defineEmits(['submit']);

defineProps<{
  model: IPeople
  loading: boolean
}>()
</script>

<template>
  <PersonForm
    :disabled="false"
    button-label="Salvar"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'edit')"
  />
</template>

<route lang="yaml">
name: edit-people
path: editar
meta:
  title: Editar pessoa
</route>
