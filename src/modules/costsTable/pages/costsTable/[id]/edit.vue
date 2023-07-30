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
    button-label="Salvar"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'edit')"
  />
</template>

<route lang="yaml">
name: edit-costs-table
path: editar
meta:
  title: Editar Tabelas de Custos
</route>
