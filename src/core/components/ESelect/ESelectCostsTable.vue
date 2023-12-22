<script lang="ts" setup>
import { getAllCostsTable } from '@/src/modules/costsTable/datasource/costsTable';
</script>

<template>
  <ESelectQuery
    item-title="name"
    item-value="_id"
    label="Tabelas de Custos"
    queryKey="select-costs-table"
    :query-fn="getAllCostsTable"
  />
</template>
