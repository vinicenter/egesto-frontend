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
    button-label="Clonar"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'create')"
  />
</template>

<route lang="yaml">
name: clone-costs-table
path: clonar
meta:
  title: Clonar Tabela de Custos
</route>
