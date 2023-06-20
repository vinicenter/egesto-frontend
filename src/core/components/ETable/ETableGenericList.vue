<script lang="ts" setup>
const props = defineProps<{
  columns: { label: string, style: string }[];
  listDataSource: Function;
}>();

import { useInfiniteQuery } from '@tanstack/vue-query';
import { ref, unref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const search = ref<string | undefined>(undefined)

const {
  data,
  fetchNextPage,
  hasNextPage,
  isLoading,
  isFetchingNextPage,
  isFetching,
} = useInfiniteQuery({
  queryKey: [ 'users', search ],
  queryFn: ({ pageParam, queryKey }) => props.listDataSource({ page: pageParam, search: unref(queryKey[1]) }),
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
  <div>
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
        <slot :item="item" />
      </template>
    </ETable>
  </div>
</template>
