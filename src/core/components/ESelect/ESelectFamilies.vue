<script lang="ts" setup>
import { getFamilies } from '@/src/modules/families/datasource/families'
import { IFamily } from '@/src/modules/families/types/family';

const formatLabel = (item: IFamily) => {
  return `${item?.linkedFamily?.name ? `${item?.linkedFamily?.name} > ` : ''}${item?.name}`
}
</script>

<template>
  <ESelectQuery
    :item-title="formatLabel"
    item-value="_id"
    label="Familia"
    queryKey="select-families"
    :query-fn="getFamilies"
  />
</template>
