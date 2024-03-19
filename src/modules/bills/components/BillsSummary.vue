<script setup lang="ts">
import { priceFormat, numberFormat } from '@/src/core/utils/format';
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getSummaryBills } from '@/src/modules/bills/datasource/bills'
import { useBillsFilterStore } from '../stores/use-bills-filter-store';

const { formatPrice } = priceFormat({
  minimumFractionDigits: 2,
});

const { format } = numberFormat(undefined, {
  minimumFractionDigits: 0,
});

const billsFilterStore = useBillsFilterStore()
const queryKey = computed(() => ['bills-summary', billsFilterStore.queryVariables])

const {
  data,
  isLoading,
} = useQuery({
  queryKey,
  queryFn: () => getSummaryBills(billsFilterStore.queryVariables)
})

const summaries = computed(() => [
  {
    title: 'Total de contas',
    text: format(data.value?.billsCount || 0),
    tooltip: 'Este é o total de contas exibido na tabela',
    isLoading: isLoading.value
  },
  {
    title: 'Valor contas',
    text: formatPrice(data.value?.billsAmount || 0),
    tooltip: 'Soma do valor das contas paga e não pagas com o filtro atual',
    isLoading: isLoading.value
  },
  {
    title: 'Valor contas pagas',
    text: formatPrice(data.value?.billsPaidAmount || 0),
    tooltip: 'Soma do valor das contas pagas com o filtro atual',
    isLoading: isLoading.value
  },
  {
    title: 'Valor contas não pagas',
    text: formatPrice(data.value?.billsUnpaidAmount || 0),
    tooltip: 'Soma do valor das contas não pagas com o filtro atual',
    isLoading: isLoading.value
  }
])
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-sm">
    <VTooltip
      v-for="summary, index in summaries"
      :key="`summary-${index}`"
      location="bottom"
      open-on-click
    >
      <template #activator="{ props }">
        <VCard
          v-bind="props"
          class="w-full hover:cursor-help"
          :title="summary.title"
          :text="summary.text"
          :loading="summary.isLoading"
        />
      </template>
      <span>{{ summary.tooltip }}</span>
    </VTooltip>
  </div>
</template>
