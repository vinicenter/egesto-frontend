<script lang="ts" setup>
import { required } from '@/src/core/utils/form-validator';
import { useForm, FieldEntry, useFieldArray } from 'vee-validate';
import { PricesTableFormType } from '@/src/modules/pricesTable/types/pricesTable';
import useNotify from '@/src/core/composables/useNotify';
import EInputText from '@/src/core/components/EInput/EInputText.vue';
import { nextTick } from 'vue';

const props = defineProps<{
  disabled?: boolean,
  itemsFiltered: FieldEntry<PricesTableFormType.Price>[]
}>();

interface MenuValues {
  field: string;
  value: string;
}

const { displayMessage } = useNotify()

const { fields: prices, update } = useFieldArray<PricesTableFormType.Price>('prices')

const getPriceIndexByProductId = (productId?: string) => {
  return prices.value.findIndex(item => item.value.product._id! === productId)
}

const { handleSubmit } = useForm<MenuValues>()

const emit = defineEmits<{
  (e: 'setProductMargin', index: number): void
  (e: 'setProductPrice', index: number): void
}>()

const submit = handleSubmit(async (values) => {
  props.itemsFiltered.forEach(async (price) => {
    const priceIndex = getPriceIndexByProductId(price.value.product._id)

    const updated = {
      ...price.value,
      [values.field]: values.value,
    }

    update(priceIndex, updated)

    await nextTick()

    if(values.field === 'margin') {
      emit('setProductPrice', priceIndex)
    } else {
      emit('setProductMargin', priceIndex)
    }
  })

  displayMessage({
    message: `produtos atualizados`,
    type: 'success'
  })
})

const fieldsOptions = [
  {
    label: "Margem",
    field: "margin"
  },
  {
    label: "Preço",
    field: "price"
  },
  {
    label: "Volume",
    field: "volume"
  },
  {
    label: "Frete",
    field: "shipment",
  },
  {
    label: "Despesas",
    field: "expense",
  },
  {
    label: "Impostos",
    field: "tax",
  },
  {
    label: "Perdas de produção",
    field: "productionLost",
  }
]
</script>

<template>
  <VMenu :close-on-content-click="false" location="bottom" class="max-w-100">
    <template v-slot:activator="{ props: propsMenu }">
      <VTooltip open-on-click location="top">
        <template v-slot:activator="{ props }">
          <VBtn
            v-bind="{ ...props, ...propsMenu }"
            prepend-icon="mdi-pencil-outline"
            color="success"
            :disabled="disabled"
          >
            Alterações em massa
          </VBtn>
        </template>

        <span>Faça alterações em massa nos itens filtrados</span>
      </VTooltip>
    </template>

    <VCard title="Alterações em massa" min-width="400">
      <form class="mx-sm mb-sm space-y-1" @submit.prevent>
        <ESelect
          item-title="label"
          item-value="field"
          name="field"
          :rules="required"
          label="Campo"
          :items="fieldsOptions"
        />

        <EInputText
          type="number"
          name="value"
          :rules="required"
          label="Valor"
        />

        <VBtn
          type="submit"
          color="primary"
          @click="submit"
        >
          Aplicar
        </VBtn>
      </form>
    </VCard>
  </VMenu>
</template>
