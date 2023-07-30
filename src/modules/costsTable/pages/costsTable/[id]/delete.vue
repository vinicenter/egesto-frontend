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
    :disabled="true"
    button-label="Excluir"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'delete')"
  />
</template>

<route lang="yaml">
name: delete-costs-table
path: deletar
meta:
  title: Excluir Tabelas de Custos
</route>
