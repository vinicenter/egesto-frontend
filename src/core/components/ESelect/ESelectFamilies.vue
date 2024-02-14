<script lang="ts" setup>
import { getFamilies } from '@/src/modules/families/datasource/families'
import { formatFamilyLabel } from '@/src/modules/products/utils/formatter';
import { computed } from 'vue';

const props = defineProps<{
  familyType: 'main' | 'linked' | 'all'
  mainFamily?: string
}>()

const queryParams = computed(() => {
  return {
    familyType: props.familyType,
    mainFamily: props.mainFamily,
  }
})
</script>

<template>
  <ESelectQuery
    :item-title="formatFamilyLabel"
    item-value="_id"
    label="Familia"
    queryKey="select-families"
    :query-fn="getFamilies"
    :query-variables="queryParams"
  />
</template>
