<script lang="ts" setup>
import { required } from '@/src/core/utils/form-validator';
import { useForm, useFieldArray, useFormValues } from 'vee-validate';
import { ref, computed } from 'vue';
import { getProducts } from '@/src/modules/products/datasource/products';
import { IPricesTable } from '@/src/modules/pricesTable/types/pricesTable';
import useNotify from '@/src/core/composables/useNotify';

defineProps<{ disabled: boolean }>();

const loading = ref(false)

const {
  displayMessage
} = useNotify()

const { fields, insert } = useFieldArray('prices')
const values = useFormValues()
const arrayValues = computed(() => values.value.prices)

const emit = defineEmits<{
  (e: 'loadProductData', price: IPricesTable.Price, index: number): void;
}>();

const { handleSubmit } = useForm()

const isProductAlreadyAdded = (productId?: string) => {
  return arrayValues.value.some((price: IPricesTable.Price) => price.product?._id === productId)
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

    addPricesToForm(newPrices)
  } catch (e) {
    displayMessage({
      message: 'Erro ao adicionar produtos da família!',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
})

const addPricesToForm = (newPrices: IPricesTable.Price[]) => {
  newPrices.forEach((newPrice: IPricesTable.Price) => {
    if (isProductAlreadyAdded(newPrice.product._id)) {
      return
    }

    const index = fields.value.length || 0
    insert(index, newPrice)

    emit('loadProductData', newPrice, index)
  })

  if(!newPrices.length) {
    displayMessage({
      message: 'Nenhum produto encontrado na família!',
      type: 'error',
    })
  }
  else {
    displayMessage({
      message: 'Produtos adicionados com sucesso!',
      type: 'success',
    })
  }
}
</script>

<template>
  <VMenu
    :close-on-content-click="false"
    location="bottom"
  >
    <template v-slot:activator="{ props: propsMenu }">
      <VTooltip
        open-on-click
        location="top"
      >
        <template v-slot:activator="{ props }">
          <VBtn
            v-bind="{ ...props, ...propsMenu }"
            prepend-icon="mdi-tag"
            :disabled="disabled"
          >
            Adicionar família
          </VBtn>
        </template>

        <span>Adicione todos os produtos de uma família a tabela de preço</span>
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
          :rules="required"
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
