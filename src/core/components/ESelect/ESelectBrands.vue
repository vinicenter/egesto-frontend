<script lang="ts" setup>
import { getBrands } from '@/src/modules/records/brands/datasource/brands'
</script>

<template>
  <ESelectQuery
    item-title="name"
    item-value="_id"
    label="Marca"
    queryKey="select-brands"
    :query-fn="getBrands"
  />
</template>
