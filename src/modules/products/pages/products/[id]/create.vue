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
    button-label="Criar"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'create')"
  />
</template>

<route lang="yaml">
name: create-products
path: criar
meta:
  title: Criar produto
</route>
