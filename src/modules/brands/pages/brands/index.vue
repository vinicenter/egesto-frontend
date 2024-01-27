<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

import { getBrands } from '../../datasource/brands';

const columns = [
  {
    label: 'Nome',
    style: 'width: 100px',
    defaultOrderByValue: true,
    orderByValue: 'name'
  },
  {
    label: 'Descrição',
    style: 'width: 200px',
    orderByValue: 'description'
  },
]

defineOptions({
  name: 'BrandsList'
})
</script>

<template>
  <ETableGenericList
    :columns="columns"
    :list-data-source="getBrands"
    query-key="brands"
    @new="router.push({ name: 'brand', params: { id: 'novo', type: 'criar' } })"
  >
    <template #default="{ item }">
      <td>{{ item.name || '-' }}</td>
      <td
        class="truncate max-w-100px"
        :title="item.description || '-'"
      >
        {{ item.description || '-' }}
      </td>
    </template>

    <template #actions="{ item }">
      <ETableActionButtons
        :id="item._id"
        delete
        edit
        :clone="false"
        page="brand"
      />
    </template>
  </ETableGenericList>
</template>

<route lang="yaml">
name: list-brands
meta:
  title: Marcas
</route>
