<script lang="ts" setup>
import type { IProduct } from '../../../types/product';

const emit = defineEmits(['submit']);

defineProps<{
  model: IProduct.Root
  loading: boolean
}>()
</script>

<template>
  <ProductForm
    :disabled="true"
    button-label="Excluir"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'delete')"
  />
</template>

<route lang="yaml">
name: delete-products
path: deletar
meta:
  title: Excluir Produto
</route>
