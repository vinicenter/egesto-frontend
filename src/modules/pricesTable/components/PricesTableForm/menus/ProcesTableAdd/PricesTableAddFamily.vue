<script lang="ts" setup>
import useNotify from '@/src/core/composables/useNotify';
import { required } from '@/src/core/utils/form-validator';
import { getProducts } from '@/src/modules/products/datasource/products';
import { useFieldArray, useForm } from 'vee-validate';
import { ref } from 'vue';
import { PricesTableFormType } from '../../../../types/pricesTable';
import { IProduct } from '@/src/modules/products/types/product';

const { fields, push } = useFieldArray<PricesTableFormType.Price>('prices')
const { handleSubmit } = useForm()

const loading = ref()

const { displayMessage } = useNotify()

defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'setProductDataToPrice', indexPrice: number): void
}>()

const checkIfProductIsAlreadyAdded = (productId: string) => {
  return fields.value.some(({ value }) => value.product._id === productId)
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

    products.docs.forEach((product: IProduct.Root) => {
      if(checkIfProductIsAlreadyAdded(product._id!)) {
        return
      }

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

    displayMessage({
      message: 'Nova família adicionada com sucesso!',
      type: 'success',
    })
  } catch (e) {
    displayMessage({
      message: 'Erro ao adicionar produtos da família!',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <form
    class="mx-sm mb-sm space-y-1"
    @submit.prevent
  >
    <ESelectFamilies
      name="family"
      :rules="[required]"
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
</template>
