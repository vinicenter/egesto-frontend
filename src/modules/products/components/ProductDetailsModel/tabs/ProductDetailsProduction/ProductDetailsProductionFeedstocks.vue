<script setup lang="ts">
import { numberFormat, priceFormat } from '@/src/core/utils/format';
import { IProduct } from '@/src/modules/products/types/product';

defineProps<{ productData: IProduct.Root | undefined }>()

const { format } = numberFormat();
const { formatPrice } = priceFormat();

const productionFormulationColumns = [
  { label: 'Matéria Prima', style: 'width: 150px' },
  { label: 'Preço Sem Icms', style: 'width: 50px' },
  { label: 'Volume usado', style: 'width: 50px' },
  { label: 'Custo total', style: 'width: 50px' },
  { label: 'Volume', style: 'width: 50px' },
]
</script>

<template>
  <ETable
    :loading="false"
    :hasNextPage="false"
    :columns="productionFormulationColumns"
    :data="productData?.production?.formulation.feedstocks"
    :nextPage="() => {}"
    noDataText="Nenhuma matéria prima adicionada"
  >
    <template #default="{ item }">
      <td>
        <RouterLink
          v-if="item?.feedstock?.name"
          :to="{ name: 'feedstock', params: { id: item?.feedstock?._id, type: 'editar' } }"
        >
          {{ item?.feedstock?.name }}
        </RouterLink>

        <a v-else>-</a>
      </td>
      <td>{{ formatPrice(item?.feedstock?.priceWithoutIcms) }}</td>
      <td :class="item?.considerInWeightCalculation
        ? 'text-green'
        : 'text-red'
      ">
        {{ format(item?.value) }}
      </td>
      <td>{{ formatPrice(item?.value.toFixed(5) * item?.feedstock?.priceWithoutIcms.toFixed(5)) }}</td>
      <td :class="item?.considerInVolumeProduced
        ? 'text-green'
        : 'text-red'
      ">
        {{ item?.considerInVolumeProduced ? 'Sim' : 'Não' }}
      </td>
    </template>
  </ETable>
</template>
