<script lang="ts" setup>
import { getFamilies } from '@/src/modules/families/datasource/families'
import { formatFamilyLabel } from '@/src/modules/products/utils/formatter';
</script>

<template>
  <ESelectQuery
    :item-title="formatFamilyLabel"
    item-value="_id"
    label="Familia"
    queryKey="select-families"
    :query-fn="getFamilies"
  />
</template>
