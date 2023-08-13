<script lang="ts" setup>
import type { IPricesTable } from '../../../types/pricesTable';

const emit = defineEmits(['submit']);

defineProps<{
  model: IPricesTable.Root
  loading: boolean
}>()
</script>

<template>
  <PricesTableForm
    :disabled="true"
    button-label="Excluir"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'delete')"
  />
</template>

<route lang="yaml">
name: delete-prices-table
path: deletar
meta:
  title: Excluir Tabelas de Preços
</route>
