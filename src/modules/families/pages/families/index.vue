<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { getFamilies } from '../../datasource/families';

const router = useRouter();

const columns = [
  {
    label: 'Nome',
    style: 'width: 100px',
    orderByValue: 'name',
    defaultOrderByValue: true
  },
  {
    label: 'Custo total',
    style: 'width: 100px',
    tooltip: 'É a somatória de todos os custos da família',
  },
]
</script>

<template>
  <ETableGenericList
    :columns="columns"
    :list-data-source="getFamilies"
    query-key="families"
    @new="router.push({ name: 'family', params: { id: 'novo', type: 'criar' } })"
  >
    <template #default="{ item }">
      <td>{{ item.name || '-' }}</td>
      <td>{{ item.totalCosts ? `${item.totalCosts}%` : '-' }}</td>
    </template>

    <template #actions="{ item }">
      <ETableActionButtons
        :id="item._id"
        delete
        edit
        :clone="false"
        page="family"
      />
    </template>
  </ETableGenericList>
</template>

<route lang="yaml">
name: list-families
meta:
  title: Famílias
</route>
