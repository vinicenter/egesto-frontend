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
    :disabled="true"
    button-label="Deletar"
    :model="model"
    :loading="loading"
    :password-required="true"
    @submit="emit('submit', 'delete')"
  />
</template>

<route lang="yaml">
name: delete-brands
path: deletar
meta:
  title: Deletar marca
</route>
