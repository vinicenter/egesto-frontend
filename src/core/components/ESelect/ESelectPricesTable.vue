<script lang="ts" setup>
import { getAllPricesTable } from '@/src/modules/pricesTable/datasource/pricesTable';
</script>

<template>
  <ESelectQuery
    item-title="name"
    item-value="_id"
    label="Tabelas de Preços"
    queryKey="select-prices-table"
    :query-fn="getAllPricesTable"
  />
</template>
