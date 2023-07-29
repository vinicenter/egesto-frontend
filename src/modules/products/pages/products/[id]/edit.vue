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
    :disabled="false"
    button-label="Salvar"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'edit')"
  />
</template>

<route lang="yaml">
name: edit-products
path: editar
meta:
  title: Editar produto
</route>
