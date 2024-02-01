<script setup lang="ts">
import { numberFormat, priceFormat } from '@/src/core/utils/format';
import { IProduct } from '@/src/modules/products/types/product';

defineProps<{ productData: IProduct.Root | undefined }>()

const { format } = numberFormat();
const { formatPrice } = priceFormat();

const productionFormulationColumns = [
  { label: 'Produto', style: 'width: 150px' },
  { label: 'Custo', style: 'width: 50px' },
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
    :data="productData?.production?.formulation.products"
    :nextPage="() => {}"
    noDataText="Nenhuma produto adicionado"
  >
    <template #default="{ item }">
      <td>
        <RouterLink
          v-if="item?.product?.name"
          :to="{ name: 'product', params: { id: item?.product?._id, type: 'editar' } }"
        >
          {{ item?.product?.name }}
        </RouterLink>

        <a v-else>-</a>
      </td>
      <td>{{ formatPrice(item?.product?.productionCost?.unitCost) }}</td>
      <td :class="item?.considerInWeightCalculation
        ? 'text-green'
        : 'text-red'
      ">
        {{ format(item?.value) }}
      </td>
      <td>{{ formatPrice(item?.value.toFixed(5) * item?.product?.productionCost?.unitCost.toFixed(5)) }}</td>
      <td :class="item?.considerInVolumeProduced
        ? 'text-green'
        : 'text-red'
      ">
        {{ item?.considerInVolumeProduced ? 'Sim' : 'Não' }}
      </td>
    </template>
  </ETable>
</template>
