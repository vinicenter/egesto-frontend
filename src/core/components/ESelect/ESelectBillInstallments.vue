<script lang="ts" setup>
import { getInstallments } from '@/src/modules/bills/datasource/bill-installments';
</script>

<template>
  <ESelectQuery
    item-title="name"
    item-value="_id"
    label="Parcelamentos"
    queryKey="select-bill-installments"
    :query-fn="getInstallments"
  />
</template>
