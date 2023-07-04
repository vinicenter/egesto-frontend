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
