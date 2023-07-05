<script lang="ts" setup>
import type { IFeedstock } from '../../../types/feedstocks';
import FeedStockForm from '../../../components/feedStockForm.vue';

const emit = defineEmits(['submit']);

defineProps<{
  model: IFeedstock
  loading: boolean
}>()
</script>

<template>
  <FeedStockForm
    :disabled="false"
    button-label="Editar"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'edit')"
  />
</template>

<route lang="yaml">
name: edit-feedstocks
path: editar
meta:
  title: Editar matéria prima
</route>
