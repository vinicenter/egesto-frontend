<script setup lang="ts">
import { priceFormat, numberFormat } from '@/src/core/utils/format';
import type { IPricesTable, PricesTableFormType } from '../types/pricesTable';
import { computed } from 'vue';
import { useFormValues } from 'vee-validate';

const { formatPrice } = priceFormat();
const { format } = numberFormat();

const formValues = useFormValues<PricesTableFormType.Root>()

const prices = computed(() => formValues.value.prices);

const itemsTotal = computed(() => {
  if(!prices.value) {
    return
  }

  return prices.value.length;
})

const volumeTotal = computed(() => {
  if(!prices.value) {
    return 0
  }

  return prices.value.reduce((acc: number, price: IPricesTable.Price) => {
    return price.volume
      ? acc + Number(price.volume)
      : acc;
  }, 0);
})

const grossRevenue = computed(() => {
  if(!prices.value) {
    return 0
  }

  return prices.value.reduce((acc: number, price: IPricesTable.Price) => {
    return price.grossRevenue
      ? acc + Number(price.grossRevenue)
      : acc;
  }, 0);
})

const totalNetRevenue = computed(() => {
  if(!prices.value) {
    return 0
  }

  return prices.value.reduce((acc: number, price: IPricesTable.Price) => {
    return price.netSales
      ? acc + Number(price.netSales)
      : acc;
  }, 0);
})

const mediumMargin = computed(() => {
  if(!prices.value) {
    return
  }

  const results: { subtotal: number, margin: number }[] = []

  prices.value.forEach((price) => {
    const subtotal = price.price * price.volume
    const margin = subtotal * (price.margin / 100)

    results.push({ margin, subtotal })
  })

  const totalMargin = results.reduce((acc, result) => acc + result.margin, 0)
  const totalSubtotal = results.reduce((acc, result) => acc + result.subtotal, 0)

  return totalMargin / totalSubtotal * 100
})

const items = computed(() => {
  if(!itemsTotal.value) return 'Adicione itens'

  if(itemsTotal.value > 1) {
    return `${itemsTotal.value} itens`
  }

  return `${itemsTotal.value} item`
})

const volume = computed(() => {
  if(!volumeTotal.value) return 'Adicione volume'

  if(volumeTotal.value > 1) {
    return `${volumeTotal.value} volumes`
  }

  return `${volumeTotal.value} volume`
})
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-5 gap-sm">
    <VTooltip location="bottom" open-on-click>
      <template #activator="{ props }">
        <VCard
          v-bind="props"
          class="w-full hover:cursor-help"
          title="Itens"
          :text="items.toString()"
        />
      </template>
      <span>Total de itens adicionados</span>
    </VTooltip>

    <VTooltip location="bottom" open-on-click>
      <template #activator="{ props }">
        <VCard
          v-bind="props"
          class="w-full hover:cursor-help"
          title="Volumes"
          :text="volume.toString()"
        />
      </template>
      <span>Soma do volume de todos os produtos</span>
    </VTooltip>

    <VTooltip location="bottom" open-on-click>
      <template #activator="{ props }">
        <VCard
          v-bind="props"
          class="w-full hover:cursor-help"
          title="Faturamento bruto"
          :text="formatPrice(grossRevenue)"
        />
      </template>
      <span>Soma do faturamento bruto de todos os produtos</span>
    </VTooltip>

    <VTooltip location="bottom" open-on-click>
      <template #activator="{ props }">
        <VCard
          v-bind="props"
          class="w-full hover:cursor-help"
          title="Faturamento liquido"
          :text="formatPrice(totalNetRevenue)"
        />
      </template>
      <span>Soma do faturamento liquido de todos os produtos</span>
    </VTooltip>

    <VTooltip location="bottom" open-on-click>
      <template #activator="{ props }">
        <VCard
          v-bind="props"
          class="w-full hover:cursor-help"
          title="Margem média"
          :text="`${format(mediumMargin)}%`"
        />
      </template>
      <span>Margem média</span>
    </VTooltip>
  </div>
</template>
