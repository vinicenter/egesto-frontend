<script lang="ts" setup>
import useNotify from '@/src/core/composables/useNotify';
import { required } from '@/src/core/utils/form-validator';
import { FormContext, useFieldArray, useForm, useFormValues } from 'vee-validate';
import { IProduct } from '@/src/modules/products/types/product';
import { IPricesTable, PricesTableFormType } from '../../../../types/pricesTable';
import ESelectProducts from '@/src/core/components/ESelect/ESelectProducts.vue';
import { computed, nextTick } from 'vue';

interface FormValues {
  product: IProduct.Root
}

const props = defineProps<{
  disabled?: boolean
  familyId?: string
  form: FormContext<PricesTableFormType.Root, PricesTableFormType.Root>;
}>()

const formValues = useFormValues<PricesTableFormType.Root>()
const { fields: fieldsPricesByFamilies, push: pushPricesByFamilies } = useFieldArray<PricesTableFormType.PricesByFamilies>('pricesByFamilies')
const { handleSubmit } = useForm<FormValues>()
const { displayMessage } = useNotify()

const emit = defineEmits<{
  (e: 'setProductDataToPrice', row: IPricesTable.Price, indexPrice: number, indexFamily: number): void
}>()

const addProductToFamily = async (product: IProduct.Root) => {
  const familyIndex = fieldsPricesByFamilies.value.findIndex(({ value }) => value.family._id === product.family!._id)

  const isProductAlreadyAdded = fieldsPricesByFamilies.value[familyIndex].value.prices.find((value) => value.product._id === product._id)

  if (isProductAlreadyAdded) {
    displayMessage({
      message: 'Produto já adicionado!',
      type: 'error',
    })

    return
  }

  const newPrice = {
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
    }

  props.form.setFieldValue(`pricesByFamilies.${familyIndex}.prices`, [
    ...fieldsPricesByFamilies.value[familyIndex].value.prices,
    newPrice
  ])

  const priceIndex = fieldsPricesByFamilies.value[familyIndex].value.prices.length

  await nextTick()

  emit('setProductDataToPrice', newPrice, priceIndex, familyIndex)

  displayMessage({
    message: 'Produto adicionado com sucesso!',
    type: 'success',
  })
}

const addProductAndFamily = async (product: IProduct.Root) => {
  const familyIndex = fieldsPricesByFamilies.value.length

  const newPrice = {
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
  }

  pushPricesByFamilies({
    family: product.family!,
    prices: [ newPrice ]
  })

  await nextTick()

  emit('setProductDataToPrice', newPrice, 0, familyIndex)

  displayMessage({
    message: 'Produto e família adicionado com sucesso!',
    type: 'success',
  })
}

const submit = handleSubmit(async (values) => {
  const product = values.product

  if(!product.family) {
    displayMessage({
      message: 'O produto selecionado deve ser relacionado a uma família!',
      type: 'error',
    })

    return
  }

  const isFamilyAlreadyAdded = fieldsPricesByFamilies.value.find(({ value }) => value.family._id === product.family!._id)

  isFamilyAlreadyAdded
    ? addProductToFamily(product)
    : addProductAndFamily(product)
})

const prices = computed(() => formValues.value.pricesByFamilies?.flatMap(({ prices }) => prices))

const validateProduct = (value: IProduct.Root) => {
  if(prices.value?.find(({ product }) => product._id === value._id)) {
    return 'Produto já adicionado!'
  }

  return true
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
            Adicionar produto
          </VBtn>
        </template>

        <span>Adicione produtos a tabela de preço</span>
      </VTooltip>
    </template>

    <VCard
      title="Adicionar produto"
      min-width="400"
    >
      <form
        class="mx-sm mb-sm space-y-1"
        @submit.prevent
      >
        <ESelectProducts
          name="product"
          return-object
          with-family
          :family-id="familyId"
          :rules="[required, validateProduct]"
          :clearable="false"
        />

        <VBtn
          type="submit"
          color="primary"
          @click="submit"
        >
          Adicionar
        </VBtn>
      </form>
    </VCard>
  </VMenu>
</template>
