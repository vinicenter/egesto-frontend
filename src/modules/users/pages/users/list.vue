<script lang="ts" setup>
import { useInfiniteQuery } from '@tanstack/vue-query';
import { getUsers } from '../../datasource/auth';
import { ref, unref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const search = ref<string | undefined>(undefined)

const columns = [
  { label: 'Username', style: 'width: 100px' },
  { label: 'Nome', style: 'width: 200px' },
  { label: 'Email', style: 'width: 50px' },
  { label: 'Ações', style: 'width: 30px' }
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
  queryFn: ({ pageParam, queryKey }) => getUsers({ page: pageParam, search: unref(queryKey[1]) }),
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
  <div class="flex mb-sm">
    <div class="flex items-center w-50">
      <VBtn
        @click="router.push({ name: 'create-user', params: { id: 'novo' } })"
        class="p-sm"
        color="primary"
      >
        Novo
      </VBtn>
    </div>

    <VTextField
      label="Pesquisar"
      hide-details="auto"
      clearable
      @click:clear="search = undefined"
      @keyup.enter="search = $event.target.value"
    />
  </div>

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
      <td>{{ item.email || '-' }}</td>
      <td>
        <ETableActionButtons
          :id="item._id"
          delete
          edit
          :clone="false"
        />
      </td>
    </template>
  </ETable>
</template>

<route lang="yaml">
name: list-users
path: listar
meta:
  title: Usuários
</route>
