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
    :disabled="false"
    button-label="Salvar"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'edit')"
  />
</template>

<route lang="yaml">
name: edit-prices-table
path: editar
meta:
  title: Editar Tabelas de Preços
</route>
