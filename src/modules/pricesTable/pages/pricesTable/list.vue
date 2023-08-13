<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { getAllPricesTable } from '../../datasource/pricesTable';
import { ref } from 'vue';

const router = useRouter();

const columns = [
  {
    label: 'Nome',
    style: 'width: 200px',
    orderByValue: 'name',
    defaultOrderByValue: true
  },
]

const viewId = ref(null)

const closeView = (open = false) => {
  if(!open) {
    viewId.value = null
  }
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <ETableGenericList
    :columns="columns"
    :list-data-source="getAllPricesTable"
    query-key="pricesTable"
    @new="router.push({ name: 'create-prices-table', params: { id: 'novo' } })"
  >
    <template #default="{ item }">
      <td>{{ item.name || '-' }}</td>
    </template>

    <template #actions="{ item }">
      <ETableActionButtons
        :id="item._id"
        delete
        edit
        clone
        view
        page="prices-table"
        @view="viewId = $event"
      />
    </template>
  </ETableGenericList>

  <CostTableDetailsModel
    :model-value="!!viewId"
    :id="viewId"
    @update:model-value="closeView"
  />
</template>

<route lang="yaml">
name: list-prices-table
path: listar
meta:
  title: Tabelas de Preços
</route>
