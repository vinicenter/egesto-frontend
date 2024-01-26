<script lang="ts" setup>
import { required } from '@/src/core/utils/form-validator';
import { useForm, useFieldArray } from 'vee-validate';
import { ref } from 'vue';
import { IPricesTable } from '../types/pricesTable';
import useNotify from '@/src/core/composables/useNotify';
import EInputText from '@/src/core/components/EInput/EInputText.vue';
import ESelectFamilies from '@/src/core/components/ESelect/ESelectFamilies.vue';

defineProps<{ disabled: boolean }>();

const bulkType = ref<'all' | 'family'>('all')

const emit = defineEmits<{
  (e: 'setProductMargin', price: IPricesTable.Price, index: number): void
  (e: 'setProductPriceByMargin', price: IPricesTable.Price, index: number): void
}>()

interface MenuValues {
  field: string;
  family?: string;
  value: string;
}
const { displayMessage } = useNotify()
const { fields, update } = useFieldArray<IPricesTable.Price>('prices')

const { handleSubmit } = useForm<MenuValues>()

const submit = handleSubmit(async (values) => {
  let count = 0

  const setProducts = (price: IPricesTable.Price, index: number) => {
    if (
      bulkType.value === 'family' &&
      price.product.family?._id !== values.family
    ) {
      return
    }

    const updated = {
      ...price,
      [values.field]: values.value,
    }

    update(index, updated)

    if (values.field === 'margin') {
      emit('setProductPriceByMargin', updated, index)
    } else {
      emit('setProductMargin', updated, index)
    }

    count++
  }

  fields.value.forEach((price, index) => {
    setProducts(price.value, index)
  })

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
          <VBtn v-bind="{ ...props, ...propsMenu }" prepend-icon="mdi-pencil-outline" :disabled="disabled">
            Alterações em massa
          </VBtn>
        </template>

        <span>Faça alterações em massa em uma família especifica ou em todos os produtos da tabela de preço</span>
      </VTooltip>
    </template>

    <VCard title="Adicionar família" min-width="400">
      <form class="mx-sm mb-sm space-y-1" @submit.prevent>
        <VTabs v-model="bulkType" class="mb-4">
          <VTab value="all">
            Para todos
          </VTab>

          <VTab value="family">
            Por família
          </VTab>
        </VTabs>

        <ESelect
          item-title="label"
          item-value="field"
          name="field"
          :rules="required"
          label="Campo"
          :items="fieldsOptions"
        />

        <ESelectFamilies
          v-if="bulkType === 'family'"
          name="family"
          :rules="required"
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
