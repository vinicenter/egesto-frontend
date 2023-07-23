<script lang="ts" setup>
import { getProducts } from '@/src/modules/records/products/datasource/products'
</script>

<template>
  <ESelectQuery
    item-title="name"
    item-value="_id"
    label="Produto"
    queryKey="select-products"
    :query-fn="getProducts"
  />
</template>
