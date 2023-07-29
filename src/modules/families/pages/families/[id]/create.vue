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
    button-label="Criar"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'create')"
  />
</template>

<route lang="yaml">
name: create-families
path: criar
meta:
  title: Criar família
</route>
