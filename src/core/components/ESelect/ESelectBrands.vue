<script lang="ts" setup>
import { getBrands } from '@/src/modules/records/brands/datasource/brands'
import ESelectQuery from './ESelectQuery.vue';

</script>

<template>
  <ESelectQuery
    item-title="name"
    item-value="_id"
    label="Marca"
    :query-fn="getBrands"
  />
</template>
