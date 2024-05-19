<script lang="ts" setup>
import { required } from '@/src/core/utils/form-validator';
import { useFieldArray, useForm } from 'vee-validate';
import { IProduct } from '@/src/modules/products/types/product';
import { PricesTableFormType } from '../../../../types/pricesTable';
import ESelectProducts from '@/src/core/components/ESelect/ESelectProducts.vue';
import useNotify from '@/src/core/composables/useNotify';

interface FormValues {
  products: IProduct.Root[]
}

defineProps<{
  disabled?: boolean
}>()

const { displayMessage } = useNotify()

const { fields, push } = useFieldArray<PricesTableFormType.Price>('prices')
const { handleSubmit } = useForm<FormValues>()

const emit = defineEmits<{
  (e: 'setProductDataToPrice', indexPrice: number): void
}>()

const submit = handleSubmit(async (values) => {
  values.products.forEach(product => {
    push({
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
    })

    emit('setProductDataToPrice', fields.value.length - 1)
  })

  const message = values.products.length > 1
    ? 'Novos produtos adicionados com sucesso!'
    : 'Novo produto adicionado com sucesso!'

  displayMessage({
    message,
    type: 'success',
  })
})

const validateProduct = (products: IProduct.Root[]) => {
  for(const product of products) {
    if(fields.value.some(({ value }) => value.product._id === product._id)) {
      return 'Algum produto já foi adicionado'
    }
  }

  return true
}
</script>

<template>
  <form
    class="mx-sm mb-sm space-y-1"
    @submit.prevent
  >
    <ESelectProducts
      name="products"
      return-object
      multiple
      :rules="[required, validateProduct]"
    />

    <VBtn
      type="submit"
      color="primary"
      @click="submit"
    >
      Adicionar
    </VBtn>
  </form>
</template>
