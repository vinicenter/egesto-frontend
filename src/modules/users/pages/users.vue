<script lang="ts" setup>
import { useInfiniteQuery } from '@tanstack/vue-query';
import { getUsers } from '../datasource/auth';
import { ref } from 'vue';

const search = ref<string | undefined>(undefined)

const setSearch = (value: any) => {
  search.value = value?.target?.value
}

const columns = [
  { label: 'Username', style: 'width: 100px' },
  { label: 'Nome', style: 'width: 100px' },
  { label: 'Email', style: 'width: 100px' }
]

const {
  data,
  fetchNextPage,
  hasNextPage,
  isLoading,
  isFetchingNextPage,
  isFetching,
} = useInfiniteQuery({
  queryKey: [ 'users', search ],
  queryFn: ({ pageParam, queryKey }) => getUsers({ page: pageParam, perPage: 50, search: queryKey[1] }),
  getNextPageParam: (lastPage) => lastPage?.result?.meta?.hasMorePages ? lastPage?.result?.meta?.page + 1 : undefined,
  select: (data) => {
    const dataSelect = data?.pages?.reduce((acc, page) => {
      return [ ...acc, ...page.result?.documents ]
    }, [])

    return dataSelect
  },
})
</script>

<template>
  <VCard class="h-full" title="Usuários">
    <VTextField
      label="Pesquisar"
      class="mb-4"
      @keyup.enter="setSearch"
    />

    <ETable
      :columns="columns"
      :data="data"
      :next-page="fetchNextPage"
      :has-next-page="hasNextPage"
      :loading="isLoading || isFetchingNextPage || isFetching"
    >
      <template #default="{ item }">
        <td>{{ item.username }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.email }}</td>
      </template>
    </ETable>
  </VCard>
</template>

<route lang="yaml">
name: users
path: /usuarios
</route>
