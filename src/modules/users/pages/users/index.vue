<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { getUsers } from '../../datasource/auth';

const router = useRouter();

const columns = [
  {
    label: 'Username',
    style: 'width: 100px',
    orderByValue: 'username',
    defaultOrderByValue: true,
  },
  {
    label: 'Nome',
    style: 'width: 200px',
    orderByValue: 'name',
  },
  {
    label: 'Email',
    style: 'width: 50px',
    orderByValue: 'email',
  }
]
</script>

<template>
  <ETableGenericList
    :columns="columns"
    :list-data-source="getUsers"
    query-key="users"
    @new="router.push({ name: 'user', params: { id: 'novo', type: 'criar' } })"
  >
    <template #default="{ item }">
      <td>{{ item.username || '-' }}</td>
      <td>{{ item.name || '-' }}</td>
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
meta:
  title: Usuários
</route>
