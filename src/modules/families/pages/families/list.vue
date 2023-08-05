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
  },
]
</script>

<template>
  <ETableGenericList
    :columns="columns"
    :list-data-source="getFamilies"
    query-key="families"
    @new="router.push({ name: 'create-families', params: { id: 'novo' } })"
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
        page="families"
      />
    </template>
  </ETableGenericList>
</template>

<route lang="yaml">
name: list-families
path: listar
meta:
  title: Famílias
</route>
