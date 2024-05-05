<script setup lang="ts">
import { useFieldArray, useFormValues } from 'vee-validate';
import { computed } from 'vue';
import { ref } from 'vue';
import { IPricesTable, PricesTableFormType } from '../../../../types/pricesTable';
import { getProducts } from '@/src/modules/products/datasource/products';
import { IProduct } from '@/src/modules/products/types/product';
import useNotify from '@/src/core/composables/useNotify';

const props = defineProps<{
  familyIndex: number
  disabled?: boolean
}>()

const loading = ref(false)

const { displayMessage } = useNotify()
const { fields, push } = useFieldArray<IPricesTable.Price>(computed(() => `pricesByFamilies.${props.familyIndex}.prices`))
const formValues = useFormValues<PricesTableFormType.Root>()

const emit = defineEmits<{
  (e: 'setProductDataToPrice', row: IPricesTable.Price, indexPrice: number, indexFamily: number): void
}>()

const updateFamilyProducts = async (close: () => void) => {
  const family = formValues.value.pricesByFamilies?.[props.familyIndex]?.family

  if(!family) {
    throw new Error('Family index not found')
  }

  try {
    loading.value = true

    const products = await getProducts({
      limit: 1000,
      page: 1,
      familyId: family._id,
      orderBy: 'name',
      order: 'ASC'
    })

    let count = 0

    products.docs.forEach((product: IProduct.Root) => {
      if(fields.value.find(({ value }) => value?.product?._id === product._id)) {
        return
      }

      const price = {
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

      push(price)
      emit('setProductDataToPrice', price, fields.value.length - 1, props.familyIndex)

      count++
    })

    const productLabel = count > 1 ? 'produtos' : 'produto'

    const message = count
      ? `${count} ${productLabel} adicionados com sucesso!`
      : 'Nenhum novo produto encontrado!'

    displayMessage({ message, type: 'success' })

    close()
  } catch {
    displayMessage({
      message: 'Erro ao procurar produtos da família!',
      type: 'error',
    })
  }
  finally {
    loading.value = false
  }

}
</script>

<template>
  <EDialogConfirm
		max-width="500"
    title="Deseja adicionar todos os produtos da família?"
    text="Adicione todos os produtos da família para dentro da tabela de preço"
    dont-close-on-confirm
    @confirm="updateFamilyProducts"
  >
    <template v-slot:activator="{ props }">
      <VTooltip open-on-click location="top">
        <template v-slot:activator="{ props: propsTooltip }">
          <VBtn
            v-bind="{ ...propsTooltip, ...props }"
            prepend-icon="mdi-plus"
            color="primary"
            :disabled="disabled"
          >
            Adicionar todos os produtos
          </VBtn>
        </template>

        <span>Adicione todos os produtos da família para dentro da tabela de preço</span>
      </VTooltip>
		</template>

    <template #actions="{ confirm, close }">
      <VBtn @click="close">
        Cancelar
      </VBtn>

      <VBtn
        color="primary"
        :loading="loading"
        @click="confirm"
      >
        Adicionar
      </VBtn>
    </template>
  </EDialogConfirm>
</template>
