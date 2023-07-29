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
    :disabled="true"
    button-label="Excluir"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'delete')"
  />
</template>

<route lang="yaml">
name: delete-people
path: deletar
meta:
  title: Excluir marca
</route>
