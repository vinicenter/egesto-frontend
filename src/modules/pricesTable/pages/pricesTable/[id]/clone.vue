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
    button-label="Clonar"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'create')"
  />
</template>

<route lang="yaml">
name: clone-prices-table
path: clonar
meta:
  title: Clonar Tabela de Preços
</route>
