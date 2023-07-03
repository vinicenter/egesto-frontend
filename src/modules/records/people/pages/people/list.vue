<script lang="ts" setup>
import { getPeople } from '../../datasource/people';

const columns = [
  { label: 'Razão Social', style: 'width: 100px' },
  { label: 'Cidade', style: 'width: 200px' },
  { label: 'Documento', style: 'width: 50px' }
]
</script>

<template>
  <ETableGenericList
    :columns="columns"
    :list-data-source="getPeople"
  >
    <template #default="{ item }">
      <td>{{ item.corporateName }}</td>
      <td>{{ item.city || '-' }}</td>
      <td>{{ item.document }}</td>
    </template>

    <template #actions="{ item }">
      <ETableActionButtons
        :id="item._id"
        delete
        edit
        :clone="false"
        page="people"
      />
    </template>
  </ETableGenericList>
</template>

<route lang="yaml">
name: list-people
path: listar
meta:
  title: Pessoas
</route>
