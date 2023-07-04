<script lang="ts" setup>
import type { PersonType } from '@/functions/api/v1/records/models/people.schemas.ts'
import PersonForm from '../../../components/PersonForm.vue';

const emit = defineEmits(['submit']);

defineProps<{
  model: PersonType
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
  title: Deletar marca
</route>
