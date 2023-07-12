<script lang="ts" setup>
import dayjs from 'dayjs';

const props = defineProps<{
  columns: { label: string, style: string }[];
  queryKey: string;
  listDataSource: Function;
}>();

import { useInfiniteQuery } from '@tanstack/vue-query';
import { ref, unref } from 'vue';
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

const emit = defineEmits([ 'new' ])

const search = ref<string | undefined>(undefined)

const {
  data,
  fetchNextPage,
  hasNextPage,
  isLoading,
  isFetchingNextPage,
  isFetching,
} = useInfiniteQuery({
  queryKey: [ props.queryKey, search ],
  queryFn: ({ pageParam, queryKey }) => props.listDataSource({ page: pageParam, search: unref(queryKey[1]) }),
  getNextPageParam: (lastPage) => lastPage?.nextPage,
  select: (data) => {
    const dataSelect = data?.pages?.reduce((acc, page) => {
      return [ ...acc, ...page.docs ]
    }, [])

    return dataSelect
  },
})

const columns = [
  ...props.columns,
  {
    label: 'Última atualização',
    style: 'width: 30px'
  },
  {
    label: 'Criação',
    style: 'width: 10px'
  },
  {
    label: 'Ações',
    style: 'width: 10px'
  }
]

const formatDate = (date: string) => {
  return date ? dayjs(date).format('DD/MM/YYYY HH:mm:ss') : '-'
}
</script>

<template>
  <div>
    <div class="flex mb-sm">
      <div class="flex items-center w-50">
        <VBtn
          @click="emit('new')"
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

    <div v-if="isLoading">
      <VSkeletonLoader type="table-row-divider" />
      <VSkeletonLoader type="table-row" />
      <VSkeletonLoader type="table-row" />
      <VSkeletonLoader type="table-row" />
      <VSkeletonLoader type="table-row" />
      <VSkeletonLoader type="table-row" />
    </div>

    <ETable
      v-else
      class="p-sm"
      :columns="columns"
      :data="data"
      :next-page="fetchNextPage"
      :has-next-page="hasNextPage"
      :loading="isFetchingNextPage || isFetching"
    >
      <template #default="{ item }">
        <slot :item="item" />

        <td>{{ formatDate(item.updatedAt) }}</td>
        <td>{{ formatDate(item.createdAt) }}</td>

        <td v-if="$slots.actions">
          <slot :item="item" name="actions" />
        </td>
      </template>
    </ETable>
  </div>
</template>
