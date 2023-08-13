<script lang="ts" setup>
import { getPeople } from '@/src/modules/people/datasource/people';
</script>

<template>
  <ESelectQuery
    item-title="corporateName"
    item-value="_id"
    label="Pessoas"
    queryKey="select-people"
    :query-fn="getPeople"
  />
</template>
