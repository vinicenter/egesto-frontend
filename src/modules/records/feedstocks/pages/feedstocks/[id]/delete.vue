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
    :disabled="true"
    button-label="Excluir"
    :model="model"
    :loading="loading"
    @submit="emit('submit', 'delete')"
  />
</template>

<route lang="yaml">
name: delete-feedstocks
path: deletar
meta:
  title: Deletar matéria prima
</route>
