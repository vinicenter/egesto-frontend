<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { getAllCostsTable } from '../../datasource/costsTable';
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

defineOptions({
  name: 'CostTableList',
  inheritAttrs: false
})
</script>

<template>
  <ETableGenericList
    :columns="columns"
    :list-data-source="getAllCostsTable"
    query-key="costsTable"
    @new="router.push({ name: 'cost-table', params: { id: 'novo', type: 'criar' } })"
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
        page="cost-table"
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
name: list-costs-table
meta:
  title: Tabelas de Custos
</route>
