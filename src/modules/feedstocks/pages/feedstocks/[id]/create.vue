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
    button-label="Criar"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'create')"
  />
</template>

<route lang="yaml">
name: create-feedstocks
path: criar
meta:
  title: Criar matéria prima
</route>
