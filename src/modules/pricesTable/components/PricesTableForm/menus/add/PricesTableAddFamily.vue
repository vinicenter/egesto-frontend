<script lang="ts" setup>
import useNotify from '@/src/core/composables/useNotify';
import { required } from '@/src/core/utils/form-validator';
import { getProducts } from '@/src/modules/products/datasource/products';
import { useFieldArray, useForm } from 'vee-validate';
import { ref } from 'vue';
import { IPricesTable, PricesTableFormType } from '../../../../types/pricesTable';

const { fields, insert } = useFieldArray<PricesTableFormType.PricesByFamilies>('pricesByFamilies')
const { handleSubmit } = useForm()

const loading = ref()

const { displayMessage } = useNotify()

defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'setProductDataToPrice', row: IPricesTable.Price, indexPrice: number, indexFamily: number): void
}>()

const addFamily = (newPricesByFamily: PricesTableFormType.PricesByFamilies) => {
  if(fields.value.find(({ value }) => value.family._id === newPricesByFamily.family._id)) {
    displayMessage({
      message: 'Família já adicionada!',
      type: 'error',
    })

    return
  }

  insert(fields.value.length, newPricesByFamily)

  newPricesByFamily.prices.forEach((price, indexPrice) => {
    emit('setProductDataToPrice', price, indexPrice, fields.value.length - 1)
  })

  displayMessage({
    message: 'Produtos adicionados com sucesso!',
    type: 'success',
  })
}

const submit = handleSubmit(async (values) => {
  try {
    loading.value = true

    const products = await getProducts({
      limit: 1000,
      page: 1,
      familyId: values.family,
      orderBy: 'name',
      order: 'ASC'
    })

    const newPrices = products.docs.map((product: any): IPricesTable.Price => ({
      product: product,
      expense: 0,
      grossRevenue: 0,
      margin: 0,
      netSales: 0,
      price: 0,
      productCost: 0,
      productionLost: 0,
      shipment: 0,
      tax: 0,
      volume: 1,
    }))

    const family: PricesTableFormType.PricesByFamilies = {
      family: products.docs[0].family,
      prices: newPrices,
    }

    addFamily(family)
  } catch (e) {
    displayMessage({
      message: 'Erro ao adicionar produtos da família!',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
})

const validateFamily = (familyId: string) => {
  return !fields.value.find(({ value }) => value.family._id === familyId) || 'Família já adicionada!'
}
</script>

<template>
  <VMenu
    :close-on-content-click="false"
    location="bottom"
    class="max-w-300px"
  >
    <template v-slot:activator="{ props: propsMenu }">
      <VTooltip
        open-on-click
        location="top"
      >
        <template v-slot:activator="{ props }">
          <VBtn
            v-bind="{ ...props, ...propsMenu }"
            prepend-icon="mdi-plus"
            color="primary"
            :disabled="disabled"
          >
            Adicionar família
          </VBtn>
        </template>

        <span>Adicione uma família a tabela de preço</span>
      </VTooltip>
    </template>

    <VCard
      title="Adicionar família"
      min-width="400"
    >
      <form
        class="mx-sm mb-sm space-y-1"
        @submit.prevent
      >
        <ESelectFamilies
          name="family"
          :rules="[required, validateFamily]"
          familyType="linked"
          :clearable="false"
        />

        <VBtn
          type="submit"
          color="primary"
          :loading="loading"
          @click="submit"
        >
          Adicionar
        </VBtn>
      </form>
    </VCard>
  </VMenu>
</template>
