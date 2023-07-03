<script lang="ts" setup>
import { getUsers } from '../../datasource/auth';

const columns = [
  { label: 'Username', style: 'width: 100px' },
  { label: 'Nome', style: 'width: 200px' },
  { label: 'Email', style: 'width: 50px' }
]
</script>

<template>
  <ETableGenericList
    :columns="columns"
    :list-data-source="getUsers"
  >
    <template #default="{ item }">
      <td>{{ item.username }}</td>
      <td>{{ item.name }}</td>
      <td>{{ item.email || '-' }}</td>
    </template>

    <template #actions="{ item }">
      <ETableActionButtons
        :id="item._id"
        delete
        edit
        :clone="false"
        page="user"
      />
    </template>
  </ETableGenericList>
</template>

<route lang="yaml">
name: list-users
path: listar
meta:
  title: Usuários
</route>
