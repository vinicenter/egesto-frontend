<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { getPeople } from '../../datasource/people';

const router = useRouter();

const columns = [
  {
    label: 'Razão Social',
    style: 'width: 200px',
    orderByValue: 'corporateName',
    defaultOrderByValue: true,
  },
  { label: 'Documento', style: 'width: 100px' },
  { label: 'Cidade', style: 'width: 100px' },
  { label: 'Estado', style: 'width: 100px' }
]
</script>

<template>
  <ETableGenericList
    :columns="columns"
    :list-data-source="getPeople"
    query-key="people"
    @new="router.push({ name: 'person', params: { id: 'novo', type: 'criar' } })"
  >
    <template #default="{ item }">
      <td>{{ item.corporateName || '-' }}</td>
      <td>{{ item.document || '-' }}</td>
      <td>{{ item.address?.city || '-' }}</td>
      <td>{{ item.address?.federativeUnit || '-' }}</td>
    </template>

    <template #actions="{ item }">
      <ETableActionButtons
        :id="item._id"
        delete
        edit
        :clone="false"
        page="person"
      />
    </template>
  </ETableGenericList>
</template>

<route lang="yaml">
name: list-people
meta:
  title: Pessoas
</route>
