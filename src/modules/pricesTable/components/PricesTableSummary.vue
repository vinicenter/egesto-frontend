<script setup lang="ts">
import { priceFormat, numberFormat } from '@/src/core/utils/format';
import { computed } from 'vue';

const props = defineProps<{
  volumeTotal: number;
  grossRevenue: number;
  totalNetRevenue: number;
  mediumMargin: number;
}>()

const { formatPrice } = priceFormat();
const { format } = numberFormat();

const volume = computed(() => {
  if(!props.volumeTotal) return 'Adicione volume'

  if(props.volumeTotal > 1) {
    return `${props.volumeTotal} volumes`
  }

  return `${props.volumeTotal} volume`
})
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-sm">
    <VTooltip location="bottom" open-on-click>
      <template #activator="{ props }">
        <VCard
          v-bind="props"
          class="w-full hover:cursor-help"
          title="Volume"
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
      <span>Média da margem de todos os produtos</span>
    </VTooltip>
  </div>
</template>
