<script lang="ts" setup>
import type { ICostsTable } from '../../../types/costsTable';

const emit = defineEmits(['submit']);

defineProps<{
  model: ICostsTable.Root
  loading: boolean
}>()
</script>

<template>
  <CostsTableForm
    :disabled="false"
    button-label="Criar"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'create')"
  />
</template>

<route lang="yaml">
name: create-costs-table
path: criar
meta:
  title: Criar Tabela de Custos
</route>
