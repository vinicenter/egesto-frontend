<script lang="ts" setup>
import { getFamilies } from '@/src/modules/families/datasource/families'
</script>

<template>
  <ESelectQuery
    item-title="name"
    item-value="_id"
    label="Familia"
    queryKey="select-families"
    :query-fn="getFamilies"
  />
</template>
