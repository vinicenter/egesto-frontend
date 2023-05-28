<script lang="ts" setup>
import { useInfiniteQuery } from '@tanstack/vue-query';
import { getUsers } from '../../datasource/auth';
import { ref, unref } from 'vue';

const search = ref<string | undefined>(undefined)

const columns = [
  { label: 'Username', style: 'width: 100px' },
  { label: 'Nome', style: 'width: 100px' },
  { label: 'Email', style: 'width: 100px' },
  { label: 'Ações', style: 'width: 100px' }
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
  queryFn: ({ pageParam, queryKey }) => getUsers({ page: pageParam, perPage: 50, search: unref(queryKey[1]) }),
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
      class="p-sm"
      @keyup.enter="search = $event.target.value"
    />

    <ETable
      class="p-sm"
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
        <td>
          <ETableActionButtons
            :id="item._id"
            delete
            edit
          />
        </td>
      </template>
    </ETable>
  </VCard>
</template>

<route lang="yaml">
name: list-users
path: listar
</route>
