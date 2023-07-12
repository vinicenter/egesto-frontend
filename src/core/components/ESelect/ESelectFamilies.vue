<script lang="ts" setup>
import { getFamilies } from '@/src/modules/records/families/datasource/families'
import ESelectQuery from './ESelectQuery.vue';

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
