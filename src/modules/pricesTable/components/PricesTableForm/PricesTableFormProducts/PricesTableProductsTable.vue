<script setup lang="ts">
import { required } from '@/src/core/utils/form-validator';
import { PricesTableFormType } from '../../../types/pricesTable';
import { FieldEntry, useFieldValue } from 'vee-validate';

defineProps<{
  itemsFiltered: FieldEntry<PricesTableFormType.Price>[]
  disabled?: boolean
}>()

const prices = useFieldValue<PricesTableFormType.Price[]>('prices')

const emit = defineEmits<{
  (e: 'setProductMargin', index: number): void
  (e: 'setProductPrice', index: number): void
  (e: 'syncProduct', index: number, notify: boolean): void
  (e: 'remove', index: number): void
}>()

const remove = (index: number) => emit('remove', index)
const setProductMargin = (index: number) => emit('setProductMargin', index)
const setProductPrice = (index: number) => emit('setProductPrice', index)
const syncProduct = (index: number, notify: boolean) => emit('syncProduct', index, notify)

const headers = [
  {
    title: 'Produto',
    value: 'product'
  },
  {
    title: 'Informações',
    value: 'informations'
  }
]

const getPriceIndexByProductId = (productId?: string) => {
  return prices.value.findIndex(item => item.product._id! === productId)
}

const perPage = [
  {value: 5, title: '5'},
  {value: 10, title: '10'},
]
</script>

<template>
  <VDataTable
    :headers="headers"
    :items="itemsFiltered"
    :items-per-page-options="perPage"
  >
    <template v-slot:item.product="{ item }">
      <div class="flex flex-col items-start space-y-sm">
        <div>
          {{ item.value.product.name }}
        </div>

        <div class="flex gap-x-xs">
          <PricesTableSync
            tooltip-text="Sincronizar custo do produto, tabela de custo e custos da família"
            :disabled="disabled"
            @confirm="syncProduct(getPriceIndexByProductId(item.value.product._id), true)"
          />

          <PricesTableRemove
            tooltip-text="Remover produto"
            :disabled="disabled"
            @confirm="remove(getPriceIndexByProductId(item.value.product._id))"
          />

          <VTooltip
            v-if="item.value.product.code"
            open-on-click
          >
            <template v-slot:activator="{ props }">
              <VChip
                v-bind="props"
                :disabled="disabled"
              >
                {{ item.value.product.code }}
              </VChip>
            </template>

            <span>Código do produto</span>
          </VTooltip>
        </div>
      </div>
    </template>

    <template v-slot:item.informations="{ item }">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-x-xs mt-sm">
        <EInputPrice
          :name="`prices.${getPriceIndexByProductId(item.value.product._id)}.price`"
          :rules="[required]"
          :disabled="disabled || !item.value.product"
          label="Preço de venda"
          keep-values-on-unmount
          @update:model-value="setProductMargin(getPriceIndexByProductId(item.value.product._id))"
        />

        <EInputText
          :name="`prices.${getPriceIndexByProductId(item.value.product._id)}.volume`"
          :rules="[required]"
          :disabled="disabled || !item.value.product"
          type="number"
          label="Volume"
          keep-values-on-unmount
          @update:model-value="setProductMargin(getPriceIndexByProductId(item.value.product._id))"
        />

        <EInputPct
          :name="`prices.${getPriceIndexByProductId(item.value.product._id)}.shipment`"
          :rules="[required]"
          :disabled="disabled"
          label="Frete"
          keep-values-on-unmount
          @update:model-value="setProductMargin(getPriceIndexByProductId(item.value.product._id))"
        />

        <EInputPct
          :name="`prices.${getPriceIndexByProductId(item.value.product._id)}.expense`"
          :rules="[required]"
          :disabled="disabled"
          label="Despesas"
          keep-values-on-unmount
          @update:model-value="setProductMargin(getPriceIndexByProductId(item.value.product._id))"
        />

        <EInputPrice
          :name="`prices.${getPriceIndexByProductId(item.value.product._id)}.productCost`"
          :rules="[required]" :disabled="disabled || !item.value.product"
          label="Custo do produto"
          keep-values-on-unmount
          @update:model-value="setProductMargin(getPriceIndexByProductId(item.value.product._id))"
        />

        <EInputPrice
          :name="`prices.${getPriceIndexByProductId(item.value.product._id)}.grossRevenue`"
          :rules="[required]"
          :disabled="disabled || !item.value.product"
          label="Fat. bruto"
          keep-values-on-unmount
          readonly
        />

        <EInputPrice
          :name="`prices.${getPriceIndexByProductId(item.value.product._id)}.netSales`"
          :rules="[required]"
          :disabled="disabled || !item.value.product"
          label="Fat. liquido"
          keep-values-on-unmount
          readonly
        />

        <EInputPct
          :name="`prices.${getPriceIndexByProductId(item.value.product._id)}.tax`"
          :rules="[required]"
          :disabled="disabled"
          label="Impostos"
          keep-values-on-unmount
          @update:model-value="setProductMargin(getPriceIndexByProductId(item.value.product._id))"
        />

        <EInputPct
          :name="`prices.${getPriceIndexByProductId(item.value.product._id)}.productionLost`"
          :rules="[required]"
          :disabled="disabled"
          label="Perda"
          keep-values-on-unmount
          @update:model-value="setProductMargin(getPriceIndexByProductId(item.value.product._id))"
        />

        <EInputPct
          :name="`prices.${getPriceIndexByProductId(item.value.product._id)}.margin`"
          :rules="[required]"
          :disabled="disabled || !item.value.product"
          label="Margem"
          keep-values-on-unmount
          @blur="setProductPrice(getPriceIndexByProductId(item.value.product._id))"
        />
      </div>
    </template>
  </VDataTable>
</template>
