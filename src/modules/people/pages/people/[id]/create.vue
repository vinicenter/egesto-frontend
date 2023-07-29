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
    button-label="Criar"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'create')"
  />
</template>

<route lang="yaml">
name: create-people
path: Criar
meta:
  title: Criar pessoa
</route>
