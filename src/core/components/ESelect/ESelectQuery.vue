<script lang="ts" setup>
import { useInfiniteQuery } from '@tanstack/vue-query';
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import { ref, unref } from 'vue';

const props = defineProps<{
  queryFn: Function
}>()

const search = ref()

const {
  data,
  isLoading,
  isFetching,
  fetchNextPage,
  hasNextPage,
} = useInfiniteQuery({
  queryKey: [ 'selectGeneric', search ],
  queryFn: ({ pageParam, queryKey }) => props.queryFn({ page: pageParam, search: unref(queryKey[1]) }),
  getNextPageParam: (lastPage) => lastPage?.nextPage,
  select: ({ pages, pageParams }) => {
    const dataSelect = pages?.reduce((acc, page) => {
      return [ ...acc, ...page.docs ]
    }, [] as unknown[])

    return { pages: dataSelect, pageParams }
  },
})
</script>

<template>
  <VSelect
    :items="data?.pages"
    :loading="isLoading"
    item-title="name"
    item-value="_id"
    label="Marca"
  >
    <template v-slot:no-data />

    <template v-slot:prepend-item>
      <VTextField v-model="search" placeholder="Pesquisar" clearable></VTextField>

      <template v-if="!data?.pages.length">
        <template v-if="isLoading">
          <VSkeletonLoader type="list-item" />
          <VSkeletonLoader type="list-item" />
          <VSkeletonLoader type="list-item" />
          <VSkeletonLoader type="list-item" />
        </template>

        <div class="flex justify-center my-sm" v-else>Nenhum dado encontrado</div>
      </template>
    </template>

    <template v-slot:append-item>
      <div class="flex justify-center" v-if="hasNextPage && !isFetching">
        <VBtn @click="fetchNextPage">
          Buscar mais
        </VBtn>
      </div>
      <template v-if="isFetching">
        <VSkeletonLoader type="list-item" />
        <VSkeletonLoader type="list-item" />
        <VSkeletonLoader type="list-item" />
        <VSkeletonLoader type="list-item" />
      </template>
    </template>
  </VSelect>
</template>
