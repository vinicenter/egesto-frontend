<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

import { getBrands } from '../../datasource/brands';

const columns = [
  { label: 'Nome', style: 'width: 100px' },
  { label: 'Descrição', style: 'width: 200px' },
]
</script>

<template>
  <ETableGenericList
    :columns="columns"
    :list-data-source="getBrands"
    @new="router.push({ name: 'create-brands', params: { id: 'novo' } })"
  >
    <template #default="{ item }">
      <td>{{ item.name }}</td>
      <td>{{ item.description }}</td>
    </template>

    <template #actions="{ item }">
      <ETableActionButtons
        :id="item._id"
        delete
        edit
        :clone="false"
        page="brands"
      />
    </template>
  </ETableGenericList>
</template>

<route lang="yaml">
name: list-brands
path: listar
meta:
  title: Marcas
</route>
