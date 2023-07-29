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
    button-label="Criar"
    :model="model"
    :loading="loading"
    :password-required="true"
    @submit="emit('submit', 'create')"
  />
</template>

<route lang="yaml">
name: create-brands
path: criar
meta:
  title: Criar marca
</route>
