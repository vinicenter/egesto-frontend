<script lang="ts" setup>
import type { IFamily } from '../../../types/family';
import FamiliesForm from '../../../components/FamiliesForm.vue';

const emit = defineEmits(['submit']);

defineProps<{
  model: IFamily
  loading: boolean
}>()
</script>

<template>
  <FamiliesForm
    :disabled="false"
    button-label="Editar"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'edit')"
  />
</template>

<route lang="yaml">
name: edit-families
path: editar
meta:
  title: Editar família
</route>
