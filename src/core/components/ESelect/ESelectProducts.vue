<script lang="ts" setup>
const props = defineProps<{
  onlyFeedstockEnabled?: boolean
}>()

import { getProducts } from '@/src/modules/products/datasource/products'
import { computed } from 'vue';

const queryVariables = computed(() => {
  return {
    onlyFeedstockEnabled: props.onlyFeedstockEnabled
  }
})
</script>

<template>
  <ESelectQuery
    item-title="name"
    item-value="_id"
    label="Produto"
    queryKey="select-products"
    :query-variables="queryVariables"
    :query-fn="getProducts"
  />
</template>
