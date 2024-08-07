<script lang="ts" setup>
import { humanizeDateRange, capitalizeFirstLetter } from '~utils/format'
import dayjs from '~utils/dayjs'

interface Column {
  label: string;
  orderLabel?: string;
  orderByValue?: string;
  defaultOrderByValue?: boolean;
  style?: string;
  tooltip?: string;
}

const props = withDefaults(
  defineProps<{
    columns: Column[];
    defaultOrder?: 'DESC' | 'ASC';
    queryKey: string;
    listDataSource: Function;
    queryVariables?: Record<string, unknown>;
  }>(),
  {
    defaultOrder: 'ASC',
  }
)

import { useInfiniteQuery } from '@tanstack/vue-query';
import { ref } from 'vue';
import ETable from './ETable.vue';
import { computed } from 'vue';

const emit = defineEmits([ 'new' ])

const columns: Column[] = [
  ...props.columns,
  {
    label: 'Última atualização',
    style: 'width: 20px',
    orderByValue: 'updatedAt'
  },
  {
    label: 'Criação',
    style: 'width: 20px',
    orderByValue: 'createdAt'
  },
  {
    label: '',
    style: 'width: 10px'
  }
]

const defaultOrderBy = columns.find(column => column.defaultOrderByValue)?.orderByValue || columns[0].orderByValue

const order = ref<'DESC' | 'ASC' | undefined>(props.defaultOrder)
const orderBy = ref<string | undefined>(defaultOrderBy)
const search = ref<string | undefined>(undefined)

const queryKey = computed(() => [ props.queryKey, search, orderBy, order, props.queryVariables ])

const {
  data,
  fetchNextPage,
  hasNextPage,
  isLoading,
  isFetchingNextPage,
  isFetching,
} = useInfiniteQuery({
  queryKey,
  queryFn: ({ pageParam }) => {
    return props.listDataSource({
      page: pageParam,
      search: search.value,
      orderBy: orderBy.value,
      order: order.value,
      ...props.queryVariables,
    })
  },
  getNextPageParam: (lastPage) => lastPage?.nextPage,
  select: (data) => {
    const dataSelect = data?.pages?.reduce((acc, page) => {
      return [ ...acc, ...page.docs ]
    }, [])

    return {
      ...data,
      pages: dataSelect
    }
  },
})

const formatDate = (date: string) => {
  return date ? dayjs(date).format('DD/MM/YYYY HH:mm:ss') : '-'
}

const humanizeDate = (date: string) => {
  return date
    ? capitalizeFirstLetter(humanizeDateRange(new Date, date))
    : '-'
}

const columnsToOrder = columns.filter(column => column.orderByValue).map(column => {
  return {
    label: column.orderLabel || column.label,
    orderByValue: column.orderByValue
  }
})
</script>

<template>
  <div>
    <div class="flex-col mb-sm space-y-sm">
      <VTextField
        label="Pesquisar"
        hide-details="auto"
        clearable
        @click:clear="search = undefined"
        @keyup.enter="search = $event.target.value"
      />

      <div class="flex flex-wrap gap-sm">
        <slot name="new">
          <VBtn
            @click="emit('new')"
            class="p-sm"
            color="primary"
          >
            Novo
          </VBtn>
        </slot>

        <EOrderBy
          v-if="columnsToOrder.length > 0"
          v-model:order="order"
          v-model:orderBy="orderBy"
          :columnsToOrder="columnsToOrder"
        />

        <slot name="menu" />
      </div>
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
      :data="data?.pages"
      :next-page="fetchNextPage"
      :has-next-page="hasNextPage"
      :loading="isFetchingNextPage || isFetching"
    >
      <template #default="{ item }">
        <slot :item="item" />

        <td>
          <VTooltip
            :text="formatDate(item.updatedAt)"
            location="top"
            open-on-click
          >
            <template v-slot:activator="{ props }">
              <div v-bind="props">
                {{ humanizeDate(item.updatedAt) }}
              </div>
            </template>
          </VTooltip>
        </td>
        <td>
          <VTooltip
            :text="formatDate(item.createdAt)"
            location="top"
            open-on-click
          >
            <template v-slot:activator="{ props }">
              <div v-bind="props">
                {{ humanizeDate(item.createdAt) }}
              </div>
            </template>
          </VTooltip>
        </td>

        <td v-if="$slots.actions">
          <slot :item="item" name="actions" />
        </td>
      </template>
    </ETable>
  </div>
</template>
