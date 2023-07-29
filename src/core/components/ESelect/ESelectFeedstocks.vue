<script lang="ts" setup>
import { getFeedStocks } from '@/src/modules/feedstocks/datasource/feedstocks'
</script>

<template>
  <ESelectQuery
    item-title="name"
    item-value="_id"
    label="Matéria prima"
    queryKey="select-feedstocks"
    :query-fn="getFeedStocks"
  />
</template>
