<script setup lang="ts">
import { numberFormat, priceFormat } from '@/src/core/utils/format';
import { IProduct } from '../../../types/product';
import { computed } from 'vue';

const { format } = numberFormat();
const { formatPrice } = priceFormat();

const props = defineProps<{ productData: IProduct.Root | undefined }>()

const productionFormulationColumns = [
  { label: 'Matéria Prima', style: 'width: 150px' },
  { label: 'Preço Sem Icms', style: 'width: 50px' },
  { label: 'Volume usado', style: 'width: 50px' },
  { label: 'Custo total', style: 'width: 50px' },
  { label: 'Volume', style: 'width: 50px' },
]

const difference = computed(() => {
  const weightPerFormulation = props.productData?.productionCost?.weightPerFormulation || 0;
  const weightPerPack = props.productData?.packWeight || 0;

  return weightPerFormulation - weightPerPack;
});
</script>

<template>
  <div class="space-y-sm">
    <div class="grid grid-cols-2 gap-sm">
      <div>
        <div>Volume por produção</div>
        {{ format(productData?.productionCost?.weightPerFormulation) }}
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
        {{ formatPrice(productData?.productionCost?.unitCost) }}
      </div>

      <div>
        <div>Custo por pack</div>
        {{ formatPrice(productData?.productionCost?.packCost) }}
      </div>
    </div>

    <VDivider />

    <VAlert
      v-if="productData?.productionCost?.isWeightPerFormulationValid"
      type="success"
      title="Formulação válida"
      text="Peso por pack e Volume por produção conferem."
    />

    <VAlert
      v-else
      type="error"
      title="Formulação inválida"
      :text="`Peso por pack e Volume por produção não conferem. Verifique a formulação. Diferença de: ${difference}`"
    />


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
          <td>{{ formatPrice(item?.value * item?.feedstock?.priceWithoutIcms) }}</td>
          <td :class="item?.considerInVolumeProduced
            ? 'text-green'
            : 'text-red'
          ">
            {{ item?.considerInVolumeProduced ? 'Sim' : 'Não' }}
          </td>
        </template>
      </ETable>
    </div>
  </div>
</template>
