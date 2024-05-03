<script lang="ts" setup>
import { required } from '@/src/core/utils/form-validator';
import { useForm, FormContext } from 'vee-validate';
import { IPricesTable, PricesTableFormType } from '@/src/modules/pricesTable/types/pricesTable';
import useNotify from '@/src/core/composables/useNotify';
import EInputText from '@/src/core/components/EInput/EInputText.vue';

const props = withDefaults(defineProps<{
  disabled: boolean,
  bulkType: 'all' | 'family'
  indexFamily?: number
  form: FormContext<PricesTableFormType.Root, PricesTableFormType.Root>;
}>(), {
  indexFamily: 0,
});

interface MenuValues {
  field: string;
  value: string;
}

const { displayMessage } = useNotify()
const { handleSubmit } = useForm<MenuValues>()

const emit = defineEmits<{
  (e: 'setProductPriceByMargin', price: IPricesTable.Price, indexPrice: number, indexFamily: number): void
  (e: 'setProductMargin', row: IPricesTable.Price, indexPrice: number, indexFamily: number): void
}>()

const submit = handleSubmit(async (values) => {
  let count = 0

  if(props.bulkType === 'family') {
    props.form.values.pricesByFamilies[props.indexFamily].prices.forEach((price, indexPrice) => {
      const updated = {
        ...price,
        [values.field]: values.value,
      }

      props.form.setFieldValue(`pricesByFamilies.${props.indexFamily}.prices.${indexPrice}`, updated)

      if(values.field === 'margin') {
        emit('setProductPriceByMargin', updated, indexPrice, props.indexFamily)
      } else {
        emit('setProductMargin', updated, indexPrice, props.indexFamily)
      }

      count++
    })
  } else {
    props.form.values.pricesByFamilies.forEach((pricesByFamily, indexFamily) => {
      pricesByFamily.prices.forEach((price, indexPrice) => {
        const updated = {
          ...price,
          [values.field]: values.value,
        }

        props.form.setFieldValue(`pricesByFamilies.${indexFamily}.prices.${indexPrice}`, updated)

        if(values.field === 'margin') {
          emit('setProductPriceByMargin', updated, indexPrice, indexFamily)
        } else {
          emit('setProductMargin', updated, indexPrice, indexFamily)
        }

        count++
      })
    })
  }

  const addPluralText = count > 1 ? 's' : ''
  displayMessage({
    message: `${count} produto${addPluralText} atualizado${addPluralText}`,
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

        <span v-if="bulkType === 'all'">Faça alterações em massa em todos os produtos da tabela de preço</span>
        <span v-else>Faça alterações em massa nos produtos da família</span>
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
