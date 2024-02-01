<script setup lang="ts">
import { numberFormat, priceFormat } from '@/src/core/utils/format';
import { IProduct } from '@/src/modules/products/types/product';
import { computed } from 'vue';

const { format } = numberFormat();
const { formatPrice } = priceFormat();

const props = defineProps<{ productData: IProduct.Root | undefined }>()

const costPackMultiplier = computed(() => {
  return props.productData?.production.useCustomPackCostMultiplier
    ? format(props.productData?.production.useCustomPackCostMultiplier)
    : 'Não habilitado'
})
</script>

<template>
  <div class="space-y-sm">
    <div class="text-lg">Produção</div>
    <div class="grid grid-cols-3 gap-sm">
      <div>
        <div>Volume por produção</div>
        {{ format(productData?.productionCost?.weightPerFormulation) }}
      </div>

      <div>
        <div>Multiplicador de custo por pack personalizado
          <VTooltip
            location="top"
            open-on-click
          >
            <template v-slot:activator="{ props }">
              <VIcon size="12" v-bind="props" icon="mdi-information-outline" />
            </template>

            <div class="flex flex-col items-center">
              <div>
                Quando habilitado, o custo por pack será multiplicado pelo valor informado.
              </div>

              <div>
                Caso não seja habilitado, o custo por pack será calculado usando o campo 'Unidades por pack'.
              </div>
            </div>
          </VTooltip>
        </div>
        {{ costPackMultiplier }}
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
      :text="
        `Peso por pack e Volume por produção não conferem. Verifique a formulação. Diferença de: ${productData?.productionCost?.weightFormulationDifference}`
      "
    />
  </div>
</template>
