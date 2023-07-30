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
    button-label="Clonar"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'create')"
  />
</template>

<route lang="yaml">
name: clone-products
path: clonar
meta:
  title: Clonar Produto
</route>
