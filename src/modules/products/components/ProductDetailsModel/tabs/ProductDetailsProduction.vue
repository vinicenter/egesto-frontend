<script setup lang="ts">
import { numberFormat, priceFormat } from '@/src/core/utils/format';
import { IProduct } from '../../../types/product';

const { format } = numberFormat();
const { formatPrice } = priceFormat();

defineProps<{ productData: IProduct.Root | undefined }>()

const productionFormulationColumns = [
  { label: 'Matéria Prima', style: 'width: 150px' },
  { label: 'Preço Sem Icms', style: 'width: 50px' },
  { label: 'Volume usado', style: 'width: 50px' },
  { label: 'Custo total', style: 'width: 50px' }
]
</script>

<template>
  <div class="space-y-sm">
    <div class="grid grid-cols-2 gap-sm">
      <div>
        <div>Volume por produção</div>
        {{ format(productData?.production?.cost?.weightPerFormulation) }}
      </div>

      <div>
        <div>Perda</div>
        {{ format(productData?.production?.lost) }}
      </div>
    </div>

    <VDivider />

    <div class="grid grid-cols-2 gap-sm">
      <div>
        <div>Custo por unidade</div>
        {{ formatPrice(productData?.production?.cost?.unitCost) }}
      </div>

      <div>
        <div>Custo por pack</div>
        {{ formatPrice(productData?.production?.cost?.packCost) }}
      </div>
    </div>

    <VDivider />

    <div>
      <ETable
        :loading="false"
        :hasNextPage="false"
        :columns="productionFormulationColumns"
        :data="productData?.production?.formulation"
        :nextPage="() => {}"
        noDataText="Nenhuma matéria prima adicionada"
      >
        <template #default="{ item }">
          <td>
            <RouterLink
              v-if="item?.feedstock?.name"
              :to="{ name: 'edit-feedstocks', params: { id: item?.feedstock?._id } }"
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
          <td>{{ formatPrice(item?.value * item?.feedstock?.priceWithoutIcms) }}</td>
        </template>
      </ETable>
    </div>
  </div>
</template>
