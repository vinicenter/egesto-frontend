<script lang="ts" setup>
import type { IBrand } from '../../../types/brand';
import BrandForm from '../../../components/BrandForm.vue';

const emit = defineEmits(['submit']);

defineProps<{
  model: IBrand
  loading: boolean
}>()
</script>

<template>
  <BrandForm
    :disabled="false"
    button-label="Salvar"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'edit')"
  />
</template>

<route lang="yaml">
name: edit-brands
path: editar
meta:
  title: Editar marca
</route>
