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
    button-label="Criar"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'create')"
  />
</template>

<route lang="yaml">
name: create-prices-table
path: criar
meta:
  title: Criar Tabela de Preços
</route>
