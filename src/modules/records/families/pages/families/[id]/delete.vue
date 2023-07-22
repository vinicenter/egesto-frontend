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
    :disabled="true"
    button-label="Excluir"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'delete')"
  />
</template>

<route lang="yaml">
name: delete-families
path: deletar
meta:
  title: Excluir família
</route>
